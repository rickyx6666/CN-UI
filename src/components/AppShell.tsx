import type { ReactNode } from 'react'
import { usePrototype } from '../context/PrototypeContext'
import { useFigmaPcDocument } from '../hooks/useFigmaPcDocument'
import { AppToast } from './feedback/AppToast'
import { BottomTabBar } from './BottomTabBar'
import { ContractOrderEditProvider, ContractOrderEditSheetHost } from './contract/ContractOrderEditContext'
import { ContractPositionShareProvider } from './contract/ContractPositionShareContext'
import { ContractPositionActionProvider } from './contract/ContractPositionActionContext'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const {
    authScreen,
    accountScreen,
    walletScreen,
    supportScreen,
    recordsScreen,
    chartScreen,
    previewPlatform,
  } = usePrototype()

  const isMobileShell = previewPlatform === 'app' || previewPlatform === 'h5'
  const pcDocument = useFigmaPcDocument()

  const showTabBar =
    isMobileShell &&
    !authScreen &&
    !chartScreen &&
    !accountScreen &&
    !walletScreen &&
    !supportScreen &&
    !recordsScreen

  return (
    <ContractOrderEditProvider>
      <ContractPositionShareProvider>
        <ContractPositionActionProvider>
          <div
            className={`relative flex flex-col ${
              pcDocument ? 'min-h-full' : 'h-full overflow-hidden'
            }`}
          >
            <div
              className={`relative ${
                pcDocument ? '' : 'min-h-0 flex-1 overflow-hidden'
              }`}
            >
              {children}
              <ContractOrderEditSheetHost />
            </div>
            {showTabBar && <BottomTabBar />}
            <AppToast />
          </div>
        </ContractPositionActionProvider>
      </ContractPositionShareProvider>
    </ContractOrderEditProvider>
  )
}
