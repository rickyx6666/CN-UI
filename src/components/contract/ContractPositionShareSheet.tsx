import { AuthButton } from '../auth/AuthButton'
import { BottomSheet } from '../sheets/BottomSheet'
import { usePrototype } from '../../context/PrototypeContext'
import { referralSummary } from '../../data/referral'
import type { ContractPositionSharePayload } from '../../data/contractShare'
import { contractShareHeadline } from '../../data/contractShare'
import { ContractPositionShareCard } from './ContractPositionShareCard'

interface ContractPositionShareSheetProps {
  open: boolean
  payload: ContractPositionSharePayload | null
  onClose: () => void
}

export function ContractPositionShareSheet({
  open,
  payload,
  onClose,
}: ContractPositionShareSheetProps) {
  const { showToast } = usePrototype()

  if (!payload) return null

  const sharePayload = payload

  async function handleShare() {
    const roeSign = sharePayload.roePercent >= 0 ? '+' : ''
    const pnlSign = sharePayload.pnlUsd >= 0 ? '+' : ''
    const text = [
      contractShareHeadline(sharePayload),
      `投资回报率 ${roeSign}${sharePayload.roePercent.toFixed(2)}%`,
      `${sharePayload.kind === 'open' ? '未实现盈亏' : '已实现盈亏'} ${pnlSign}${sharePayload.pnlUsd.toFixed(2)} USDT`,
      `邀请码 ${referralSummary.inviteCode}`,
      referralSummary.inviteLink,
    ].join('\n')

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'CoinNova 仓位分享',
          text,
        })
        onClose()
        return
      }
      await navigator.clipboard.writeText(text)
      onClose()
      showToast('分享内容已复制')
    } catch {
      showToast('分享已取消', 'info')
    }
  }

  function handleSave() {
    onClose()
    showToast('图片已保存到相册')
  }

  return (
    <BottomSheet title="分享仓位" open={open} onClose={onClose}>
      <div className="flex justify-center rounded-xl bg-black/40 px-2 py-4">
        <ContractPositionShareCard payload={payload} />
      </div>

      <div className="mt-4 flex gap-3">
        <AuthButton variant="secondary" onClick={handleSave}>
          保存图片
        </AuthButton>
        <AuthButton onClick={handleShare}>分享</AuthButton>
      </div>
    </BottomSheet>
  )
}
