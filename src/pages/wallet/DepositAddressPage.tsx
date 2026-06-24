import { useState } from 'react'
import { ArrowLeftRight, CircleHelp, History } from 'lucide-react'
import { AuthButton } from '../../components/auth/AuthButton'
import { CoinAvatar } from '../../components/CoinAvatar'
import {
  depositWarnings,
  getDepositAddress,
  getDepositNetworkMeta,
  getDepositNetworksForCoin,
  type WalletNetwork,
} from '../../data/wallet'
import { usePrototype } from '../../context/PrototypeContext'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { Annotatable } from '../../components/inspect/Annotatable'
import { CopyButton } from '../../components/common/CopyButton'
import { BottomSheet } from '../../components/sheets/BottomSheet'
import { DepositShareSheet } from '../../components/wallet/DepositShareSheet'

export function DepositAddressPage() {
  const {
    walletScreen,
    closeWallet,
    navigateWallet,
    openFundHistory,
    openHelpCenter,
    showToast,
    figmaWalletOverlay,
  } = usePrototype()

  const coin = walletScreen?.coin ?? 'USDT'
  const chain = walletScreen?.chain ?? 'TRC20'
  const address = getDepositAddress(coin, chain)
  const networkMeta = getDepositNetworkMeta(coin, chain)
  const networks = getDepositNetworksForCoin(coin)
  const [networkSheetOpen, setNetworkSheetOpen] = useState(false)
  const [shareSheetOpen, setShareSheetOpen] = useState(
    figmaWalletOverlay === 'deposit-share',
  )

  function handleBack() {
    navigateWallet({ screen: 'deposit', coin, chain })
  }

  function handleNetworkSelect(next: WalletNetwork) {
    setNetworkSheetOpen(false)
    navigateWallet({ screen: 'deposit-address', coin, chain: next })
  }

  function handleSaveOrShare() {
    setShareSheetOpen(true)
  }

  async function handleSaveImage() {
    setShareSheetOpen(false)
    showToast('已保存到相册')
  }

  async function handleShare() {
    const text = `充值 ${coin} 地址：${address}\n网络：${networkMeta?.label ?? chain}`
    try {
      if (navigator.share) {
        await navigator.share({ title: `充值 ${coin} 到 CoinNova`, text })
        setShareSheetOpen(false)
        return
      }
      await navigator.clipboard.writeText(text)
      setShareSheetOpen(false)
      showToast('地址已复制，可粘贴分享')
    } catch {
      showToast('分享已取消', 'info')
    }
  }

  const headerRight = (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        aria-label="帮助"
        onClick={openHelpCenter}
        className="flex h-9 w-9 items-center justify-center text-primary active:opacity-70"
      >
        <CircleHelp className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="充提记录"
        onClick={() => {
          closeWallet()
          openFundHistory()
        }}
        className="flex h-9 w-9 items-center justify-center text-primary active:opacity-70"
      >
        <History className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </div>
  )

  return (
    <SubPageLayout
      title={`充值 ${coin}`}
      onBack={handleBack}
      headerRight={headerRight}
      footer={
        <>
          <p className="mb-3 text-center text-caption text-secondary">
            * {depositWarnings[0]}
          </p>
          <AuthButton onClick={handleSaveOrShare}>保存或分享地址</AuthButton>
        </>
      }
    >
      <div className="mb-5 flex justify-center">
        <div className="relative flex h-44 w-44 items-center justify-center rounded-xl border border-border-subtle bg-elevated">
          <div className="grid h-36 w-36 grid-cols-8 grid-rows-8 gap-0.5 opacity-80">
            {Array.from({ length: 64 }).map((_, i) => (
              <span
                key={i}
                className={`block rounded-[1px] ${
                  (i + chain.length) % 3 === 0 ? 'bg-primary' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CoinAvatar symbol={coin} size={40} />
          </div>
        </div>
      </div>

      <div className="mb-3 rounded-lg border border-border-subtle bg-elevated px-4 py-3">
        <button
          type="button"
          onClick={() => setNetworkSheetOpen(true)}
          className="flex w-full items-start justify-between gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="text-caption text-secondary">网络</p>
            <p className="mt-0.5 text-body-sm font-medium text-primary">
              {networkMeta?.label ?? chain}
            </p>
            {networkMeta?.contractAddress && (
              <p className="mt-1 text-caption text-secondary">
                合约地址 {networkMeta.contractAddress}
              </p>
            )}
          </div>
          <ArrowLeftRight className="mt-1 h-5 w-5 shrink-0 text-secondary" strokeWidth={1.5} />
        </button>
      </div>

      <Annotatable id="deposit-address">
        <div className="rounded-lg border border-border-subtle bg-elevated px-4 py-3">
          <p className="text-body-sm font-medium text-primary">充值地址</p>
          <p className="mt-2 break-all text-body-sm leading-relaxed text-primary">
            {address}
          </p>
          <div className="mt-3 flex justify-end">
            <CopyButton
              value={address}
              className="rounded-md bg-brand px-4 py-2 text-body-sm font-semibold text-brand-dark"
            />
          </div>
        </div>
      </Annotatable>

      <div className="mt-4 space-y-3 border-t border-border-subtle pt-4 text-body-sm">
        <DetailRow label="最小充值" value={networkMeta?.minDeposit ?? '—'} />
        <DetailRow
          label="充值确认"
          value={`${networkMeta?.blockConfirmations ?? '—'}次网络确认`}
        />
        <DetailRow
          label="提现解锁"
          value={`${networkMeta?.blockConfirmations ?? '—'}次网络确认`}
        />
      </div>

      <BottomSheet
        title="选择网络"
        open={networkSheetOpen}
        onClose={() => setNetworkSheetOpen(false)}
      >
        <div className="max-h-[60vh] space-y-2 overflow-y-auto">
          {networks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNetworkSelect(item.id)}
              className={`w-full rounded-lg border px-4 py-3 text-left active:opacity-80 ${
                chain === item.id
                  ? 'border-brand bg-brand-muted'
                  : 'border-border-subtle bg-sunken'
              }`}
            >
              <p className="text-body-sm font-medium text-primary">{item.label}</p>
              <p className="mt-1 text-caption leading-relaxed text-secondary">
                {item.blockConfirmations} 次区块确认 · 最小充值 {item.minDeposit}
              </p>
            </button>
          ))}
        </div>
      </BottomSheet>

      <DepositShareSheet
        open={shareSheetOpen}
        onClose={() => setShareSheetOpen(false)}
        coin={coin}
        address={address}
        networkLabel={networkMeta?.label ?? chain}
        minDeposit={networkMeta?.minDeposit ?? '—'}
        onSave={handleSaveImage}
        onShare={handleShare}
      />
    </SubPageLayout>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-secondary">{label}</span>
      <span className="text-right text-primary">{value}</span>
    </div>
  )
}
