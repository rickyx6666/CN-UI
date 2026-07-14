import type { ReactNode } from 'react'

/** 交易页左右栏：操作区 1.15 / 盘口 1，与现货一致 */
const tradeMarketGridClass =
  'grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start gap-2 px-3 pb-2'

interface TradeMarketColumnsProps {
  form: ReactNode
  book: ReactNode
}

export function TradeMarketColumns({ form, book }: TradeMarketColumnsProps) {
  return (
    <div className={tradeMarketGridClass}>
      <div className="min-w-0 w-full">{form}</div>
      <div className="min-w-0 w-full">{book}</div>
    </div>
  )
}
