import { ChevronLeft } from 'lucide-react'
import { AuthButton } from '../auth/AuthButton'
import { AntiPhishingIllustration } from './AntiPhishingIllustration'
import { antiPhishingCopy } from '../../data/antiPhishing'

interface AntiPhishingIntroPanelProps {
  onBack: () => void
  onCreate: () => void
}

export function AntiPhishingIntroPanel({
  onBack,
  onCreate,
}: AntiPhishingIntroPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-base text-primary">
      <header className="shrink-0 px-1 pt-1">
        <button
          type="button"
          aria-label="返回"
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center text-primary active:opacity-70"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </header>

      <main className="layout-screen-x min-h-0 flex-1 overflow-y-auto">
        <h1 className="text-display font-semibold text-primary">
          {antiPhishingCopy.title}
        </h1>

        <div className="mt-9 flex justify-center">
          <AntiPhishingIllustration variant="intro" />
        </div>

        <section className="mt-10 pb-4">
          <h2 className="text-h2 font-semibold text-primary">
            {antiPhishingCopy.howItWorksTitle}
          </h2>
          <p className="mt-3 text-body leading-relaxed text-secondary">
            {antiPhishingCopy.howItWorksDesc}
          </p>
        </section>
      </main>

      <footer className="layout-screen-x shrink-0 pb-8 pt-3">
        <AuthButton type="button" onClick={onCreate}>
          {antiPhishingCopy.createButton}
        </AuthButton>
      </footer>
    </div>
  )
}
