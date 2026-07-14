import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Asterisk, ChevronLeft, ShieldCheck, UserRound, X } from 'lucide-react'
import { AuthButton } from '../auth/AuthButton'
import { antiPhishingCopy } from '../../data/antiPhishing'

export type VerificationMethod = 'passkey' | 'authenticator'

interface AddVerificationMethodSheetProps {
  open: boolean
  onClose: () => void
  onEnable: (method: VerificationMethod) => void
  defaultMethod?: VerificationMethod
}

export function AddVerificationMethodSheet({
  open,
  onClose,
  onEnable,
  defaultMethod = 'passkey',
}: AddVerificationMethodSheetProps) {
  const [method, setMethod] = useState<VerificationMethod>(defaultMethod)

  useEffect(() => {
    if (open) setMethod(defaultMethod)
  }, [defaultMethod, open])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-base">
      <header className="flex h-12 shrink-0 items-center justify-between px-2">
        <button
          type="button"
          aria-label="返回"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center text-primary active:opacity-70"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="关闭"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center text-primary active:opacity-70"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-8 pt-2">
        <div className="flex justify-center py-6">
          <SecurityShieldIllustration />
        </div>

        <h2 className="text-center text-h2 font-semibold text-primary">
          {antiPhishingCopy.addVerificationTitle}
        </h2>
        <p className="mt-3 text-center text-body-sm leading-relaxed text-secondary">
          {antiPhishingCopy.addVerificationDesc}
        </p>

        <div className="mt-8 space-y-3">
          <VerificationOptionCard
            selected={method === 'passkey'}
            onClick={() => setMethod('passkey')}
            icon={<UserRound className="h-5 w-5" strokeWidth={1.5} />}
            label={antiPhishingCopy.passkeyLabel}
            hint={antiPhishingCopy.passkeyHint}
            badge={antiPhishingCopy.recommended}
          />
          <VerificationOptionCard
            selected={method === 'authenticator'}
            onClick={() => setMethod('authenticator')}
            icon={<Asterisk className="h-5 w-5" strokeWidth={1.5} />}
            label={antiPhishingCopy.authenticatorLabel}
          />
        </div>

        <div className="mt-auto pt-8">
          <AuthButton type="button" onClick={() => onEnable(method)}>
            {antiPhishingCopy.enableButton}
          </AuthButton>
        </div>
      </div>
    </div>
  )
}

function VerificationOptionCard({
  selected,
  onClick,
  icon,
  label,
  hint,
  badge,
}: {
  selected: boolean
  onClick: () => void
  icon: ReactNode
  label: string
  hint?: string
  badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-4 text-left transition-colors ${
        selected
          ? 'border-primary bg-elevated'
          : 'border-border-subtle bg-elevated active:bg-sunken'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sunken text-primary">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-body-sm font-semibold text-primary">{label}</span>
            {badge && (
              <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-dark">
                {badge}
              </span>
            )}
          </div>
          {hint && (
            <p className="mt-1 text-caption leading-relaxed text-secondary">{hint}</p>
          )}
        </div>
      </div>
    </button>
  )
}

function SecurityShieldIllustration() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-brand/10" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border-subtle bg-elevated shadow-sm">
        <ShieldCheck className="h-10 w-10 text-secondary" strokeWidth={1.25} />
      </div>
      <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-success text-white shadow-sm">
        <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
      </span>
    </div>
  )
}
