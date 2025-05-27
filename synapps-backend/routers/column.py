# routers/column.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from database import get_db
from models.column import Column
from schemas.column import ColumnCreate, ColumnResponse, ColumnUpdate
from pydantic import BaseModel

router = APIRouter(prefix="/columns", tags=["columns"])

class PositionUpdate(BaseModel):
    position: int

# Yeni bir sütun oluşturma
@router.post("/", response_model=ColumnResponse, status_code=201)
async def create_column(column: ColumnCreate, db: AsyncSession = Depends(get_db)):
    try:
        db_column = Column(**column.dict())
        db.add(db_column)
        await db.commit()
        await db.refresh(db_column)
        
        # Sütunu tasks ilişkisiyle birlikte yeniden yükle
        result = await db.execute(
            select(Column)
            .options(selectinload(Column.tasks))
            .where(Column.id == db_column.id)
        )
        column_with_tasks = result.scalar_one()
        return column_with_tasks
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Tüm sütunları listeleme (isteğe bağlı board_id filtresi)
@router.get("/", response_model=List[ColumnResponse])
async def get_columns(board_id: int = None, db: AsyncSession = Depends(get_db)):
    query = select(Column).options(selectinload(Column.tasks))
    if board_id is not None:
        query = query.where(Column.board_id == board_id)
    query = query.order_by(Column.position)
    result = await db.execute(query)
    columns = result.scalars().all()
    if not columns:
        return []
    # Her sütunun görevlerini de pozisyona göre sırala
    for col in columns:
        if hasattr(col, 'tasks') and col.tasks:
            col.tasks.sort(key=lambda t: t.position)
    return columns

# Belirli bir sütunu alma
@router.get("/{column_id}", response_model=ColumnResponse)
async def get_column(column_id: int, db: AsyncSession = Depends(get_db)):
    column = await db.get(Column, column_id)
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")
    return column

# Sütunu güncelleme
@router.put("/{column_id}", response_model=ColumnResponse)
async def update_column(
    column_id: int,
    column_update: ColumnUpdate,
    db: AsyncSession = Depends(get_db)
):
    column = await db.get(Column, column_id)
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")
    
    # Güncellenecek alanları kontrol et ve uygula
    update_data = column_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(column, key, value)
    
    db.add(column)
    await db.commit()
    await db.refresh(column)
    return column

# Sütunu silme
@router.delete("/{column_id}", status_code=204)
async def delete_column(column_id: int, db: AsyncSession = Depends(get_db)):
    column = await db.get(Column, column_id)
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")
    
    await db.delete(column)
    await db.commit()
    return None

# Sütun pozisyonunu güncelleme
@router.put("/{column_id}/position", response_model=ColumnResponse)
async def update_column_position(
    column_id: int,
    data: PositionUpdate,
    db: AsyncSession = Depends(get_db)
):
    column = await db.get(Column, column_id)
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")
    column.position = data.position
    db.add(column)
    await db.commit()
    await db.refresh(column)
    # Sütunu görevleriyle birlikte yükle
    result = await db.execute(
        select(Column).options(selectinload(Column.tasks)).where(Column.id == column_id)
    )
    column_with_tasks = result.scalars().first()
    return column_with_tasks