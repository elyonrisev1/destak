"""
Extrator de áudio do YouTube.
Simulação - em produção usaria yt-dlp.
"""
import asyncio
import hashlib
import re
from pathlib import Path
from typing import Optional


def extract_video_id(url: str) -> Optional[str]:
    """Extrai ID do vídeo de várias URLs do YouTube."""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/embed\/([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/v\/([a-zA-Z0-9_-]{11})',
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    return None


async def download_audio(
    url: str,
    output_dir: Path = None,
    quality: str = "128k"
) -> dict:
    """
    Baixa áudio de vídeo do YouTube.

    Em produção:
    - Usaria yt-dlp ou youtube-dl
    - Extrairia áudio com ffmpeg
    - Converteria para formato desejado
    """
    if output_dir is None:
        output_dir = Path(__file__).parent.parent / "audio_files"

    output_dir.mkdir(exist_ok=True, parents=True)

    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError("URL do YouTube inválida")

    # Simular download
    await asyncio.sleep(2.5)

    filename = f"yt_{video_id}.mp3"
    filepath = output_dir / filename

    # Criar arquivo dummy
    with open(filepath, 'wb') as f:
        f.write(b'\xff\xfb\x90\x00' + b'\x00' * 100)

    # Metadados simulados
    return {
        "filename": filename,
        "video_id": video_id,
        "source_url": url,
        "quality": quality,
        "duration": 180.0,  # 3 minutos simulados
        "title": f"Vídeo YouTube {video_id}",
        "format": "mp3",
    }


async def get_video_info(url: str) -> dict:
    """Obtém informações do vídeo do YouTube."""
    video_id = extract_video_id(url)

    if not video_id:
        raise ValueError("URL do YouTube inválida")

    await asyncio.sleep(0.5)

    # Informações simuladas
    return {
        "video_id": video_id,
        "title": f"Vídeo YouTube {video_id}",
        "duration": 180,
        "thumbnail": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
        "channel": "Canal Exemplo",
    }
