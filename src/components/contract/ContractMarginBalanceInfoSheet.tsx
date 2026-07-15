import { AuthButton } from '../auth/AuthButton'
import { BottomSheet } from '../sheets/BottomSheet'
import { contractMarginBalanceInfoCopy } from '../../data/contract'

interface ContractMarginBalanceInfoSheetProps {
  open: boolean
  onClose: () => void
}

export function ContractMarginBalanceInfoSheet({
  open,
  onClose,
}: ContractMarginBalanceInfoSheetProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={contractMarginBalanceInfoCopy.title}
    >
      <p className="mb-6 text-body-sm leading-relaxed text-secondary">
        {contractMarginBalanceInfoCopy.description}
      </p>
      <AuthButton type="button" onClick={onClose}>
        {contractMarginBalanceInfoCopy.confirmLabel}
      </AuthButton>
    </BottomSheet>
  )
}
