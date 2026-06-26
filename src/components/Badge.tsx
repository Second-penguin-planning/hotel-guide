interface Props { children: React.ReactNode; variant?: 'green' | 'blue' | 'orange' | 'purple' | 'gray' }

export default function Badge({ children, variant = 'gray' }: Props) {
  let cls = 'bg-gray-100 text-gray-600'
  if (variant === 'green') cls = 'bg-green-100 text-green-700'
  if (variant === 'blue') cls = 'bg-blue-100 text-blue-700'
  if (variant === 'orange') cls = 'bg-orange-100 text-orange-700'
  if (variant === 'purple') cls = 'bg-purple-100 text-purple-700'
  return (
    <span className={'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ' + cls}>
      {children}
    </span>
  )
}