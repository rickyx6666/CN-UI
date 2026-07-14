import { CheckCircle2 } from 'lucide-react'
import { AuthButton } from '../../components/auth/AuthButton'
import { DepositSaveImageCard } from '../../components/wallet/DepositSaveImageCard'
import {
  getDepositAddress,
  getDepositNetworkMeta,
  walletCopy,
} from '../../data/wallet'
import { usePrototype } from '../../context/PrototypeContext'
import { SubPageLayout } from '../../components/account/SubPageLayout'

export function DepositSaveSuccessPage() {
  const { walletScreen, navigateWallet } = usePrototype()

  const coin = walletScreen?.coin ?? 'USDT'
  const chain = walletScreen?.chain ?? 'TRC20'
  const address = getDepositAddress(coin, chain)
  const networkMeta = getDepositNetworkMeta(coin, chain)

  function handleDone() {
    navigateWallet({ screen: 'deposit-address', coin, chain })
  }

  return (
    <SubPageLayout title={walletCopy.depositSaveSuccessTitle} onBack={handleDone}>
      <div className="flex flex-col items-center py-4 text-center">
        <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={1.5} />
        <p className="mt-3 text-h3 font-semibold text-primary">已保存到相册</p>
        <p className="mt-2 max-w-[300px] text-body-sm text-secondary">
          可在相册中查看保存的充币二维码图片
        </p>
      </div>

      <div className="rounded-xl bg-[#F4F4F5] px-3 py-4">
        <p className="mb-3 text-center text-caption text-secondary">保存的图片内容</p>
        <DepositSaveImageCard
          coin={coin}
          address={address}
          networkLabel={networkMeta?.label ?? chain}
        />
      </div>

      <div className="mt-6">
        <AuthButton onClick={handleDone}>完成</AuthButton>
      </div>
    </SubPageLayout>
  )
}
