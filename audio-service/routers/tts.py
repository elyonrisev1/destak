from fastapi import APIRouter, HTTPException
from ..models.audio_models import TTSGenesisRequest, AudioResponse
from ..services.voice_engine import generate_tts, get_available_voices

router = APIRouter(prefix="/audio/tts", tags=["Text-to-Speech"])


@router.post("/generate", response_model=AudioResponse)
async def generate_tts_endpoint(request: TTSGenesisRequest):
    """
    Gera áudio a partir de texto usando síntese de voz.

    - **text**: Texto para converter em fala
    - **voice**: Voz a ser utilizada (marcos, carlos, pedro, ana, julia, mariana)
    - **speed**: Velocidade da fala (0.5 a 2.0)
    - **pitch**: Tom da voz (0.5 a 2.0)
    - **musicStyle**: Estilo musical de fundo (opcional)
    - **voiceVol**: Volume da voz (0.0 a 1.0)
    - **musicVol**: Volume da música (0.0 a 1.0)
    - **fadeIn**: Duração do fade in em segundos
    - **fadeOut**: Duração do fade out em segundos
    """
    try:
        result = await generate_tts(
            text=request.text,
            voice=request.voice.value,
            speed=request.speed,
            pitch=request.pitch,
        )

        return AudioResponse(
            success=True,
            data={
                "filename": result["filename"],
                "duration": result["duration"],
                "voice": result["voice"],
                "text_length": result["text_length"],
                "music_style": request.musicStyle.value if request.musicStyle else None,
                "voice_vol": request.voiceVol,
                "music_vol": request.musicVol,
                "fade_in": request.fadeIn,
                "fade_out": request.fadeOut,
            },
            filename=result["filename"],
            duration=result["duration"],
            message="TTS gerado com sucesso",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/voices", response_model=AudioResponse)
async def list_voices():
    """Lista todas as vozes disponíveis para síntese."""
    try:
        voices = await get_available_voices()
        return AudioResponse(
            success=True,
            data={"voices": voices},
            message=f"{len(voices)} vozes disponíveis",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
