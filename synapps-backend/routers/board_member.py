# routers/board_member.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from database import get_db
from models.board_member import BoardMember, RoleType
from schemas.board_member import BoardMemberCreate, BoardMemberResponse, BoardMemberUpdate, BoardMemberWithUserResponse
from models.notification import Notification
from models.project_board import ProjectBoard
from schemas.notification import NotificationCreate
from models.user import User

router = APIRouter(prefix="/board-members", tags=["board_members"])

# Yeni bir board üyesi oluşturma
@router.post("/", response_model=BoardMemberResponse, status_code=201)
async def create_board_member(board_member: BoardMemberCreate, db: AsyncSession = Depends(get_db)):
    # Aynı board_id ve user_id kombinasyonunun varlığını kontrol et
    result = await db.execute(
        select(BoardMember).where(
            BoardMember.board_id == board_member.board_id,
            BoardMember.user_id == board_member.user_id
        )
    )
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="User is already a member of this board")

    # Board bilgisini al
    board = await db.get(ProjectBoard, board_member.board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board bulunamadı")

    # Eğer owner ekleniyorsa doğrudan ekle
    if board_member.role == RoleType.OWNER:
        db_board_member = BoardMember(**board_member.dict())
        db.add(db_board_member)
        await db.commit()
        await db.refresh(db_board_member)
        return db_board_member

    # Owner değilse notification (davet) oluştur
    notification = Notification(
        user_id=board_member.user_id,
        notification_type="board_invitation",
        message=f"'{board.name}' panosuna katılmak için davet edildiniz.",
        related_item_id=board.id,
        related_item_type="board",
        data={"board_id": board.id, "board_name": board.name}
    )
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    # Davet bildirimi oluşturulduktan sonra, BoardMember eklenmez. Kullanıcı daveti kabul edince eklenecek.
    return None

# Tüm board üyelerini listeleme (isteğe bağlı board_id veya user_id filtresi)
@router.get("/", response_model=List[BoardMemberWithUserResponse])
async def get_board_members(
    board_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(BoardMember).options(selectinload(BoardMember.user))
    if board_id is not None:
        query = query.where(BoardMember.board_id == board_id)
    result = await db.execute(query)
    members = result.scalars().all()
    if not members:
        return []
    return members

# Belirli bir board üyesini alma
@router.get("/{member_id}", response_model=BoardMemberResponse)
async def get_board_member(member_id: int, db: AsyncSession = Depends(get_db)):
    member = await db.get(BoardMember, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Board member not found")
    return member

# Board üyesini güncelleme (örneğin, rol değiştirme)
@router.put("/{member_id}", response_model=BoardMemberResponse)
async def update_board_member(
    member_id: int,
    member_update: BoardMemberUpdate,
    db: AsyncSession = Depends(get_db)
):
    member = await db.get(BoardMember, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Board member not found")
    
    # Güncellenecek alanları kontrol et ve uygula
    update_data = member_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(member, key, value)
    
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return member

# Board üyesini silme
@router.delete("/{member_id}", status_code=204)
async def delete_board_member(member_id: int, db: AsyncSession = Depends(get_db)):
    member = await db.get(BoardMember, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Board member not found")
    
    await db.delete(member)
    await db.commit()
    return None

@router.post("/accept-invitation/{notification_id}", response_model=BoardMemberResponse)
async def accept_board_invitation(
    notification_id: int,
    db: AsyncSession = Depends(get_db)
):
    # Bildirimi bul
    result = await db.execute(
        select(Notification).where(Notification.id == notification_id)
    )
    notification = result.scalars().first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Bildirim bulunamadı")
    
    if notification.notification_type != "board_invitation":
        raise HTTPException(status_code=400, detail="Geçersiz bildirim türü")
    
    # Board üyesi olarak ekle
    board_member = BoardMember(
        board_id=notification.data["board_id"],
        user_id=notification.user_id,
        role=RoleType.MEMBER
    )
    db.add(board_member)
    
    # Bildirimi sil
    await db.delete(notification)
    
    await db.commit()
    await db.refresh(board_member)
    
    return board_member

@router.post("/request")
async def request_board_membership(data: dict, db: AsyncSession = Depends(get_db)):
    email = data.get("email")
    board_id = data.get("board_id")
    inviter_id = data.get("inviter_id")
    if not email or not board_id:
        raise HTTPException(status_code=400, detail="E-posta ve board_id zorunludur.")

    # Kullanıcıyı bul
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")

    # Zaten üye mi?
    result = await db.execute(select(BoardMember).where(BoardMember.board_id == board_id, BoardMember.user_id == user.id))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Bu kullanıcı zaten üye.")

    # Zaten bekleyen daveti var mı?
    result = await db.execute(select(Notification).where(
        Notification.user_id == user.id,
        Notification.notification_type == "board_invitation",
        Notification.related_item_id == board_id
    ))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Bu kullanıcıya zaten davet gönderilmiş.")

    # Board bilgisini al
    board = await db.get(ProjectBoard, board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board bulunamadı.")

    # Davet bildirimi oluştur
    notification = Notification(
        user_id=user.id,
        notification_type="board_invitation",
        message=f"'{board.name}' panosuna katılmak için davet edildiniz.",
        related_item_id=board.id,
        related_item_type="board",
        data={"board_id": board.id, "board_name": board.name, "inviter_id": inviter_id}
    )
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return {"detail": "Davet bildirimi gönderildi."}