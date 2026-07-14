import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ContractOrderEditSheet,
  type ContractOrderEditTarget,
} from './ContractOrderEditSheet'

interface ContractOrderEditHandlers {
  onConfirmBasic: (orderId: string, values: { price: number; size: number }) => void
  onConfirmConditional: (
    orderId: string,
    values: { triggerPrice: number },
  ) => void
}

interface ContractOrderEditState {
  target: ContractOrderEditTarget
  handlers: ContractOrderEditHandlers
}

interface ContractOrderEditContextValue {
  openContractOrderEdit: (
    target: ContractOrderEditTarget,
    handlers: ContractOrderEditHandlers,
  ) => void
  closeContractOrderEdit: () => void
  editState: ContractOrderEditState | null
}

const ContractOrderEditContext =
  createContext<ContractOrderEditContextValue | null>(null)

export function ContractOrderEditProvider({ children }: { children: ReactNode }) {
  const [editState, setEditState] = useState<ContractOrderEditState | null>(
    null,
  )

  const closeContractOrderEdit = useCallback(() => {
    setEditState(null)
  }, [])

  const openContractOrderEdit = useCallback(
    (target: ContractOrderEditTarget, handlers: ContractOrderEditHandlers) => {
      setEditState({ target, handlers })
    },
    [],
  )

  const value = useMemo(
    () => ({ openContractOrderEdit, closeContractOrderEdit, editState }),
    [closeContractOrderEdit, editState, openContractOrderEdit],
  )

  return (
    <ContractOrderEditContext.Provider value={value}>
      {children}
    </ContractOrderEditContext.Provider>
  )
}

export function ContractOrderEditSheetHost() {
  const context = useContext(ContractOrderEditContext)
  if (!context) return null

  const { editState, closeContractOrderEdit } = context
  if (!editState) return null

  return (
    <ContractOrderEditSheet
      target={editState.target}
      onClose={closeContractOrderEdit}
      onConfirmBasic={(orderId, values) => {
        editState.handlers.onConfirmBasic(orderId, values)
        closeContractOrderEdit()
      }}
      onConfirmConditional={(orderId, values) => {
        editState.handlers.onConfirmConditional(orderId, values)
        closeContractOrderEdit()
      }}
    />
  )
}

export function useContractOrderEdit() {
  const context = useContext(ContractOrderEditContext)
  if (!context) {
    throw new Error('useContractOrderEdit must be used within ContractOrderEditProvider')
  }
  return context
}
