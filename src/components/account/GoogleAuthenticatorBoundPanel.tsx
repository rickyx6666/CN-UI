import { Asterisk, Lightbulb, Trash2 } from 'lucide-react'
import {
  formatGoogleAuthBoundDate,
  googleAuthCopy,
} from '../../data/googleAuth'

interface GoogleAuthenticatorBoundPanelProps {
  boundAt: string | null
  onRemove: () => void
}

export function GoogleAuthenticatorBoundPanel({
  boundAt,
  onRemove,
}: GoogleAuthenticatorBoundPanelProps) {
  const addedLabel = boundAt
    ? `${googleAuthCopy.boundAddedPrefix}${formatGoogleAuthBoundDate(boundAt)}`
    : null

  return (
    <>
      <div className="flex items-center gap-3 border-b border-border-subtle py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sunken text-primary">
          <Asterisk className="h-5 w-5" strokeWidth={1.5} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-medium text-primary">
            {googleAuthCopy.boundMethodLabel}
          </p>
          {addedLabel ? (
            <p className="mt-0.5 text-caption text-secondary">{addedLabel}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            aria-label="解除绑定"
            onClick={onRemove}
            className="flex h-10 w-10 items-center justify-center text-secondary active:opacity-70"
          >
            <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-sunken px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-elevated text-secondary">
            <Lightbulb className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="text-body-sm font-semibold text-primary">
              {googleAuthCopy.securityTipTitle}
            </p>
            <p className="mt-2 text-body-sm leading-relaxed text-secondary">
              {googleAuthCopy.securityTipBody}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
