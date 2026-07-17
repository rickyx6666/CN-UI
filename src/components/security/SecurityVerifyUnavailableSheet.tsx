import { AuthButton } from '../auth/AuthButton'
import { BottomSheet } from '../sheets/BottomSheet'
import { securityVerifyUnavailableCopy } from '../../data/securityVerify'

interface SecurityVerifyUnavailableSheetProps {
  open: boolean
  onClose: () => void
  onContactSupport?: () => void
}

export function SecurityVerifyUnavailableSheet({
  open,
  onClose,
  onContactSupport,
}: SecurityVerifyUnavailableSheetProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={securityVerifyUnavailableCopy.title}
    >
      <p className="mb-4 text-body-sm text-secondary">
        {securityVerifyUnavailableCopy.intro}
      </p>

      <div className="mb-6 space-y-3">
        {securityVerifyUnavailableCopy.items.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-border-subtle bg-sunken px-4 py-3"
          >
            <p className="text-body-sm font-medium text-primary">{item.title}</p>
            <p className="mt-1 text-caption leading-relaxed text-secondary">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <AuthButton type="button" onClick={onClose}>
          {securityVerifyUnavailableCopy.confirmLabel}
        </AuthButton>
        {onContactSupport ? (
          <button
            type="button"
            onClick={() => {
              onContactSupport()
              onClose()
            }}
            className="w-full py-2 text-center text-body-sm text-brand active:opacity-70"
          >
            {securityVerifyUnavailableCopy.contactLabel}
          </button>
        ) : null}
      </div>
    </BottomSheet>
  )
}
