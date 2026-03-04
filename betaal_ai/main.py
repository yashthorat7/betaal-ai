from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import core, rehab, ai, extension, youtube

app = FastAPI(
    title=settings.APP_NAME,
    description="The brain of the Betaal AI ecosystem. Hackathon Demo Ready.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router Inclusion
app.include_router(core.router)
app.include_router(rehab.router)
app.include_router(ai.router)
app.include_router(extension.router)
app.include_router(youtube.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": f"Welcome to {settings.APP_NAME}!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
