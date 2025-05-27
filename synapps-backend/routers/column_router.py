from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Column, Board
from schemas import ColumnCreate, ColumnUpdate, ColumnResponse
from typing import List

router = APIRouter(prefix="/columns", tags=["columns"])

@router.post("/", response_model=ColumnResponse)
async def create_column(column: ColumnCreate, db: AsyncSession = Depends(get_db)):
    # Board'un var olup olmadığını kontrol et
    board = await db.execute(select(Board).where(Board.id == column.board_id))
    board = board.scalar_one_or_none()
    if not board:
        raise HTTPException(status_code=404, detail="Board bulunamadı")

    # Yeni sütun oluştur
    new_column = Column(
        title=column.title,
        board_id=column.board_id,
        position=column.position or 0
    )
    db.add(new_column)
    await db.commit()
    await db.refresh(new_column)
    return new_column

@router.get("/", response_model=List[ColumnResponse])
async def get_columns(board_id: int, db: AsyncSession = Depends(get_db)):
    # Board'un var olup olmadığını kontrol et
    board = await db.execute(select(Board).where(Board.id == board_id))
    board = board.scalar_one_or_none()
    if not board:
        raise HTTPException(status_code=404, detail="Board bulunamadı")

    # Sütunları getir
    result = await db.execute(select(Column).where(Column.board_id == board_id).order_by(Column.position))
    columns = result.scalars().all()
    return columns

@router.put("/{column_id}", response_model=ColumnResponse)
async def update_column(column_id: int, column: ColumnUpdate, db: AsyncSession = Depends(get_db)):
    # Sütunun var olup olmadığını kontrol et
    result = await db.execute(select(Column).where(Column.id == column_id))
    existing_column = result.scalar_one_or_none()
    if not existing_column:
        raise HTTPException(status_code=404, detail="Sütun bulunamadı")

    # Sütunu güncelle
    for key, value in column.dict(exclude_unset=True).items():
        setattr(existing_column, key, value)

    await db.commit()
    await db.refresh(existing_column)
    return existing_column

@router.delete("/{column_id}")
async def delete_column(column_id: int, db: AsyncSession = Depends(get_db)):
    # Sütunun var olup olmadığını kontrol et
    result = await db.execute(select(Column).where(Column.id == column_id))
    existing_column = result.scalar_one_or_none()
    if not existing_column:
        raise HTTPException(status_code=404, detail="Sütun bulunamadı")

    # Sütunu sil
    await db.delete(existing_column)
    await db.commit()
    return {"message": "Sütun başarıyla silindi"}

@router.put("/{column_id}/position")
async def update_column_position(column_id: int, new_position: int, db: AsyncSession = Depends(get_db)):
    # Sütunun var olup olmadığını kontrol et
    result = await db.execute(select(Column).where(Column.id == column_id))
    existing_column = result.scalar_one_or_none()
    if not existing_column:
        raise HTTPException(status_code=404, detail="Sütun bulunamadı")

    # Sütunun pozisyonunu güncelle
    existing_column.position = new_position
    await db.commit()
    await db.refresh(existing_column)
    return existing_column 