"""
Simulação de engine de síntese de voz.
Em produção, isso se conectaria a uma API real de TTS.
"""
import asyncio
import hashlib
from typing import Optional
from pathlib import Path


VOICES = {
    "marcos": {"name": "Marcos", "gender": "M", "description": "Voz grave e profissional, ideal para comerciais"},
    "carlos": {"name": "Carlos", "gender": "M", "description": "Voz energética e dinâmica, perfeito para promoções"},
    "pedro": {"name": "Pedro", "gender": "M", "description": "Voz amigável e calorosa, great para varejo"},
    "ana": {"name": "Ana", "gender": "F", "description": "Voz suave e elegante, ideal para saúde e beleza"},
    "julia": {"name": "Julia", "gender": "F", "description": "Voz jovem e vibrante, perfeita para público jovem"},
    "mariana": {"name": "Mariana", "gender": "F", "description": "Voz madura e confiável, great para serviços"},
}


async def generate_tts(
    text: str,
    voice: str = "marcos",
    speed: float = 1.0,
    pitch: float = 1.0,
    output_dir: Path = None
) -> dict:
    """
    Gera áudio TTS simulado.
    Em produção, integraria com Google TTS, Azure, AWS Polly, etc.
    """
    if output_dir is None:
        output_dir = Path(__file__).parent.parent / "audio_files"

    output_dir.mkdir(exist_ok=True)

    # Simular delay de processamento
    await asyncio.sleep(1.5)

    # Gerar nome único do arquivo
    text_hash = hashlib.md5(f"{text}_{voice}_{speed}".encode()).hexdigest()[:8]
    filename = f"tts_{voice}_{text_hash}.mp3"
    filepath = output_dir / filename

    # Em produção: gerar áudio real
    # Aqui criamos um arquivo dummy para simulação
    duration = len(text) * 0.08 * (1.0 / speed)

    # Criar arquivo dummy (em produção seria áudio real)
    with open(filepath, 'wb') as f:
        # Escrever header MP3 mínimo para arquivo ser "válido"
        f.write(b'\xff\xfb\x90\x00' + b'\x00' * 100)

    return {
        "filename": filename,
        "duration": round(duration, 2),
        "voice": voice,
        "text_length": len(text),
    }


async def get_available_voices() -> list:
    """Retorna lista de vozes disponíveis."""
    return [
        {
            "id": voice_id,
            "name": info["name"],
            "gender": info["gender"],
            "description": info["description"],
        }
        for voice_id, info in VOICES.items()
    ]


async def clone_voice(
    reference_audio: str,
    similarity: float = 0.8
) -> dict:
    """
    Simula clonagem de voz a partir de áudio de referência.
    """
    await asyncio.sleep(2.0)

    clone_id = hashlib.md5(reference_audio.encode()).hexdigest()[:8]

    return {
        "cloneId": clone_id,
        "similarity": similarity,
        "status": "ready",
    }


async def generate_with_clone(
    text: str,
    clone_id: str,
    similarity: float = 0.8,
    output_dir: Path = None
) -> dict:
    """Gera áudio usando voz clonada."""
    if output_dir is None:
        output_dir = Path(__file__).parent.parent / "audio_files"

    output_dir.mkdir(exist_ok=True)

    await asyncio.sleep(1.5)

    filename = f"clone_{clone_id}_{hashlib.md5(text.encode()).hexdigest()[:6]}.mp3"
    filepath = output_dir / filename

    duration = len(text) * 0.08

    with open(filepath, 'wb') as f:
        f.write(b'\xff\xfb\x90\x00' + b'\x00' * 100)

    return {
        "filename": filename,
        "duration": round(duration, 2),
        "cloneId": clone_id,
    }
