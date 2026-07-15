import type { RecordsScreenState } from '../../data/records'
import type { WalletScreenState } from '../../data/wallet'

export type PcWalletModalScreen =
  | 'deposit'
  | 'deposit-fetching'
  | 'deposit-address'
  | 'withdraw'
  | 'withdraw-verify'
  | 'withdraw-security-verify'
  | 'withdraw-success'

export type PcRecordsModalScreen = 'fund' | 'fund-detail' | 'deposit-detail'

const pcWalletModalScreens = new Set<WalletScreenState['screen']>([
  'deposit',
  'deposit-fetching',
  'deposit-address',
  'withdraw',
  'withdraw-verify',
  'withdraw-security-verify',
  'withdraw-success',
])

const pcRecordsModalScreens = new Set<RecordsScreenState['screen']>([
  'fund',
  'fund-detail',
  'deposit-detail',
])

export function isPcWalletModalScreen(
  previewPlatform: string,
  walletScreen: WalletScreenState | null,
): walletScreen is WalletScreenState & { screen: PcWalletModalScreen } {
  return (
    previewPlatform === 'pc' &&
    !!walletScreen &&
    pcWalletModalScreens.has(walletScreen.screen)
  )
}

export function isPcRecordsModalScreen(
  previewPlatform: string,
  recordsScreen: RecordsScreenState | null,
): recordsScreen is RecordsScreenState & { screen: PcRecordsModalScreen } {
  return (
    previewPlatform === 'pc' &&
    !!recordsScreen &&
    pcRecordsModalScreens.has(recordsScreen.screen)
  )
}
