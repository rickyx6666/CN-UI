import { usePrototype } from './context/PrototypeContext'
import { DepositAddressPage } from './pages/wallet/DepositAddressPage'
import { DepositFetchingPage } from './pages/wallet/DepositFetchingPage'
import { DepositPage } from './pages/wallet/DepositPage'
import { WithdrawPage } from './pages/wallet/WithdrawPage'
import { WithdrawVerifyPage } from './pages/wallet/WithdrawVerifyPage'
import { WithdrawSecurityVerifyPage } from './pages/wallet/WithdrawSecurityVerifyPage'
import { WithdrawSuccessPage } from './pages/wallet/WithdrawSuccessPage'
import { DepositSaveSuccessPage } from './pages/wallet/DepositSaveSuccessPage'
import { TransferPage } from './pages/wallet/TransferPage'

export function WalletRouter() {
  const { walletScreen } = usePrototype()

  if (!walletScreen) return null

  switch (walletScreen.screen) {
    case 'deposit':
      return <DepositPage />
    case 'deposit-fetching':
      return <DepositFetchingPage />
    case 'deposit-address':
      return <DepositAddressPage />
    case 'deposit-save-success':
      return <DepositSaveSuccessPage />
    case 'withdraw':
      return <WithdrawPage />
    case 'withdraw-verify':
      return <WithdrawVerifyPage />
    case 'withdraw-security-verify':
      return <WithdrawSecurityVerifyPage />
    case 'withdraw-success':
      return <WithdrawSuccessPage />
    case 'transfer':
      return <TransferPage />
    default:
      return null
  }
}
