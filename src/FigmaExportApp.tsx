import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { FigmaToast } from './components/feedback/FigmaToast'
import { AppShell } from './components/AppShell'
import { AppFrame } from './components/platform/AppFrame'
import { H5ExportFrame } from './components/platform/H5ExportFrame'
import { PcExportFrame } from './components/platform/PcExportFrame'
import { ComplianceRestrictionSheet } from './components/sheets/ComplianceRestrictionSheet'
import { VersionUpdateModal } from './components/sheets/VersionUpdateModal'
import { SettingsSheets } from './components/sheets/SettingsSheets'
import { OrderConfirmSheet, PairPickerSheet } from './components/trade/TradeSheets'
import { AppRouter } from './AppRouter'
import { InspectProvider } from './context/InspectContext'
import { PrototypeProvider, usePrototype } from './context/PrototypeContext'
import type { PrototypePreset } from './figma/types'

interface FigmaExportAppProps {
  preset: PrototypePreset
  title: string
}

function FigmaOverlays() {
  const { figmaToast } = usePrototype()

  return (
    <>
      <SettingsSheets />
      <PairPickerSheet />
      <OrderConfirmSheet />
      <ComplianceRestrictionSheet />
      <VersionUpdateModal />
      {figmaToast && <FigmaToast toast={figmaToast} />}
    </>
  )
}

function FigmaExportShell({ children }: { children: ReactNode }) {
  const { previewPlatform } = usePrototype()
  const Frame =
    previewPlatform === 'pc'
      ? PcExportFrame
      : previewPlatform === 'h5'
        ? H5ExportFrame
        : AppFrame

  return (
    <Frame>
      <AppShell>{children}</AppShell>
    </Frame>
  )
}

function exportViewport(preset: PrototypePreset) {
  switch (preset.previewPlatform) {
    case 'pc':
      return preset.figmaPcViewport === 'fixed'
        ? {
            width: '1440px',
            height: '900px',
            minHeight: '',
            overflow: 'hidden' as const,
          }
        : {
            width: '1440px',
            height: 'auto',
            minHeight: '900px',
            overflow: 'visible' as const,
          }
    case 'h5':
      return {
        width: '390px',
        height: '856px',
        minHeight: '',
        overflow: 'hidden' as const,
      }
    default:
      return {
        width: '390px',
        height: '812px',
        minHeight: '',
        overflow: 'hidden' as const,
      }
  }
}

export function FigmaExportApp({ preset, title }: FigmaExportAppProps) {
  const viewport = exportViewport(preset)

  useEffect(() => {
    document.title = `${title} — CoinNova Figma`
    const html = document.documentElement
    const { body } = document
    const root = document.getElementById('root')
    const prev = {
      htmlWidth: html.style.width,
      htmlHeight: html.style.height,
      htmlMinHeight: html.style.minHeight,
      htmlMargin: html.style.margin,
      bodyMargin: body.style.margin,
      bodyHeight: body.style.height,
      bodyMinHeight: body.style.minHeight,
      bodyOverflow: body.style.overflow,
      bodyBg: body.style.background,
      rootHeight: root?.style.height ?? '',
      rootMinHeight: root?.style.minHeight ?? '',
      rootOverflow: root?.style.overflow ?? '',
    }

    html.style.width = viewport.width
    html.style.height = viewport.height
    html.style.minHeight = viewport.minHeight
    html.style.margin = '0'
    html.dataset.figmaExport = 'true'
    body.style.margin = '0'
    body.style.height = viewport.height
    body.style.minHeight = viewport.minHeight
    body.style.overflow = viewport.overflow
    body.style.background = 'var(--color-base)'
    if (root) {
      root.style.height = viewport.height
      root.style.minHeight = viewport.minHeight
      root.style.overflow = viewport.overflow
    }

    return () => {
      html.style.width = prev.htmlWidth
      html.style.height = prev.htmlHeight
      html.style.minHeight = prev.htmlMinHeight
      html.style.margin = prev.htmlMargin
      html.dataset.figmaExport = ''
      body.style.margin = prev.bodyMargin
      body.style.height = prev.bodyHeight
      body.style.minHeight = prev.bodyMinHeight
      body.style.overflow = prev.bodyOverflow
      body.style.background = prev.bodyBg
      if (root) {
        root.style.height = prev.rootHeight
        root.style.minHeight = prev.rootMinHeight
        root.style.overflow = prev.rootOverflow
      }
    }
  }, [title, viewport.height, viewport.minHeight, viewport.overflow, viewport.width])

  return (
    <PrototypeProvider preset={preset}>
      <InspectProvider>
        <FigmaExportShell>
          <AppRouter />
          <FigmaOverlays />
        </FigmaExportShell>
      </InspectProvider>
    </PrototypeProvider>
  )
}
