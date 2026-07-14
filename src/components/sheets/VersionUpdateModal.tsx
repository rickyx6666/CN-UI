import { X } from 'lucide-react'
import { AuthButton } from '../auth/AuthButton'
import {
  versionUpdateCopy,
  type VersionUpdateInfo,
  type VersionUpdateVariant,
} from '../../data/versionUpdate'
import { usePrototype } from '../../context/PrototypeContext'

export function VersionUpdateModal() {
  const { versionUpdateVariant, versionUpdateInfo, closeVersionUpdate } =
    usePrototype()

  if (!versionUpdateVariant) return null

  return (
    <VersionUpdateDialog
      variant={versionUpdateVariant}
      info={versionUpdateInfo}
      onClose={closeVersionUpdate}
      onUpdate={() => {
        /* 原型：跳转应用商店 */
      }}
    />
  )
}

function VersionUpdateDialog({
  variant,
  info,
  onClose,
  onUpdate,
}: {
  variant: VersionUpdateVariant
  info: VersionUpdateInfo
  onClose: () => void
  onUpdate: () => void
}) {
  const isForce = variant === 'force'
  const title = isForce
    ? versionUpdateCopy.forceTitle
    : versionUpdateCopy.softTitle
  const summary = isForce
    ? versionUpdateCopy.forceSummary
    : versionUpdateCopy.softSummary

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      {!isForce ? (
        <button
          type="button"
          aria-label="关闭"
          className="absolute inset-0 bg-black/70"
          onClick={onClose}
        />
      ) : (
        <div className="absolute inset-0 bg-black/70" aria-hidden />
      )}

      <div
        role={isForce ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby="version-update-title"
        aria-describedby="version-update-desc"
        className="relative z-10 w-full max-w-[300px] overflow-hidden rounded-2xl border border-border-subtle bg-elevated shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
      >
        {!isForce && (
          <button
            type="button"
            aria-label="关闭"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-secondary active:bg-sunken"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}

        <div className="flex justify-center bg-sunken px-6 pb-5 pt-6">
          <VersionUpdateIllustration />
        </div>

        <div className="px-5 pb-5 pt-4">
          <h2
            id="version-update-title"
            className="text-center text-body font-semibold leading-snug text-primary"
          >
            {title}
          </h2>

          <p className="mt-2 text-center font-mono text-body-sm text-secondary">
            v{info.latestVersion}
          </p>

          <div
            id="version-update-desc"
            className="mt-4 rounded-xl bg-sunken px-3.5 py-3"
          >
            <p className="text-body-sm font-medium text-primary">
              {versionUpdateCopy.changelogTitle}
            </p>
            <p className="mt-2 text-body-sm leading-relaxed text-secondary">
              {summary}
            </p>
            {info.highlights.length > 0 && (
              <ul className="mt-3 space-y-1.5 border-t border-border-subtle pt-3">
                {info.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-body-sm text-secondary"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-5">
            <AuthButton type="button" onClick={onUpdate}>
              {versionUpdateCopy.updateButton}
            </AuthButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function VersionUpdateIllustration() {
  return (
    <svg
      width="120"
      height="96"
      viewBox="0 0 120 96"
      fill="none"
      aria-hidden
      className="overflow-visible"
    >
      <circle cx="18" cy="22" r="4" fill="#FFCC00" opacity="0.55" />
      <rect
        x="94"
        y="14"
        width="8"
        height="8"
        rx="1.5"
        fill="#FFCC00"
        opacity="0.45"
        transform="rotate(18 98 18)"
      />
      <rect
        x="8"
        y="58"
        width="6"
        height="6"
        rx="1"
        fill="#737373"
        opacity="0.7"
        transform="rotate(-12 11 61)"
      />
      <circle cx="102" cy="64" r="3" fill="#FFCC00" opacity="0.35" />

      <path
        d="M44 78 C52 70 68 70 76 78 L72 84 C64 80 56 80 48 84 Z"
        fill="#FFCC00"
        opacity="0.9"
      />
      <path
        d="M52 78 C56 74 64 74 68 78 L66 82 C62 79 58 79 54 82 Z"
        fill="#E6B800"
      />

      <path
        d="M60 18 L74 58 L60 54 L46 58 Z"
        fill="#1A1A1A"
        stroke="#2A2A2A"
        strokeWidth="1.5"
      />
      <path d="M54 34 H66" stroke="#2A2A2A" strokeWidth="1.25" />
      <path d="M52 42 H68" stroke="#2A2A2A" strokeWidth="1.25" />
      <path d="M54 50 H66" stroke="#2A2A2A" strokeWidth="1.25" />

      <path
        d="M60 18 L66 34 L60 30 L54 34 Z"
        fill="#FFCC00"
      />
      <circle cx="60" cy="24" r="3.5" fill="#0A0A0A" stroke="#FFCC00" strokeWidth="1.25" />

      <rect x="57" y="54" width="6" height="10" rx="1" fill="#FFCC00" />
    </svg>
  )
}
