import { cn } from '../../utils/helpers'

export default function Table({
  columns,
  data,
  className,
  onRowClick,
}) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full', className)}>
        <thead>
          <tr className="border-b border-surface-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'text-left text-sm font-medium text-gray-400 py-4 px-4',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={cn(
                'border-b border-surface-200/50 hover:bg-surface-100/50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="text-sm text-gray-300 py-4 px-4"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                Nenhum dado encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}