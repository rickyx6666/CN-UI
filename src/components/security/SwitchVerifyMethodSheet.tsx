import { BottomSheet } from '../sheets/BottomSheet'
import {
  securityVerifyMethodMeta,
  type SecurityVerifyMethodId,
} from '../../data/securityVerify'

interface SwitchVerifyMethodSheetProps {
  open: boolean
  methods: SecurityVerifyMethodId[]
  onClose: () => void
  onSelect: (method: SecurityVerifyMethodId) => void
}

export function SwitchVerifyMethodSheet({
  open,
  methods,
  onClose,
  onSelect,
}: SwitchVerifyMethodSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="切换验证方式">
      <div className="space-y-2 pb-2">
        {methods.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => {
              onSelect(method)
              onClose()
            }}
            className="flex w-full items-center justify-between rounded-xl border border-border-subtle bg-elevated px-4 py-3 text-left active:bg-sunken"
          >
            <span className="text-body-sm font-medium text-primary">
              {securityVerifyMethodMeta[method].title}
            </span>
            <span className="text-caption text-secondary">选择</span>
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
