import type { ReactNode } from 'react'
import { Mail, Shield, ShieldCheck, Smartphone } from 'lucide-react'
import { CoinNovaLogo } from '../CoinNovaLogo'

type AntiPhishingIllustrationVariant = 'intro' | 'active'

interface AntiPhishingIllustrationProps {
  variant?: AntiPhishingIllustrationVariant
}

export function AntiPhishingIllustration({
  variant = 'intro',
}: AntiPhishingIllustrationProps) {
  if (variant === 'active') {
    return (
      <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-sunken">
        <div className="relative">
          <Mail className="h-16 w-16 text-secondary" strokeWidth={1.25} />
          <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-brand-dark shadow-sm">
            <Shield className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto h-[172px] w-[220px]">
      <div className="pointer-events-none absolute left-1/2 top-4 h-[88px] w-[160px] -translate-x-1/2 rounded-full bg-brand/5 blur-2xl" />

      {/* Layer 1 — 设备底板 */}
      <div className="absolute left-1/2 top-9 z-0 h-[132px] w-[76px] -translate-x-1/2 overflow-hidden rounded-[18px] border border-border bg-sunken shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-x-3 top-3 h-1.5 rounded-full bg-border" />
        <div className="absolute inset-x-3 bottom-3 h-1.5 rounded-full bg-border" />
      </div>

      {/* Layer 2 — 浮起通知卡片 */}
      <div className="absolute left-1/2 top-0 z-10 w-[204px] -translate-x-1/2 rounded-[14px] border border-border bg-elevated px-3.5 pb-3.5 pt-3 shadow-[0_18px_44px_rgba(0,0,0,0.48),0_6px_14px_rgba(0,0,0,0.28)] ring-1 ring-white/5">
        <div className="flex items-center gap-1.5">
          <CoinNovaLogo size={22} className="shrink-0" />
          <span className="text-[11px] font-bold tracking-[0.1em] text-brand">
            COINNOVA
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-1.5 w-[42%] rounded-full bg-border" />
          <div className="h-1.5 w-[72%] rounded-full bg-border/70" />
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sunken text-secondary">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
          <span className="font-mono text-[13px] font-medium tracking-[0.18em] text-primary-muted">
            XXXXXXXX
          </span>
        </div>
      </div>

      {/* Layer 3 — 邮件 / 短信角标 */}
      <ChannelCallout
        className="absolute -right-0.5 top-1.5 z-20"
        tail="bottom-left"
      >
        <Mail className="h-[15px] w-[15px]" strokeWidth={2} />
      </ChannelCallout>
      <ChannelCallout
        className="absolute bottom-5 left-0 z-20"
        tail="top-right"
        tailClassName="left-2"
      >
        <Smartphone className="h-[15px] w-[15px]" strokeWidth={2} />
      </ChannelCallout>
    </div>
  )
}

function ChannelCallout({
  children,
  className = '',
  tail,
  tailClassName,
}: {
  children: ReactNode
  className?: string
  tail: 'bottom-left' | 'top-right'
  tailClassName?: string
}) {
  const tailPos = tailClassName ?? (tail === 'bottom-left' ? 'left-2' : 'right-2')

  return (
    <div className={`${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand text-brand-dark shadow-[0_8px_20px_rgba(255,204,0,0.35),0_2px_6px_rgba(0,0,0,0.2)]">
        {children}
        {tail === 'bottom-left' ? (
          <span
            className={`absolute -bottom-1.5 h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-brand ${tailPos}`}
          />
        ) : (
          <span
            className={`absolute -top-1.5 h-0 w-0 border-x-[5px] border-b-[6px] border-x-transparent border-b-brand ${tailPos}`}
          />
        )}
      </div>
    </div>
  )
}
