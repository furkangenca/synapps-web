# routers/__init__.py
from .task import router as task_router
from .board import router as board_router
from .column import router as column_router
from .board_member import router as board_member_router
from .notification import router as notification_router
from .auth import router as auth_router
from .user import router as user_router

__all__ = ["auth_router", "task_router", "board_router", "column_router", "board_member_router", "notification_router", "user_router"]