import { usePrototype } from '../../context/PrototypeContext'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { WithdrawSecurityVerifyForm } from '../../components/wallet/WithdrawSecurityVerifyForm'
import { walletCopy } from '../../data/wallet'

export function WithdrawSecurityVerifyPage() {
  const { withdrawDraft, navigateWallet, closeWallet, navigateAccount } =
    usePrototype()

  if (!withdrawDraft) return null

  function handleBack() {
    navigateWallet({
      screen: 'withdraw-verify',
      coin: withdrawDraft!.coin,
      chain: withdrawDraft!.chain,
    })
  }

  return (
    <SubPageLayout title={walletCopy.withdrawVerifyTitle} onBack={handleBack}>
      <WithdrawSecurityVerifyForm
        onSuccess={() =>
          navigateWallet({
            screen: 'withdraw-success',
            coin: withdrawDraft.coin,
            chain: withdrawDraft.chain,
          })
        }
        onRequireGoogleSetup={() => {
          closeWallet()
          navigateAccount({ screen: 'security-google-setup' })
        }}
      />
    </SubPageLayout>
  )
}
