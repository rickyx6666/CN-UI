import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface SettingsGroupProps {
  title?: string
  children: ReactNode
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  return (
    <section className="mb-5">
      {title && (
        <h2 className="mb-2 px-1 text-body-sm text-secondary">{title}</h2>
      )}
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated">
        {children}
      </div>
    </section>
  )
}

interface SettingsRowProps {
  label: string
  value?: string
  valueClassName?: string
  hint?: string
  danger?: boolean
  showChevron?: boolean
  onClick?: () => void
}

export function SettingsRow({
  label,
  value,
  valueClassName,
  hint,
  danger,
  showChevron = true,
  onClick,
}: SettingsRowProps) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 border-b border-border-subtle px-4 py-3.5 text-left last:border-b-0 ${
        onClick ? 'active:bg-sunken' : ''
      }`}
    >
      <div className="min-w-0">
        <p
          className={`text-body-sm ${
            danger ? 'text-danger' : 'text-primary'
          }`}
        >
          {label}
        </p>
        {hint && (
          <p className="mt-0.5 text-caption text-secondary">{hint}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {value && (
          <span
            className={`max-w-[140px] truncate text-body-sm ${
              valueClassName ?? 'text-secondary'
            }`}
          >
            {value}
          </span>
        )}
        {showChevron && onClick && (
          <ChevronRight className="h-4 w-4 text-secondary" strokeWidth={1.5} />
        )}
      </div>
    </Tag>
  )
}

interface SettingsToggleRowProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SettingsToggleRow({
  label,
  checked,
  onChange,
}: SettingsToggleRowProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3 border-b border-border-subtle px-4 py-3.5 last:border-b-0">
      <p className="text-body-sm text-primary">{label}</p>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-brand' : 'bg-border'
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-primary transition-transform duration-200 ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}

interface UserAvatarProps {
  nickname: string
  size?: number
}

export function UserAvatar({ nickname, size = 56 }: UserAvatarProps) {
  const initial = nickname.trim().charAt(0).toUpperCase() || 'U'

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-muted font-semibold text-brand"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initial}
    </span>
  )
}
