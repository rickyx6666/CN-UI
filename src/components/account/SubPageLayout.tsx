import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { usePrototype } from '../../context/PrototypeContext'
import { useFigmaPcDocument } from '../../hooks/useFigmaPcDocument'
import { PcTopBar } from '../pc/PcTopBar'

interface SubPageLayoutProps {
  title: ReactNode
  onBack?: () => void
  hideBack?: boolean
  headerRight?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function SubPageLayout({
  title,
  onBack,
  hideBack = false,
  headerRight,
  children,
  footer,
}: SubPageLayoutProps) {
  const { previewPlatform } = usePrototype()
  const pcDocument = useFigmaPcDocument()

  if (previewPlatform === 'pc') {
    if (pcDocument) {
      return (
        <div className="flex min-h-[900px] flex-col bg-base">
          <PcTopBar />
          <div className="bg-base">
            <div className="mx-auto flex w-full max-w-[1240px] flex-col px-6 py-6">
              <div className="overflow-hidden rounded-2xl border border-border-subtle bg-elevated shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
                <header className="flex h-16 items-center border-b border-border-subtle px-5">
                  {!hideBack ? (
                    <button
                      type="button"
                      aria-label="返回"
                      onClick={onBack}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-primary hover:bg-sunken"
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                  ) : (
                    <span className="h-10 w-10" />
                  )}
                  <h1 className="flex-1 truncate text-center text-h3 font-semibold text-primary">
                    {title}
                  </h1>
                  {headerRight ? (
                    <div className="flex min-w-10 items-center justify-end">{headerRight}</div>
                  ) : (
                    <span className="h-10 w-10" />
                  )}
                </header>

                <main className="px-6 py-6">{children}</main>

                {footer && <div className="border-t border-border-subtle px-6 py-5">{footer}</div>}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex h-full min-h-0 flex-col bg-base">
        <PcTopBar />
        <div className="min-h-0 flex-1 overflow-y-auto bg-base">
          <div className="mx-auto flex w-full max-w-[1240px] min-h-full flex-col px-6 py-6">
            <div className="overflow-hidden rounded-2xl border border-border-subtle bg-elevated shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <header className="flex h-16 items-center border-b border-border-subtle px-5">
                {!hideBack ? (
                  <button
                    type="button"
                    aria-label="返回"
                    onClick={onBack}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-primary hover:bg-sunken"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                ) : (
                  <span className="h-10 w-10" />
                )}
                <h1 className="flex-1 truncate text-center text-h3 font-semibold text-primary">
                  {title}
                </h1>
                {headerRight ? (
                  <div className="flex min-w-10 items-center justify-end">{headerRight}</div>
                ) : (
                  <span className="h-10 w-10" />
                )}
              </header>

              <main className="min-h-0 px-6 py-6">{children}</main>

              {footer && <div className="border-t border-border-subtle px-6 py-5">{footer}</div>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-base">
      <header className="z-20 flex h-12 shrink-0 items-center bg-base/95 px-2 backdrop-blur-sm">
        {!hideBack ? (
          <button
            type="button"
            aria-label="返回"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center text-primary active:opacity-70"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
          </button>
        ) : (
          <span className="h-11 w-11" />
        )}
        <h1 className="flex-1 truncate text-center text-h3 text-primary">
          {title}
        </h1>
        {headerRight ? (
          <div className="flex h-11 shrink-0 items-center justify-end">{headerRight}</div>
        ) : (
          <span className="h-11 w-11" />
        )}
      </header>

      <main className="layout-screen-x layout-content-top min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </main>

      {footer && (
        <div className="shrink-0 px-4 pb-6 pt-4">{footer}</div>
      )}
    </div>
  )
}
