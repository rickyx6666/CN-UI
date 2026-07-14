import { AuthButton } from '../auth/AuthButton'
import { AntiPhishingIllustration } from './AntiPhishingIllustration'
import { antiPhishingCopy } from '../../data/antiPhishing'

interface AntiPhishingHowItWorksSheetProps {
  open: boolean
  onClose: () => void
}

export function AntiPhishingHowItWorksSheet({
  open,
  onClose,
}: AntiPhishingHowItWorksSheetProps) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center">
      <button
        type="button"
        aria-label="关闭"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={antiPhishingCopy.howItWorksTitle}
        className="relative z-10 w-full max-w-[390px] rounded-t-xl bg-elevated px-4 pb-8 pt-6"
      >
        <div className="flex justify-center py-2">
          <AntiPhishingIllustration variant="intro" />
        </div>

        <h2 className="mt-2 text-h2 font-semibold text-primary">
          {antiPhishingCopy.howItWorksTitle}
        </h2>
        <p className="mt-3 text-body leading-relaxed text-secondary">
          {antiPhishingCopy.howItWorksSheetDesc}
        </p>

        <div className="mt-6">
          <AuthButton type="button" onClick={onClose}>
            {antiPhishingCopy.acknowledgedButton}
          </AuthButton>
        </div>
      </div>
    </div>
  )
}
