import { Info } from 'lucide-react'

interface AuthSecurityTipBannerProps {
  message: string
  className?: string
}

export function AuthSecurityTipBanner({
  message,
  className = '',
}: AuthSecurityTipBannerProps) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg bg-warning-bg px-3 py-2 text-caption leading-relaxed text-secondary ${className}`}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" strokeWidth={1.5} />
      <p>{message}</p>
    </div>
  )
}
