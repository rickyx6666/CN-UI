import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { AuthButton } from '../auth/AuthButton'
import {
  contractEstimatedClosePnl,
  contractOrderSideLabel,
  contractOrderSideTone,
  contractPositionEntryPrice,
  contractTpSlLabel,
  contractTpSlTone,
  type ContractBasicOrder,
  type ContractTpSlOrder,
} from '../../data/contract'
import { formatUsd } from '../../data/mock'

export type ContractOrderEditTarget =
  | { kind: 'basic'; order: ContractBasicOrder }
  | { kind: 'conditional'; order: ContractTpSlOrder }

interface ContractOrderEditSheetProps {
  target: ContractOrderEditTarget | null
  onClose: () => void
  onConfirmBasic: (orderId: string, values: { price: number; size: number }) => void
  onConfirmConditional: (
    orderId: string,
    values: { triggerPrice: number },
  ) => void
}

export function ContractOrderEditSheet({
  target,
  onClose,
  onConfirmBasic,
  onConfirmConditional,
}: ContractOrderEditSheetProps) {
  if (!target) return null

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="关闭"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="委托编辑"
        className="relative z-10 w-full max-w-[390px] rounded-t-xl border border-border-subtle bg-elevated px-4 pb-8 pt-3"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        {target.kind === 'basic' ? (
          <BasicOrderEditForm order={target.order} onConfirm={onConfirmBasic} />
        ) : (
          <ConditionalOrderEditForm
            order={target.order}
            onConfirm={onConfirmConditional}
          />
        )}
      </div>
    </div>
  )
}

function BasicOrderEditForm({
  order,
  onConfirm,
}: {
  order: ContractBasicOrder
  onConfirm: (orderId: string, values: { price: number; size: number }) => void
}) {
  const [price, setPrice] = useState(formatInput(order.price, 2))
  const [size, setSize] = useState(formatInput(order.size, 3))
  const tone = contractOrderSideTone(order)
  const sideLabel = contractOrderSideLabel(order)

  useEffect(() => {
    setPrice(formatInput(order.price, 2))
    setSize(formatInput(order.size, 3))
  }, [order])

  function handleConfirm() {
    const nextPrice = Number(price)
    const nextSize = Number(size)
    if (!nextPrice || !nextSize) return
    onConfirm(order.id, { price: nextPrice, size: nextSize })
  }

  return (
    <>
      <SheetHeader
        symbol={order.symbol}
        sideLabel={sideLabel}
        tone={tone}
      />

      <div className="space-y-4">
        <SheetInputField
          label={`价格 (当前为 ${formatInput(order.price, 2)})`}
          value={price}
          onChange={setPrice}
          suffix="USDT"
        />
        <SheetInputField
          label={`数量 (当前为 ${formatInput(order.size, 3)})`}
          value={size}
          onChange={setSize}
          suffix={order.symbol}
        />
      </div>

      <div className="mt-6">
        <AuthButton type="button" onClick={handleConfirm}>
          确认
        </AuthButton>
      </div>
    </>
  )
}

function ConditionalOrderEditForm({
  order,
  onConfirm,
}: {
  order: ContractTpSlOrder
  onConfirm: (orderId: string, values: { triggerPrice: number }) => void
}) {
  const [triggerPrice, setTriggerPrice] = useState(
    formatInput(order.triggerPrice, 2),
  )
  const tone = contractTpSlTone(order)
  const sideLabel = contractTpSlLabel(order)
  const entryPrice = contractPositionEntryPrice(order.symbol, order.side)

  useEffect(() => {
    setTriggerPrice(formatInput(order.triggerPrice, 2))
  }, [order])

  const estimatedPnl = useMemo(() => {
    if (entryPrice == null) return null
    const parsed = Number(triggerPrice)
    if (!parsed) return null
    return contractEstimatedClosePnl(
      entryPrice,
      parsed,
      order.size,
      order.side,
    )
  }, [entryPrice, order.side, order.size, triggerPrice])

  function handleConfirm() {
    const nextTriggerPrice = Number(triggerPrice)
    if (!nextTriggerPrice) return
    onConfirm(order.id, { triggerPrice: nextTriggerPrice })
  }

  return (
    <>
      <SheetHeader
        symbol={order.symbol}
        sideLabel={sideLabel}
        tone={tone}
        trailing={
          entryPrice != null ? (
            <div className="text-right">
              <p className="text-[10px] text-secondary">开仓价格 (USDT)</p>
              <p className="mt-0.5 text-body-sm font-semibold tabular-nums text-primary">
                {formatUsd(entryPrice)}
              </p>
            </div>
          ) : undefined
        }
      />

      <div className="space-y-4">
        <SheetInputField
          label={`触发价格 (当前为 ${formatInput(order.triggerPrice, 2)})`}
          value={triggerPrice}
          onChange={setTriggerPrice}
          suffix="USDT"
        />
      </div>

      <div className="mt-4 space-y-2">
        <InfoRow
          label="仓位数量"
          value={`${order.size.toFixed(3)} ${order.symbol}`}
        />
        {estimatedPnl != null && (
          <InfoRow
            label="预估盈亏"
            value={`${estimatedPnl >= 0 ? '' : ''}${estimatedPnl.toFixed(2)} USDT`}
            valueClassName={
              estimatedPnl >= 0 ? 'text-success' : 'text-danger'
            }
          />
        )}
      </div>

      <div className="mt-6">
        <AuthButton type="button" onClick={handleConfirm}>
          确认
        </AuthButton>
      </div>
    </>
  )
}

function SheetHeader({
  symbol,
  sideLabel,
  tone,
  trailing,
}: {
  symbol: string
  sideLabel: string
  tone: 'success' | 'danger'
  trailing?: ReactNode
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="inline-flex rounded bg-sunken px-2 py-0.5">
          <span className="text-caption font-semibold text-primary">
            {symbol}USDT 永续
          </span>
        </div>
        <p
          className={`mt-1.5 text-body-sm font-medium ${
            tone === 'success' ? 'text-success' : 'text-danger'
          }`}
        >
          {sideLabel}
        </p>
      </div>
      {trailing}
    </div>
  )
}

function SheetInputField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  suffix: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-caption text-secondary">{label}</span>
      <div className="flex h-11 items-center rounded-lg bg-sunken px-3">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-body-sm tabular-nums text-primary outline-none"
        />
        <span className="shrink-0 text-caption text-secondary">{suffix}</span>
      </div>
    </label>
  )
}

function InfoRow({
  label,
  value,
  valueClassName = 'text-primary',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-caption">
      <span className="text-secondary">{label}</span>
      <span className={`tabular-nums ${valueClassName}`}>{value}</span>
    </div>
  )
}

function formatInput(value: number, decimals: number) {
  return value.toFixed(decimals)
}
