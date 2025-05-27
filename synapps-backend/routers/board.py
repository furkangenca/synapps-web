# routers/board.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from database import get_db
from models.project_board import ProjectBoard
from schemas.board import ProjectBoardCreate, ProjectBoardResponse, ProjectBoardUpdate
from models.board_member import BoardMember, RoleType
from models.column import Column

# Varsayılan sütunlar
DEFAULT_COLUMNS = [
    {"title": "Yapılacak", "position": 0},
    {"title": "Devam Ediyor", "position": 1},
    {"title": "Tamamlandı", "position": 2}
]

router = APIRouter(prefix="/boards", tags=["boards"])

# Yeni bir board oluşturma
@router.post("/", response_model=ProjectBoardResponse, status_code=201)
async def create_board(board: ProjectBoardCreate, db: AsyncSession = Depends(get_db)):
    # Board'u oluştur
    db_board = ProjectBoard(
        name=board.name,
        description=board.description if hasattr(board, 'description') else None,
        user_id=board.user_id
    )
    db.add(db_board)
    await db.commit()
    await db.refresh(db_board)
    
    # Board owner'ı board_members tablosuna ekle
    owner_member = BoardMember(
        board_id=db_board.id,
        user_id=board.user_id,
        role=RoleType.OWNER
    )
    db.add(owner_member)
    
    # Default kolonları ekle
    for col_data in DEFAULT_COLUMNS:
        db_column = Column(
            title=col_data["title"],
            position=col_data["position"],
            board_id=db_board.id
        )
        db.add(db_column)
    
    await db.commit()
    await db.refresh(db_board)
    
    # Board'u ve kolonlarıyla birlikte dön
    return db_board

# Tüm boardları listeleme
@router.get("/", response_model=List[ProjectBoardResponse])
async def get_boards(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ProjectBoard)
        .where(
            (ProjectBoard.user_id == user_id) |
            (ProjectBoard.id.in_(
                select(BoardMember.board_id)
                .where(BoardMember.user_id == user_id)
            ))
        )
    )
    boards = result.scalars().all()
    if not boards:
        return []
    return boards

# Belirli bir boardu alma
@router.get("/{board_id}", response_model=ProjectBoardResponse)
async def get_board(board_id: int, db: AsyncSession = Depends(get_db)):
    board = await db.get(ProjectBoard, board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return board

# Boardu güncelleme
@router.put("/{board_id}", response_model=ProjectBoardResponse)
async def update_board(
    board_id: int,
    board_update: ProjectBoardUpdate,
    db: AsyncSession = Depends(get_db)
):
    board = await db.get(ProjectBoard, board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    # Güncellenecek alanları kontrol et ve uygula
    update_data = board_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(board, key, value)
    
    db.add(board)
    await db.commit()
    await db.refresh(board)
    return board

# Boardu silme
@router.delete("/{board_id}", status_code=204)
async def delete_board(board_id: int, db: AsyncSession = Depends(get_db)):
    board = await db.get(ProjectBoard, board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    await db.delete(board)
    await db.commit()
    return None

# Yeni Board açıldığında hazır kolonlarla beraber gelecek

#todooo