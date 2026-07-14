import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BottomSheet } from '../sheets/BottomSheet'

interface AssetHistoryPickerSheetProps {
  open: boolean
  onClose: () => void
  onSelectFundHistory: () => void
  onSelectSpotHistory: () => void
  onSelectContractHistory: () => void
}

type PickerStep = 'root' | 'trade'

export function AssetHistoryPickerSheet({
  open,
  onClose,
  onSelectFundHistory,
  onSelectSpotHistory,
  onSelectContractHistory,
}: AssetHistoryPickerSheetProps) {
  const [step, setStep] = useState<PickerStep>('root')

  useEffect(() => {
    if (!open) setStep('root')
  }, [open])

  function closeSheet() {
    setStep('root')
    onClose()
  }

  function navigate(action: () => void) {
    closeSheet()
    action()
  }

  return (
    <BottomSheet
      title={step === 'root' ? '选择历史记录' : '交易'}
      open={open}
      onClose={closeSheet}
    >
      {step === 'root' ? (
        <>
          <HistoryGroup
            title="资产"
            hint="总览 · 充币 · 提币 · 划转 · 红包 · 赚币 · 支付 · 分发"
            onClick={() => navigate(onSelectFundHistory)}
          />
          <HistoryGroup
            title="交易"
            hint="现货 · 全仓杠杆 · 逐仓杠杆 · U本位合约 · 币本位合约 · 期权"
            onClick={() => setStep('trade')}
          />
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setStep('root')}
            className="mb-3 inline-flex items-center gap-1 text-body-sm text-secondary active:opacity-70"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            返回
          </button>
          <HistoryOption
            label="现货"
            onClick={() => navigate(onSelectSpotHistory)}
          />
          <HistoryOption
            label="U本位合约"
            onClick={() => navigate(onSelectContractHistory)}
          />
        </>
      )}
    </BottomSheet>
  )
}

function HistoryGroup({
  title,
  hint,
  onClick,
}: {
  title: string
  hint: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 flex w-full items-center justify-between rounded-xl border border-border-subtle bg-sunken px-4 py-3.5 text-left active:opacity-80"
    >
      <div className="min-w-0 pr-3">
        <p className="text-body-sm font-medium text-primary">{title}</p>
        <p className="mt-1 truncate text-caption text-secondary">{hint}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-secondary" />
    </button>
  )
}

function HistoryOption({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-2 flex w-full items-center justify-between rounded-xl border border-border-subtle bg-sunken px-4 py-3.5 text-left active:opacity-80"
    >
      <span className="text-body-sm text-primary">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-secondary" />
    </button>
  )
}
