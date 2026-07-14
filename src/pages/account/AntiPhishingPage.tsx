import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AuthButton } from '../../components/auth/AuthButton'
import { AntiPhishingIntroPanel } from '../../components/account/AntiPhishingIntroPanel'
import { AntiPhishingHowItWorksSheet } from '../../components/account/AntiPhishingHowItWorksSheet'
import { AntiPhishingIllustration } from '../../components/account/AntiPhishingIllustration'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { antiPhishingCopy, maskAntiPhishingCode } from '../../data/antiPhishing'
import { usePrototype } from '../../context/PrototypeContext'

export function AntiPhishingPage() {
  const {
    user,
    navigateAccount,
    figmaAntiPhishingOverlay,
    antiPhishingOverlay,
    clearAntiPhishingOverlay,
  } = usePrototype()
  const [visible, setVisible] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(
    figmaAntiPhishingOverlay === 'how-it-works' ||
      antiPhishingOverlay === 'how-it-works',
  )
  const hasCode = Boolean(user.antiPhishingCode)

  function handleBack() {
    navigateAccount({ screen: 'security' })
  }

  if (!hasCode) {
    return (
      <AntiPhishingIntroPanel
        onBack={handleBack}
        onCreate={() =>
          navigateAccount({
            screen: 'security-anti-phishing-form',
            antiPhishingMode: 'create',
          })
        }
      />
    )
  }

  const code = user.antiPhishingCode!

  return (
    <SubPageLayout
      title={antiPhishingCopy.title}
      onBack={handleBack}
      footer={
        showHowItWorks ? undefined : (
          <AuthButton
            type="button"
            variant="secondary"
            onClick={() =>
              navigateAccount({
                screen: 'security-anti-phishing-form',
                antiPhishingMode: 'change',
              })
            }
          >
            {antiPhishingCopy.changeButton}
          </AuthButton>
        )
      }
    >
      <div className="flex flex-col items-center pb-6 pt-4 text-center">
        <AntiPhishingIllustration variant="active" />

        <div className="mt-8 flex items-center gap-2">
          <p className="text-body-sm text-secondary">
            {antiPhishingCopy.currentLabel}
          </p>
          <button
            type="button"
            aria-label={visible ? '隐藏防钓鱼码' : '显示防钓鱼码'}
            onClick={() => setVisible((value) => !value)}
            className="text-secondary active:opacity-70"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </div>

        <p className="mt-3 font-mono text-[28px] font-semibold tracking-wide text-primary">
          {maskAntiPhishingCode(code, visible)}
        </p>

        <button
          type="button"
          onClick={() => setShowHowItWorks(true)}
          className="mt-8 text-body-sm font-medium text-brand"
        >
          {antiPhishingCopy.howItWorksTitle}
        </button>
      </div>

      <AntiPhishingHowItWorksSheet
        open={showHowItWorks}
        onClose={() => {
          setShowHowItWorks(false)
          clearAntiPhishingOverlay()
        }}
      />
    </SubPageLayout>
  )
}
