import { useMemo, useState } from 'react'
import type { MarketPair } from '../../data/mock'
import { contractFundingDetail, contractFundingRate } from '../../data/contract'
import { ContractFundingSheet } from './ContractFundingSheet'

interface ContractFundingRateProps {
  pair: MarketPair
}

export function ContractFundingRate({ pair }: ContractFundingRateProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const funding = contractFundingRate(pair)
  const detail = useMemo(() => contractFundingDetail(pair), [pair])

  return (
    <>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="mb-1 w-full shrink-0 text-left active:opacity-80"
      >
        <p className="text-[9px] leading-tight text-secondary underline decoration-secondary/70 underline-offset-2">
          资金费率(8时)/倒计时
        </p>
        <p className="mt-0.5 text-[10px] leading-tight tabular-nums text-primary">
          {funding.ratePercent} / {funding.countdown}
        </p>
      </button>

      <ContractFundingSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        detail={detail}
      />
    </>
  )
}
