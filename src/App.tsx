import { AppShell } from './components/AppShell'
import { DevPanel } from './components/DevPanel'
import { AnnotationListPanel } from './components/inspect/AnnotationListPanel'
import { SliceDetailPanel } from './components/inspect/SliceDetailPanel'
import { PlatformSwitcher } from './components/platform/PlatformSwitcher'
import { ViewportShell } from './components/platform/ViewportShell'
import { SettingsSheets } from './components/sheets/SettingsSheets'
import { ComplianceRestrictionSheet } from './components/sheets/ComplianceRestrictionSheet'
import { VersionUpdateModal } from './components/sheets/VersionUpdateModal'
import { OrderConfirmSheet, PairPickerSheet } from './components/trade/TradeSheets'
import { InspectProvider } from './context/InspectContext'
import { PrototypeProvider } from './context/PrototypeContext'
import { AppRouter } from './AppRouter'

export default function App() {
  return (
    <PrototypeProvider>
      <InspectProvider>
        <div className="flex min-h-screen flex-col items-center bg-black">
          <PlatformSwitcher />
          <div className="flex flex-1 items-center justify-center px-4 pb-4">
            <ViewportShell>
              <AppShell>
                <AppRouter />
                <SettingsSheets />
                <PairPickerSheet />
                <OrderConfirmSheet />
                <ComplianceRestrictionSheet />
                <VersionUpdateModal />
              </AppShell>
            </ViewportShell>
          </div>
          <AnnotationListPanel />
          <SliceDetailPanel />
          <DevPanel />
        </div>
      </InspectProvider>
    </PrototypeProvider>
  )
}
