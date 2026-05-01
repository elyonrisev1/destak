import { User } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function VoiceCard({
  voice,
  isSelected,
  onSelect,
}) {
  const genderColors = {
    M: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    F: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
  }

  return (
    <div
      onClick={() => onSelect(voice)}
      className={cn(
        'p-4 rounded-xl border cursor-pointer transition-all duration-200',
        'bg-gradient-to-br',
        genderColors[voice.gender],
        isSelected
          ? 'border-accent ring-2 ring-accent/20'
          : 'hover:border-accent/50'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center',
          voice.gender === 'M' ? 'bg-blue-500/20' : 'bg-pink-500/20'
        )}>
          <User className={cn(
            'w-6 h-6',
            voice.gender === 'M' ? 'text-blue-400' : 'text-pink-400'
          )} />
        </div>
        <div>
          <h4 className="font-semibold text-white">{voice.name}</h4>
          <span className="text-xs text-gray-400 uppercase">{voice.gender === 'M' ? 'Masculina' : 'Feminina'}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400">{voice.description}</p>
    </div>
  )
}