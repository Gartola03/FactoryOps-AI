from app.api.v1.health import router as health_router
from app.api.v1.machines import router as machines_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(health_router)
router.include_router(machines_router)
