import { useEffect, useMemo, useState } from 'react'
import { AuthButton } from '../../auth/AuthButton'
import { BottomSheet } from '../../sheets/BottomSheet'
import type { ContractPosition } from '../../../data/contract'
import { contractEstimatedClosePnl } from '../../../data/contract'
import { formatUsd } from '../../../data/mock'
import { contractClosePercentMarks } from '../../../data/contractPositionActions'
import {
  PositionCloseHeader,
  SheetInputField,
  SheetMarkSlider,
  SheetScrollBody,
} from './ContractPositionSheetParts'

interface ContractClosePositionSheetProps {
  open: boolean
  position: ContractPosition | null
  onClose: () => void
  onConfirm: (values: { priceMode: 'market' | 'limit'; sizePercent: number }) => void
}

export function ContractClosePositionSheet({
  open,
  position,
  onClose,
  onConfirm,
}: ContractClosePositionSheetProps) {
  const [priceMode, setPriceMode] = useState<'market' | 'limit'>('market')
  const [price, setPrice] = useState('')
  const [sizePercent, setSizePercent] = useState(100)

  useEffect(() => {
    if (!open || !position) return
    setPriceMode('market')
    setPrice(String(position.markPrice))
    setSizePercent(100)
  }, [open, position])

  const closeSize = useMemo(() => {
    if (!position) return 0
    return (position.size * sizePercent) / 100
  }, [position, sizePercent])

  const estimatedPnl = useMemo(() => {
    if (!position) return 0
    const exitPrice =
      priceMode === 'market'
        ? position.markPrice
        : Number(price) || position.markPrice
    return contractEstimatedClosePnl(
      position.entryPrice,
      exitPrice,
      closeSize,
      position.side,
    )
  }, [closeSize, position, price, priceMode])

  if (!position) return null

  const positive = estimatedPnl >= 0
  const isMarket = priceMode === 'market'

  function togglePriceMode() {
    setPriceMode((prev) => {
      const next = prev === 'market' ? 'limit' : 'market'
      if (next === 'limit') {
        setPrice(String(position!.markPrice))
      }
      return next
    })
  }

  return (
    <BottomSheet title="平仓" open={open} onClose={onClose}>
      <SheetScrollBody>
        <PositionCloseHeader position={position} />

        <SheetInputField
          label="价格"
          value={isMarket ? '市价' : price}
          onChange={setPrice}
          readOnly={isMarket}
          suffix={isMarket ? undefined : 'USDT'}
          dropdownLabel={isMarket ? '市价' : '限价'}
          onDropdownClick={togglePriceMode}
        />

        <SheetInputField
          label="数量"
          value={`${sizePercent}% (≈${closeSize.toFixed(3)})`}
          readOnly
          suffix={position.symbol}
        />

        <SheetMarkSlider
          marks={contractClosePercentMarks}
          value={sizePercent}
          onChange={setSizePercent}
          formatMark={(mark) => `${mark}%`}
        />

        <div className="mb-4 space-y-2 text-[11px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-secondary">仓位数量</span>
            <span className="tabular-nums text-primary">
              {position.size.toFixed(3)} {position.symbol}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-secondary">预计盈亏</span>
            <span
              className={`tabular-nums ${
                positive ? 'text-success' : 'text-danger'
              }`}
            >
              {positive ? '+' : ''}
              {formatUsd(estimatedPnl)} USDT
            </span>
          </div>
        </div>

        <AuthButton
          type="button"
          onClick={() => {
            onConfirm({ priceMode, sizePercent })
            onClose()
          }}
        >
          确认
        </AuthButton>
      </SheetScrollBody>
    </BottomSheet>
  )
}
