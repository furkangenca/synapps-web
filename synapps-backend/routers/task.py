from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from database import get_db
from models.task import Task, TaskStatus
from schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])

# Yeni görev oluşturma
@router.post("/", response_model=TaskResponse, status_code=201)
async def create_task(task: TaskCreate, db: AsyncSession = Depends(get_db)):
    db_task = Task(**task.dict())
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

# Tüm görevleri listeleme (isteğe bağlı filtreleme: column_id, assigned_user_id)
@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    column_id: int = None,
    assigned_user_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Task)
    if column_id is not None:
        query = query.where(Task.column_id == column_id)
    if assigned_user_id is not None:
        query = query.where(Task.assigned_user_id == assigned_user_id)
    
    result = await db.execute(query)
    tasks = result.scalars().all()
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")
    return tasks

# Belirli bir görevi alma
@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, db: AsyncSession = Depends(get_db)):
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# Görevi güncelleme (örneğin, durum değiştirme veya atama yapma)
@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: AsyncSession = Depends(get_db)
):
    try:
        # Tüm işlemleri tek bir transaction içinde yap
        async with db.begin():
            # Mevcut görevi bul
            result = await db.execute(select(Task).where(Task.id == task_id))
            task = result.scalar_one_or_none()
            if not task:
                raise HTTPException(status_code=404, detail="Görev bulunamadı")

            # Görevi güncelle
            update_data = task_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(task, field, value)

            # Eğer position değiştiyse, aynı sütundaki diğer görevlerin pozisyonlarını güncelle
            if task_update.position is not None:
                # Aynı sütundaki diğer görevleri bul ve pozisyonları güncelle
                result = await db.execute(
                    select(Task)
                    .where(Task.column_id == task.column_id)
                    .where(Task.id != task.id)
                    .order_by(Task.position)
                )
                other_tasks = result.scalars().all()

                # Pozisyonları güncelle
                for idx, other_task in enumerate(other_tasks):
                    if idx >= task_update.position:
                        other_task.position = idx + 1
                    else:
                        other_task.position = idx

            await db.flush()
            await db.refresh(task)
            return task

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Görev güncellenirken bir hata oluştu: {str(e)}")

# Görevi silme
@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    task = await db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await db.delete(task)
    await db.commit()
    return None

# Ek Özellik: Görevi belirli bir duruma göre filtreleme
@router.get("/by-status/", response_model=List[TaskResponse])
async def get_tasks_by_status(
    status: TaskStatus,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Task).where(Task.status == status))
    tasks = result.scalars().all()
    if not tasks:
        raise HTTPException(status_code=404, detail=f"No tasks found with status: {status}")
    return tasks