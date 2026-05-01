"""
Destak Publicidade - Audio Service
Microserviço Python + FastAPI para processamento de áudio e IA
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import os

from routers import tts, clone, mixer, process

# Criar diretório de arquivos de áudio
AUDIO_DIR = Path(__file__).parent / "audio_files"
AUDIO_DIR.mkdir(exist_ok=True)

# Criar arquivo .gitkeep para manter o diretório no git
gitkeep = AUDIO_DIR / ".gitkeep"
if not gitkeep.exists():
    gitkeep.touch()

app = FastAPI(
    title="Destak Publicidade - Audio Service",
    description="Microserviço para processamento de áudio, TTS, clone de voz e mixagem",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar diretório de arquivos estáticos
app.mount("/audio/files", StaticFiles(directory=str(AUDIO_DIR)), name="audio_files")

# Incluir routers
app.include_router(tts.router)
app.include_router(clone.router)
app.include_router(mixer.router)
app.include_router(process.router)


# Servir arquivos de áudio
@app.get("/audio/files/{filename}")
async def serve_audio(filename: str):
    """Serve arquivos de áudio gerados."""
    filepath = AUDIO_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    return FileResponse(filepath, media_type="audio/mpeg")


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "audio-service"}


# Root
@app.get("/")
async def root():
    return {
        "service": "Destak Audio Service",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
