from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from models.audio_models import CloneExtractRequest, CloneGenerateRequest, AudioResponse
from services.voice_engine import clone_voice, generate_with_clone
from services.yt_extractor import download_audio

router = APIRouter(prefix="/audio/clone", tags=["Clone de Voz"])


@router.post("/extract-yt", response_model=AudioResponse)
async def extract_yt_audio(request: CloneExtractRequest):
    """
    Extrai áudio de vídeo do YouTube para usar como referência de clone.

    - **youtubeUrl**: URL completa do vídeo no YouTube
    """
    try:
        result = await download_audio(request.youtubeUrl)

        return AudioResponse(
            success=True,
            data={
                "filename": result["filename"],
                "video_id": result["video_id"],
                "duration": result["duration"],
                "source": result["source_url"],
            },
            filename=result["filename"],
            duration=result["duration"],
            message="Áudio extraído com sucesso",
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=AudioResponse)
async def generate_clone_audio(request: CloneGenerateRequest):
    """
    Gera áudio usando voz clonada.

    - **text**: Texto para sintetizar
    - **cloneId**: ID da voz clonada
    - **similarity**: Similaridade com a voz original (0.0 a 1.0)
    """
    try:
        result = await generate_with_clone(
            text=request.text,
            clone_id=request.cloneId,
            similarity=request.similarity,
        )

        return AudioResponse(
            success=True,
            data={
                "filename": result["filename"],
                "duration": result["duration"],
                "clone_id": result["cloneId"],
            },
            filename=result["filename"],
            duration=result["duration"],
            message="Áudio clonado gerado com sucesso",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/create", response_model=AudioResponse)
async def create_voice_clone(
    name: str = Form(...),
    reference_file: Optional[UploadFile] = File(None),
    youtube_url: Optional[str] = Form(None),
    similarity: float = Form(0.8),
):
    """
    Cria um clone de voz a partir de áudio de referência.

    - **name**: Nome para a voz clonada
    - **reference_file**: Arquivo de áudio de referência (MP3, WAV)
    - **youtube_url**: URL do YouTube como alternativa ao upload
    - **similarity**: Nível de similaridade desejado (0.0 a 1.0)
    """
    try:
        # Se tiver YouTube URL, extrair áudio primeiro
        if youtube_url:
            yt_result = await download_audio(youtube_url)
            reference = yt_result["filename"]
        elif reference_file:
            # Salvar arquivo uploadado
            from pathlib import Path
            output_dir = Path(__file__).parent.parent / "audio_files"
            output_dir.mkdir(exist_ok=True)

            filepath = output_dir / reference_file.filename
            with open(filepath, "wb") as f:
                content = await reference_file.read()
                f.write(content)
            reference = reference_file.filename
        else:
            raise HTTPException(status_code=400, detail="É necessário fornecer reference_file ou youtube_url")

        # Criar clone
        clone_result = await clone_voice(reference, similarity)

        return AudioResponse(
            success=True,
            data={
                "clone_id": clone_result["cloneId"],
                "name": name,
                "similarity": clone_result["similarity"],
                "status": clone_result["status"],
            },
            message=f"Voz '{name}' clonada com sucesso",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
