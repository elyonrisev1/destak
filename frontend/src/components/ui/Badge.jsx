import { cn } from '../../utils/helpers'

export default function Badge({
  children,
  variant = 'default',
  className,
}) {
  const variants = {
    default: 'bg-surface-200 text-gray-300',
    accent: 'bg-accent text-background',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}