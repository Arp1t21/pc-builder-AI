from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.database import init_db
from app.routers import (
    auth_router,
    users_router,
    components_router,
    builds_router,
    ai_router
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema and seed data on startup
    init_db()
    yield


app = FastAPI(
    title="PC Builder AI Backend",
    description="Python FastAPI backend for PC Builder AI",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Authorization", "Content-Type"],
)


# Exception handler for HTTPExceptions to format { "error": ... }
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail if isinstance(exc.detail, str) else str(exc.detail)}
    )


# Exception handler for ValidationErrors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0].get("msg", "Validation error") if errors else "Validation error"
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": first_error, "details": errors}
    )


# Include Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(components_router)
app.include_router(builds_router)
app.include_router(ai_router)


@app.get("/")
def root():
    return {"status": "ok", "message": "PC Builder AI Python Backend is running"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}
