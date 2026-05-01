import { cn } from '../../utils/helpers'

export default function WaveformBar({
  height,
  isActive,
  onClick,
}) {
  return (
    <div
      className={cn(
        'w-1 rounded-full transition-all duration-100 cursor-pointer',
        isActive ? 'bg-accent' : 'bg-surface-200 hover:bg-accent/50'
      )}
      style={{ height: `${height}px` }}
      onClick={onClick}
    />
  )
}

export function Waveform({ bars = 50, isPlaying }) {
  const heights = Array.from({ length: bars }, (_, i) => {
    const base = 20 + Math.sin(i * 0.5) * 15
    return base + Math.random() * 20
  })

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {heights.map((height, i) => (
        <WaveformBar
          key={i}
          height={isPlaying ? height : height * 0.5}
          isActive={isPlaying}
        />
      ))}
    </div>
  )
}