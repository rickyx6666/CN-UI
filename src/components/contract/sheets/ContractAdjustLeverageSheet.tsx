import { useEffect, useState } from 'react'
import { AuthButton } from '../../auth/AuthButton'
import { BottomSheet } from '../../sheets/BottomSheet'
import type { ContractPosition } from '../../../data/contract'
import { contractLeverageAdjustMarks, contractLeverageAdjustTips } from '../../../data/contractPositionActions'
import {
  SheetInputField,
  SheetLinkRow,
  SheetMarkSlider,
  SheetScrollBody,
} from './ContractPositionSheetParts'

interface ContractAdjustLeverageSheetProps {
  open: boolean
  position: ContractPosition | null
  onClose: () => void
  onConfirm: (leverage: number) => void
}

export function ContractAdjustLeverageSheet({
  open,
  position,
  onClose,
  onConfirm,
}: ContractAdjustLeverageSheetProps) {
  const [leverage, setLeverage] = useState(position?.leverage ?? 7)

  useEffect(() => {
    if (open && position) setLeverage(position.leverage)
  }, [open, position])

  if (!position) return null

  return (
    <BottomSheet title="调整杠杆" open={open} onClose={onClose}>
      <SheetScrollBody>
        <SheetInputField
          label=""
          value={`${leverage}x`}
          onChange={(value) => {
            const parsed = Number(value.replace(/[^\d]/g, ''))
            if (!Number.isNaN(parsed) && parsed > 0) setLeverage(parsed)
          }}
        />

        <SheetMarkSlider
          marks={contractLeverageAdjustMarks}
          value={leverage}
          onChange={setLeverage}
          formatMark={(mark) => `${mark}X`}
        />

        <ul className="mb-4 space-y-2 text-[10px] leading-relaxed text-secondary">
          {contractLeverageAdjustTips.map((tip) => (
            <li key={tip} className="flex gap-1.5">
              <span className="shrink-0">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>

        <SheetLinkRow label="默认杠杆和保证金模式" value="关闭 >" />

        <AuthButton
          type="button"
          onClick={() => {
            onConfirm(leverage)
            onClose()
          }}
        >
          确认
        </AuthButton>
      </SheetScrollBody>
    </BottomSheet>
  )
}
