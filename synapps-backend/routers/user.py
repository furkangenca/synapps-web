from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.user import User
from models.project_board import ProjectBoard
from models.board_member import BoardMember, RoleType
from models.task import Task
from models.notification import Notification
from models.session import Session

router = APIRouter(prefix="/users", tags=["users"])

@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    # 1. Owner olduğu tüm board'ları sil
    result = await db.execute(select(ProjectBoard).where(ProjectBoard.user_id == user_id))
    owned_boards = result.scalars().all()
    for board in owned_boards:
        await db.delete(board)

    # 2. Üye olduğu board'lardan sadece üyeliği sil (owner değilse)
    result = await db.execute(select(BoardMember).where(BoardMember.user_id == user_id))
    memberships = result.scalars().all()
    for member in memberships:
        if member.role != RoleType.OWNER:
            await db.delete(member)

    # 3. Kullanıcıya ait diğer ilişkili veriler (bildirimler, görevler, sessionlar, vs.) zaten CASCADE ile silinir
    await db.delete(user)
    await db.commit()
    return None 