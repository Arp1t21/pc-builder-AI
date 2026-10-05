from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.components import router as components_router
from app.routers.builds import router as builds_router
from app.routers.ai import router as ai_router

__all__ = ["auth_router", "users_router", "components_router", "builds_router", "ai_router"]
