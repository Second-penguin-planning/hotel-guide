interface Props {
  children: React.ReactNode
  variant?: 'green' | 'blue' | 'orange' | 'purple' | 'gray'
}

const styles: Record<NonNullable<Props['variant']>, string> = {
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  purple: 'bg-purple-100 text-purple-700',
  gray: 'bg-gray-100 text-gray-600',
}

export default function Badge({ children, variant = 'gray' }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  )
}
