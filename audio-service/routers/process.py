from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional, List
from models.audio_models import AudioResponse
from services.audio_processor import process_upload, apply_fade

router = APIRouter(prefix="/audio/upload", tags=["Upload e Processamento"])


@router.post("/process", response_model=AudioResponse)
async def process_uploaded_audio(
    file: UploadFile = File(...),
    prompt: Optional[str] = Form(None),
    effects: Optional[str] = Form(None),
    speed: float = Form(1.0),
    pitch: float = Form(1.0),
    bass: float = Form(0.0),
    treble: float = Form(0.0),
    volume: float = Form(1.0),
    noise_reduction: bool = Form(False),
    auto_level: bool = Form(False),
):
    """
    Processa arquivo de áudio uploadado com efeitos.

    - **file**: Arquivo de áudio (MP3, WAV, M4A)
    - **prompt**: Descrição textual das modificações desejadas
    - **effects**: Lista de efeitos separados por vírgula
    - **speed**: Velocidade de reprodução (0.5 a 2.0)
    - **pitch**: Tom (0.5 a 2.0)
    - **bass**: Ganho de graves (-10 a 10)
    - **treble**: Ganho de agudos (-10 a 10)
    - **volume**: Volume geral (0.0 a 2.0)
    - **noise_reduction**: Aplicar redução de ruído
    - **auto_level**: Aplicar nivelamento automático
    """
    try:
        from pathlib import Path
        output_dir = Path(__file__).parent.parent / "audio_files"
        output_dir.mkdir(exist_ok=True)

        # Salvar arquivo original
        filepath = output_dir / file.filename
        with open(filepath, "wb") as f:
            content = await file.read()
            f.write(content)

        # Processar efeitos
        effects_list = effects.split(",") if effects else []

        result = await process_upload(
            filename=file.filename,
            prompt=prompt,
            effects=effects_list,
            speed=speed,
            pitch=pitch,
            bass=bass,
            treble=treble,
            volume=volume,
            noise_reduction=noise_reduction,
            auto_level=auto_level,
        )

        return AudioResponse(
            success=True,
            data={
                "original_filename": result["original_filename"],
                "processed_filename": result["filename"],
                "duration": result["duration"],
                "applied_effects": result["applied_effects"],
                "prompt": result["prompt"],
            },
            filename=result["filename"],
            duration=result["duration"],
            message="Áudio processado com sucesso",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/fade", response_model=AudioResponse)
async def apply_fade_effect(
    file: UploadFile = File(...),
    fade_in: float = Form(0.5),
    fade_out: float = Form(0.5),
):
    """
    Aplica fade in e fade out em arquivo de áudio.

    - **file**: Arquivo de áudio
    - **fade_in**: Duração do fade in em segundos
    - **fade_out**: Duração do fade out em segundos
    """
    try:
        from pathlib import Path
        output_dir = Path(__file__).parent.parent / "audio_files"
        output_dir.mkdir(exist_ok=True)

        # Salvar arquivo
        filepath = output_dir / file.filename
        with open(filepath, "wb") as f:
            content = await file.read()
            f.write(content)

        result = await apply_fade(
            filename=file.filename,
            fade_in=fade_in,
            fade_out=fade_out,
        )

        return AudioResponse(
            success=True,
            data=result,
            filename=result["filename"],
            message="Fade aplicado com sucesso",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
