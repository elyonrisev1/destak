import { cn } from '../../utils/helpers'

export default function Card({
  children,
  className,
  hover = true,
  ...props
}) {
  return (
    <div
      className={cn(
        'bg-surface-50 border border-surface-200 rounded-xl p-6',
        hover && 'hover:border-accent/30 transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-xl font-display font-semibold text-white', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-gray-400 mt-1', className)}>
      {children}
    </p>
  )
}

export function CardContent({ children, className }) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-surface-200', className)}>
      {children}
    </div>
  )
}