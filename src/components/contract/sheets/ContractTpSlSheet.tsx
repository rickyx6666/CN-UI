import { useEffect, useState } from 'react'
import { AuthButton } from '../../auth/AuthButton'
import { BottomSheet } from '../../sheets/BottomSheet'
import type { ContractPosition } from '../../../data/contract'
import {
  contractTpSlSlMarks,
  contractTpSlTabs,
  contractTpSlTpMarks,
  type ContractTpSlTabId,
} from '../../../data/contractPositionActions'
import {
  PositionSheetHeader,
  SheetPercentSlider,
  SheetScrollBody,
  SheetWarning,
} from './ContractPositionSheetParts'

interface ContractTpSlSheetProps {
  open: boolean
  position: ContractPosition | null
  onClose: () => void
  onConfirm: (values: {
    takeProfitPrice: string
    stopLossPrice: string
    sizePercent: number
  }) => void
}

export function ContractTpSlSheet({
  open,
  position,
  onClose,
  onConfirm,
}: ContractTpSlSheetProps) {
  const [tab, setTab] = useState<ContractTpSlTabId>('tpsl')
  const [tpLimit, setTpLimit] = useState(false)
  const [slLimit, setSlLimit] = useState(false)
  const [tpTrigger, setTpTrigger] = useState('')
  const [slTrigger, setSlTrigger] = useState('')
  const [tpRoi, setTpRoi] = useState(0)
  const [slRoi, setSlRoi] = useState(0)
  const [sizePercent, setSizePercent] = useState(100)

  useEffect(() => {
    if (!open || !position) return
    setTpTrigger(String(position.takeProfitPrice))
    setSlTrigger(String(position.stopLossPrice))
    setTab('tpsl')
    setSizePercent(100)
  }, [open, position])

  if (!position) return null

  return (
    <BottomSheet title="止盈/止损" open={open} onClose={onClose}>
      <SheetScrollBody>
        <PositionSheetHeader position={position} />

        <SheetWarning>
          市场行情瞬息万变，将止损触发价设置为接近强平价可能会导致订单无法执行。
        </SheetWarning>

        <div className="mb-4 flex gap-4 overflow-x-auto border-b border-border-subtle scrollbar-none">
          {contractTpSlTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`relative shrink-0 pb-2 text-[11px] font-medium whitespace-nowrap ${
                tab === item.id ? 'text-primary' : 'text-secondary'
              }`}
            >
              {item.label}
              {tab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
              )}
            </button>
          ))}
        </div>

        {tab === 'tpsl' ? (
          <>
            <TpSlSection
              title="止盈"
              accentClassName="border-success"
              limitChecked={tpLimit}
              onLimitChange={setTpLimit}
              triggerLabel="止盈触发价"
              triggerValue={tpTrigger}
              onTriggerChange={setTpTrigger}
              roiLabel="投资回报率"
              roiValue={tpRoi}
              onRoiChange={setTpRoi}
              marks={contractTpSlTpMarks}
            />

            <TpSlSection
              title="止损"
              accentClassName="border-danger"
              limitChecked={slLimit}
              onLimitChange={setSlLimit}
              triggerLabel="止损触发价"
              triggerValue={slTrigger}
              onTriggerChange={setSlTrigger}
              roiLabel="投资回报率"
              roiValue={slRoi}
              onRoiChange={setSlRoi}
              marks={contractTpSlSlMarks}
            />

            <div className="mb-3">
              <p className="mb-1.5 text-[11px] text-secondary">数量</p>
              <div className="mb-2 rounded-md bg-sunken px-3 py-2.5 text-left text-body-sm tabular-nums text-primary">
                {sizePercent}% (≈{((position.size * sizePercent) / 100).toFixed(3)})
              </div>
              <SheetPercentSlider
                marks={[0, 25, 50, 75, 100]}
                value={sizePercent}
                onChange={setSizePercent}
              />
              <p className="mt-2 text-[10px] text-secondary">
                仓位数量 {position.size.toFixed(3)} {position.symbol}
              </p>
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-caption text-secondary">
            {tab === 'position' ? '仓位止盈止损设置' : '跟踪委托设置'}（原型占位）
          </p>
        )}

        <AuthButton
          type="button"
          onClick={() => {
            onConfirm({
              takeProfitPrice: tpTrigger,
              stopLossPrice: slTrigger,
              sizePercent,
            })
            onClose()
          }}
        >
          确认
        </AuthButton>
      </SheetScrollBody>
    </BottomSheet>
  )
}

function TpSlSection({
  title,
  accentClassName,
  limitChecked,
  onLimitChange,
  triggerLabel,
  triggerValue,
  onTriggerChange,
  roiLabel,
  roiValue,
  onRoiChange,
  marks,
}: {
  title: string
  accentClassName: string
  limitChecked: boolean
  onLimitChange: (checked: boolean) => void
  triggerLabel: string
  triggerValue: string
  onTriggerChange: (value: string) => void
  roiLabel: string
  roiValue: number
  onRoiChange: (value: number) => void
  marks: readonly number[]
}) {
  return (
    <section className={`mb-4 border-l-2 pl-3 ${accentClassName}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-body-sm font-medium text-primary">{title}</h3>
        <label className="flex items-center gap-1.5 text-[10px] text-secondary">
          <input
            type="checkbox"
            checked={limitChecked}
            onChange={(event) => onLimitChange(event.target.checked)}
            className="h-3.5 w-3.5 rounded border-border accent-brand"
          />
          限价单
        </label>
      </div>

      <div className="mb-2 grid grid-cols-2 gap-2">
        <MiniField
          label={triggerLabel}
          value={triggerValue}
          onChange={onTriggerChange}
          suffix="最新"
        />
        <MiniField
          label={roiLabel}
          value={String(roiValue)}
          onChange={(value) => onRoiChange(Number(value) || 0)}
          suffix="%"
        />
      </div>

      <SheetPercentSlider marks={marks} value={roiValue} onChange={onRoiChange} />
    </section>
  )
}

function MiniField({
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
    <label className="block rounded-md bg-sunken px-2.5 py-2">
      <p className="mb-1 text-[9px] text-secondary">{label}</p>
      <div className="flex items-center justify-between gap-1">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[11px] tabular-nums text-primary outline-none"
        />
        <span className="shrink-0 text-[10px] text-secondary">{suffix}</span>
      </div>
    </label>
  )
}
