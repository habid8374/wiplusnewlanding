import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'whatsapp' | 'outline' | 'outline-light' | 'ghost' | 'light'
export type ButtonSize = 'sm' | 'md' | 'lg'

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 select-none',
    size === 'sm' && 'min-h-10 px-4 text-sm',
    size === 'md' && 'min-h-12 px-6 text-base',
    size === 'lg' && 'min-h-14 px-7 text-lg',
    variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
    variant === 'whatsapp' && 'bg-whatsapp-700 text-white hover:bg-whatsapp-800 shadow-sm',
    variant === 'outline' && 'border-2 border-primary-600 text-primary-700 hover:bg-primary-50',
    variant === 'outline-light' && 'border-2 border-white/80 text-white hover:bg-white/10',
    variant === 'ghost' && 'text-primary-700 hover:bg-primary-50',
    variant === 'light' && 'bg-white text-primary-900 hover:bg-primary-50 shadow-sm',
    className,
  )
}
