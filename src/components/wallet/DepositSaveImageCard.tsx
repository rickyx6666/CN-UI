import { CoinAvatar } from '../CoinAvatar'
import type { WalletCoin } from '../../data/wallet'

interface DepositSaveImageCardProps {
  coin: WalletCoin
  address: string
  networkLabel: string
  seed?: string
}

/** 保存到相册后的图片内容样式（参考 Nivex 充币卡片） */
export function DepositSaveImageCard({
  coin,
  address,
  networkLabel,
  seed = '',
}: DepositSaveImageCardProps) {
  return (
    <div
      className="w-full rounded-2xl bg-white px-5 py-6 text-[#0A0A0A] shadow-sm"
      data-save-image-card
    >
      <h2 className="text-center text-[18px] font-bold leading-snug">
        向 CoinNova 充币 {coin}
      </h2>
      <p className="mt-2 text-center text-[13px] text-[#71717A]">
        请确保转账选择此币种和网络
      </p>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-[#E4E4E7] px-4 py-3.5">
        <span className="text-[13px] text-[#71717A]">数字货币</span>
        <div className="flex items-center gap-2">
          <CoinAvatar symbol={coin} size={22} />
          <span className="text-[14px] font-medium">{coin}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#E4E4E7] px-4 py-3.5">
        <span className="text-[13px] text-[#71717A]">网络</span>
        <span className="max-w-[200px] truncate text-right text-[14px] font-medium">
          {networkLabel}
        </span>
      </div>

      <p className="mt-5 text-center text-[13px] text-[#71717A]">
        请确保转账输入此地址
      </p>

      <div className="mt-3 rounded-xl border border-[#E4E4E7] px-4 pb-4 pt-3">
        <p className="text-[13px] text-[#71717A]">地址</p>
        <div className="my-4 flex justify-center">
          <SaveImageQrCode seed={`${seed}${address}${coin}`} size={148} />
        </div>
        <p className="break-all text-center text-[12px] font-medium leading-relaxed text-[#0A0A0A]">
          {address}
        </p>
      </div>
    </div>
  )
}

function SaveImageQrCode({ seed, size }: { seed: string; size: number }) {
  const grid = 11
  const cells = grid * grid
  const inner = size - 8

  return (
    <div
      className="flex items-center justify-center bg-white"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div
        className="grid gap-[1.5px]"
        style={{
          width: inner,
          height: inner,
          gridTemplateColumns: `repeat(${grid}, 1fr)`,
        }}
      >
        {Array.from({ length: cells }).map((_, i) => {
          const filled = (i + seed.length) % 3 !== 0
          return (
            <span
              key={i}
              className={`block rounded-[1px] ${filled ? 'bg-[#0A0A0A]' : 'bg-white'}`}
            />
          )
        })}
      </div>
    </div>
  )
}
