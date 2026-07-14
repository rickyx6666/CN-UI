import type { MarketPair } from '../data/mock'
import { isContractPairId } from '../data/productModule'
import { MarketListItem } from './MarketListItem'

interface MarketListProps {
  pairs: MarketPair[]
  contractMode?: boolean
}

export function MarketList({ pairs, contractMode = false }: MarketListProps) {
  if (pairs.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-body-sm text-secondary">暂无数据</p>
      </div>
    )
  }

  return (
    <ul aria-label="行情列表" className="divide-y divide-border-subtle">
      {pairs.map((pair) => (
        <li key={pair.id}>
          <MarketListItem
            pair={pair}
            contractMode={contractMode || isContractPairId(pair.id)}
          />
        </li>
      ))}
    </ul>
  )
}
