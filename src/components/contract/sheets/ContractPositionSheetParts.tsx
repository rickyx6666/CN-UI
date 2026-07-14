import type { ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ContractPosition } from '../../../data/contract'
import { formatUsd } from '../../../data/mock'

export function PositionSheetHeader({ position }: { position: ContractPosition }) {
  const isLong = position.side === 'long'

  return (
    <div className="mb-4 space-y-2 rounded-lg bg-sunken px-3 py-3 text-[11px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-secondary">合约</span>
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary">
            {position.symbol}USDT 永续
          </span>
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${
              isLong ? 'bg-success' : 'bg-danger'
            }`}
          >
            {isLong ? '做多' : '做空'} {position.leverage}x
          </span>
        </div>
      </div>
      <InfoRow label="开仓价格" value={`${formatUsd(position.entryPrice)} USDT`} />
      <InfoRow label="标记价格" value={`${formatUsd(position.markPrice)} USDT`} />
      <InfoRow
        label="预计强平价格"
        value={`${formatUsd(position.liquidationPrice)} USDT`}
      />
    </div>
  )
}

export function PositionCloseHeader({ position }: { position: ContractPosition }) {
  const isLong = position.side === 'long'

  return (
    <div className="mb-4 space-y-2 text-[11px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-secondary">合约</span>
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary">
            {position.symbol}USDT 永续
          </span>
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${
              isLong ? 'bg-success' : 'bg-danger'
            }`}
          >
            {isLong ? '做多' : '做空'} {position.leverage}x
          </span>
        </div>
      </div>
      <InfoRow label="开仓价格" value={`${formatUsd(position.entryPrice)} USDT`} />
      <InfoRow label="标记价格" value={`${formatUsd(position.markPrice)} USDT`} />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-secondary">{label}</span>
      <span className="tabular-nums text-primary">{value}</span>
    </div>
  )
}

export function SheetInputField({
  label,
  value,
  onChange,
  readOnly = false,
  suffix,
  dropdownLabel,
  onDropdownClick,
}: {
  label: string
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  suffix?: string
  dropdownLabel?: string
  onDropdownClick?: () => void
}) {
  return (
    <label className="mb-3 block">
      {label ? (
        <p className="mb-1.5 text-[11px] text-secondary">{label}</p>
      ) : null}
      <div className="flex items-center gap-2">
        <div className="flex h-10 min-w-0 flex-1 items-center rounded-md bg-sunken px-3">
          {readOnly ? (
            <span className="w-full text-left text-body-sm tabular-nums text-primary">
              {value}
            </span>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(event) => onChange?.(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-left text-body-sm tabular-nums text-primary outline-none"
            />
          )}
          {suffix ? (
            <span className="ml-2 shrink-0 text-caption text-secondary">{suffix}</span>
          ) : null}
        </div>
        {dropdownLabel ? (
          <button
            type="button"
            onClick={onDropdownClick}
            className="flex h-10 min-w-[96px] shrink-0 items-center justify-between gap-1.5 rounded-md bg-sunken px-3 text-caption text-secondary active:opacity-80"
          >
            <span className="truncate">{dropdownLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          </button>
        ) : null}
      </div>
    </label>
  )
}

export function SheetMarkSlider({
  marks,
  value,
  onChange,
  formatMark,
}: {
  marks: readonly number[]
  value: number
  onChange: (value: number) => void
  formatMark?: (mark: number) => string
}) {
  const min = marks[0]
  const max = marks[marks.length - 1]
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100

  return (
    <div className="mb-2">
      <div className="relative mb-4 h-1 rounded-full bg-border">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-brand/70"
          style={{ width: `${percent}%` }}
        />
        <div className="absolute inset-x-0 -top-1 flex justify-between">
          {marks.map((mark) => (
            <button
              key={mark}
              type="button"
              onClick={() => onChange(mark)}
              className="flex flex-col items-center"
            >
              <span
                className={`h-2.5 w-2.5 rotate-45 border ${
                  value >= mark
                    ? 'border-brand bg-brand'
                    : 'border-border bg-base'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[9px] text-secondary">
        {marks.map((mark) => (
          <span key={mark}>{formatMark ? formatMark(mark) : mark}</span>
        ))}
      </div>
    </div>
  )
}

export function SheetPercentSlider({
  marks,
  value,
  onChange,
}: {
  marks: readonly number[]
  value: number
  onChange: (value: number) => void
}) {
  return (
    <SheetMarkSlider
      marks={marks}
      value={value}
      onChange={onChange}
      formatMark={(mark) => `${mark}%`}
    />
  )
}

export function SheetLinkRow({
  label,
  value,
  onClick,
}: {
  label: string
  value: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 flex w-full items-center justify-between rounded-md bg-sunken px-3 py-2.5 text-left active:opacity-80"
    >
      <span className="text-[11px] text-secondary">{label}</span>
      <span className="flex items-center gap-1 text-[11px] text-secondary">
        {value}
        <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </span>
    </button>
  )
}

export function SheetWarning({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 rounded-md bg-sunken px-3 py-2.5 text-[10px] leading-relaxed text-secondary">
      {children}
    </div>
  )
}

export function SheetScrollBody({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-1 max-h-[min(72vh,640px)] overflow-y-auto overscroll-contain px-1">
      {children}
    </div>
  )
}
