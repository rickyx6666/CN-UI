import { ArrowUpDown } from 'lucide-react'

export function MarketListHeader({
  contractMode = false,
}: {
  contractMode?: boolean
}) {
  return (
    <div className="layout-screen-x layout-section-y-sm flex items-center justify-between text-[10px] text-secondary">
      <span className="flex items-center gap-0.5">
        {contractMode ? '合约 / 成交额' : '名称 / 成交额'}
        <ArrowUpDown className="h-3 w-3" strokeWidth={1.5} />
      </span>
      <span className="flex items-center gap-0.5">
        价格 / 24H涨幅
        <ArrowUpDown className="h-3 w-3" strokeWidth={1.5} />
      </span>
    </div>
  )
}
