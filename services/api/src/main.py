from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .routers.projects import projects_router
from .routers.mcp_server import mcp_router
from .routers.billing import billing_router
from .routers.audit_ledger import router as audit_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/v1/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(projects_router, prefix="/v1")
app.include_router(mcp_router, prefix="/v1")
app.include_router(billing_router, prefix="/v1")
app.include_router(audit_router, prefix="/v1")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "environment": settings.ENVIRONMENT
    }

@app.get("/v1")
async def v1_root():
    return {
        "name": settings.APP_NAME,
        "version": "v1.0",
        "documentation": "/docs",
        "pipeline_stages": 10,
        "unmetered": True
    }
