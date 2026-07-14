import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ContractPositionSharePayload } from '../../data/contractShare'
import { ContractPositionShareSheet } from './ContractPositionShareSheet'

interface ContractPositionShareContextValue {
  openContractPositionShare: (payload: ContractPositionSharePayload) => void
  closeContractPositionShare: () => void
}

const ContractPositionShareContext =
  createContext<ContractPositionShareContextValue | null>(null)

export function ContractPositionShareProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<ContractPositionSharePayload | null>(
    null,
  )

  const closeContractPositionShare = useCallback(() => {
    setPayload(null)
  }, [])

  const openContractPositionShare = useCallback(
    (next: ContractPositionSharePayload) => {
      setPayload(next)
    },
    [],
  )

  const value = useMemo(
    () => ({ openContractPositionShare, closeContractPositionShare }),
    [closeContractPositionShare, openContractPositionShare],
  )

  return (
    <ContractPositionShareContext.Provider value={value}>
      {children}
      <ContractPositionShareSheet
        open={payload != null}
        payload={payload}
        onClose={closeContractPositionShare}
      />
    </ContractPositionShareContext.Provider>
  )
}

export function useContractPositionShare() {
  const context = useContext(ContractPositionShareContext)
  if (!context) {
    throw new Error(
      'useContractPositionShare must be used within ContractPositionShareProvider',
    )
  }
  return context
}
