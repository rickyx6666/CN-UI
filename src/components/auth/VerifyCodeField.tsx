import { useId } from 'react'

interface VerifyCodeFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  helperText?: string
  placeholder?: string
  suffixLabel?: string
  onSuffixClick?: () => void
  autoComplete?: string
}

export function VerifyCodeField({
  label,
  value,
  onChange,
  error,
  helperText,
  placeholder,
  suffixLabel,
  onSuffixClick,
  autoComplete = 'one-time-code',
}: VerifyCodeFieldProps) {
  const id = useId()

  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 block text-body-sm text-secondary">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, '').slice(0, 6))
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`h-12 w-full rounded-md border bg-sunken px-4 text-body text-primary outline-none transition-colors duration-200 placeholder:text-primary-muted ${
            suffixLabel ? 'pr-14' : ''
          } ${error ? 'border-danger' : 'border-border focus:border-brand'}`}
        />
        {suffixLabel && onSuffixClick ? (
          <button
            type="button"
            onClick={onSuffixClick}
            className="absolute inset-y-0 right-3 text-body-sm text-brand active:opacity-70"
          >
            {suffixLabel}
          </button>
        ) : null}
      </div>
      {helperText && !error ? (
        <p className="mt-1 text-caption text-secondary">{helperText}</p>
      ) : null}
      {error ? (
        <p className="mt-1 text-body-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
