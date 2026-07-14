import { useId, useRef } from 'react'

interface OtpFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  masked?: boolean
  autoComplete?: string
  ariaLabel?: string
}

export function OtpField({
  label,
  value,
  onChange,
  error,
  masked = false,
  autoComplete = 'one-time-code',
  ariaLabel = '输入 6 位验证码',
}: OtpFieldProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const digits = value.padEnd(6, ' ').slice(0, 6).split('')

  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-2 block text-body-sm text-secondary">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete={autoComplete}
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        className="sr-only"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        className="flex w-full justify-between gap-2"
        aria-label={ariaLabel}
      >
        {digits.map((digit, i) => (
          <span
            key={i}
            className={`flex h-12 flex-1 items-center justify-center rounded-md border bg-sunken text-h3 tabular-nums text-primary ${
              error ? 'border-danger' : 'border-border'
            }`}
          >
            {digit.trim() ? (masked ? '•' : digit) : ''}
          </span>
        ))}
      </button>
      {error && (
        <p className="mt-2 text-body-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
