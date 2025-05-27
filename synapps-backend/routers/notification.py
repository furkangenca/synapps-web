# routers/notification.py
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from database import get_db
from models.notification import Notification
from schemas.notification import NotificationCreate, NotificationResponse, NotificationUpdate

router = APIRouter(prefix="/notifications", tags=["notifications"])

# Yeni bir bildirim oluşturma
@router.post("/", response_model=NotificationResponse, status_code=201)
async def create_notification(notification: NotificationCreate, db: AsyncSession = Depends(get_db)):
    db_notification = Notification(**notification.dict())
    db.add(db_notification)
    await db.commit()
    await db.refresh(db_notification)
    return db_notification

# Tüm bildirimleri listeleme (isteğe bağlı user_id ve is_read filtresi)
@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    user_id: int = None,
    is_read: bool = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Notification)
    if user_id is not None:
        query = query.where(Notification.user_id == user_id)
    if is_read is not None:
        query = query.where(Notification.is_read == is_read)
    
    result = await db.execute(query)
    notifications = result.scalars().all()
    if not notifications:
        return []
    return notifications

# Belirli bir bildirimi alma
@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(notification_id: int, db: AsyncSession = Depends(get_db)):
    notification = await db.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

# Bildirimi güncelleme (örneğin, okundu olarak işaretleme)
@router.put("/{notification_id}", response_model=NotificationResponse)
async def update_notification(
    notification_id: int,
    notification_update: NotificationUpdate,
    db: AsyncSession = Depends(get_db)
):
    notification = await db.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    # Güncellenecek alanları kontrol et ve uygula
    update_data = notification_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(notification, key, value)
    if update_data:  # Eğer bir güncelleme varsa updated_at'i yenile
        notification.updated_at = datetime.now()
    
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification

# Bildirimi silme
@router.delete("/{notification_id}", status_code=204)
async def delete_notification(notification_id: int, db: AsyncSession = Depends(get_db)):
    notification = await db.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    await db.delete(notification)
    await db.commit()
    return None

@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(notification_id: int, db: AsyncSession = Depends(get_db)):
    notification = await db.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    # Bildirimi sil
    await db.delete(notification)
    await db.commit()
    # Silindiği için response olarak None dönebiliriz veya özel bir mesaj dönebiliriz
    return None