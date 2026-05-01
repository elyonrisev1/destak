from fastapi import APIRouter, HTTPException
from ..models.audio_models import MixGenerateRequest, AudioResponse
from ..services.audio_processor import mix_audio

router = APIRouter(prefix="/audio/mix", tags=["Mixer"])


@router.post("/generate", response_model=AudioResponse)
async def generate_mix(request: MixGenerateRequest):
    """
    Mixa locução com música de fundo.

    - **locutionId**: ID da locução na biblioteca (opcional se usar upload)
    - **musicStyle**: Estilo musical da música de fundo
    - **voiceVol**: Volume da voz (0.0 a 1.0)
    - **musicVol**: Volume da música (0.0 a 1.0)
    - **fadeIn**: Duração do fade in em segundos
    - **fadeOut**: Duração do fade out em segundos
    - **duration**: Duração total desejada em segundos
    - **duckMusic**: Nível de ducking (redução) da música quando há voz (0.0 a 1.0)
    """
    try:
        # Em produção, buscaria a locução do banco
        voice_file = f"locution_{request.locutionId}.mp3" if request.locutionId else "default_voice.mp3"
        music_file = f"music_{request.musicStyle}.mp3" if request.musicStyle else "default_music.mp3"

        result = await mix_audio(
            voice_file=voice_file,
            music_file=music_file,
            voice_vol=request.voiceVol,
            music_vol=request.musicVol,
            fade_in=request.fadeIn,
            fade_out=request.fadeOut,
            duration=request.duration,
            duck_music=request.duckMusic,
        )

        return AudioResponse(
            success=True,
            data={
                "filename": result["filename"],
                "voice_file": result["voice_file"],
                "music_file": result["music_file"],
                "voice_vol": result["voice_vol"],
                "music_vol": result["music_vol"],
                "fade_in": result["fade_in"],
                "fade_out": result["fade_out"],
                "duck_music": result["duck_music"],
                "duration": result["duration"],
            },
            filename=result["filename"],
            duration=result["duration"],
            message="Mix gerado com sucesso",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
