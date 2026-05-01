from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class VoiceType(str, Enum):
    MARCOS = "marcos"
    CARLOS = "carlos"
    PEDRO = "pedro"
    ANA = "ana"
    JULIA = "julia"
    MARIANA = "mariana"


class MusicStyle(str, Enum):
    UPBEAT = "upbeat"
    CALM = "calm"
    ROCK = "rock"
    POP = "pop"
    ELECTRONIC = "electronic"
    CLASSICAL = "classical"


class TTSGenesisRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Texto para síntese de voz")
    voice: VoiceType = Field(default=VoiceType.MARCOS)
    speed: float = Field(default=1.0, ge=0.5, le=2.0)
    pitch: float = Field(default=1.0, ge=0.5, le=2.0)
    musicStyle: Optional[MusicStyle] = None
    voiceVol: float = Field(default=0.8, ge=0.0, le=1.0)
    musicVol: float = Field(default=0.3, ge=0.0, le=1.0)
    fadeIn: float = Field(default=0.5, ge=0.0, le=5.0)
    fadeOut: float = Field(default=0.5, ge=0.0, le=5.0)


class UploadProcessRequest(BaseModel):
    prompt: Optional[str] = None
    effects: List[str] = []
    speed: float = Field(default=1.0, ge=0.5, le=2.0)
    pitch: float = Field(default=1.0, ge=0.5, le=2.0)
    bass: float = Field(default=0.0, ge=-10.0, le=10.0)
    treble: float = Field(default=0.0, ge=-10.0, le=10.0)
    volume: float = Field(default=1.0, ge=0.0, le=2.0)
    noiseReduction: bool = False
    autoLevel: bool = False


class CloneExtractRequest(BaseModel):
    youtubeUrl: str = Field(..., description="URL do YouTube para extrair áudio")


class CloneGenerateRequest(BaseModel):
    text: str = Field(..., min_length=1)
    cloneId: str
    similarity: float = Field(default=0.8, ge=0.0, le=1.0)


class MixGenerateRequest(BaseModel):
    locutionId: Optional[str] = None
    musicStyle: Optional[MusicStyle] = None
    voiceVol: float = Field(default=0.8, ge=0.0, le=1.0)
    musicVol: float = Field(default=0.3, ge=0.0, le=1.0)
    fadeIn: float = Field(default=0.5, ge=0.0, le=5.0)
    fadeOut: float = Field(default=0.5, ge=0.0, le=5.0)
    duration: Optional[int] = None
    duckMusic: float = Field(default=0.5, ge=0.0, le=1.0)


class AudioResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
    filename: Optional[str] = None
    duration: Optional[float] = None
    message: Optional[str] = None
