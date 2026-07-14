import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ContractPosition } from '../../data/contract'
import { usePrototype } from '../../context/PrototypeContext'
import { ContractAdjustLeverageSheet } from './sheets/ContractAdjustLeverageSheet'
import { ContractClosePositionSheet } from './sheets/ContractClosePositionSheet'
import { ContractTpSlSheet } from './sheets/ContractTpSlSheet'

export type ContractPositionAction = 'leverage' | 'tpsl' | 'close'

interface ContractPositionActionState {
  position: ContractPosition
  action: ContractPositionAction
}

interface ContractPositionActionContextValue {
  openContractPositionAction: (
    position: ContractPosition,
    action: ContractPositionAction,
  ) => void
  closeContractPositionAction: () => void
}

const ContractPositionActionContext =
  createContext<ContractPositionActionContextValue | null>(null)

export function ContractPositionActionProvider({
  children,
}: {
  children: ReactNode
}) {
  const { showToast } = usePrototype()
  const [state, setState] = useState<ContractPositionActionState | null>(null)

  const closeContractPositionAction = useCallback(() => {
    setState(null)
  }, [])

  const openContractPositionAction = useCallback(
    (position: ContractPosition, action: ContractPositionAction) => {
      setState({ position, action })
    },
    [],
  )

  const value = useMemo(
    () => ({ openContractPositionAction, closeContractPositionAction }),
    [closeContractPositionAction, openContractPositionAction],
  )

  return (
    <ContractPositionActionContext.Provider value={value}>
      {children}
      <ContractAdjustLeverageSheet
        open={state?.action === 'leverage'}
        position={state?.action === 'leverage' ? state.position : null}
        onClose={closeContractPositionAction}
        onConfirm={(leverage) =>
          showToast(`杠杆已调整为 ${leverage}x`)
        }
      />
      <ContractTpSlSheet
        open={state?.action === 'tpsl'}
        position={state?.action === 'tpsl' ? state.position : null}
        onClose={closeContractPositionAction}
        onConfirm={() => showToast('止盈止损已更新')}
      />
      <ContractClosePositionSheet
        open={state?.action === 'close'}
        position={state?.action === 'close' ? state.position : null}
        onClose={closeContractPositionAction}
        onConfirm={({ sizePercent }) =>
          showToast(`已提交 ${sizePercent}% 平仓`)
        }
      />
    </ContractPositionActionContext.Provider>
  )
}

export function useContractPositionAction() {
  const context = useContext(ContractPositionActionContext)
  if (!context) {
    throw new Error(
      'useContractPositionAction must be used within ContractPositionActionProvider',
    )
  }
  return context
}
