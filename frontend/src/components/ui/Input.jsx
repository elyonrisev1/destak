import { cn } from '../../utils/helpers'

export default function Input({
  label,
  error,
  className,
  type = 'text',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'w-full px-4 py-3 bg-surface-100 border border-surface-200 rounded-lg',
          'text-white placeholder-gray-500',
          'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent',
          'transition-all duration-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export function Textarea({ label, error, className, rows = 4, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          'w-full px-4 py-3 bg-surface-100 border border-surface-200 rounded-lg',
          'text-white placeholder-gray-500',
          'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent',
          'transition-all duration-200 resize-none',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export function Select({ label, error, options, className, placeholder = 'Selecione...', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-4 py-3 bg-surface-100 border border-surface-200 rounded-lg',
          'text-white placeholder-gray-500',
          'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent',
          'transition-all duration-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}