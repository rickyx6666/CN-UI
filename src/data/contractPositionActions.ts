export const contractLeverageAdjustMarks = [1, 30, 60, 90, 120, 150] as const

export const contractLeverageAdjustTips = [
  '当前杠杆倍数最高可开 150,000,000 USDT。',
  '选择超过 [10x] 杠杆交易会增加强行平仓风险，请注意相关风险，更多信息请参考这里。',
  '调整杠杆将会对当前合约下的当前仓位和当前委托同时生效。',
  '逐仓模式下，仅可增加杠杆。若需降低杠杆，请先补充仓位保证金。',
] as const

export const contractTpSlTabs = [
  { id: 'tpsl', label: '止盈/止损' },
  { id: 'position', label: '仓位止盈止损' },
  { id: 'trailing', label: '跟踪委托' },
] as const

export type ContractTpSlTabId = (typeof contractTpSlTabs)[number]['id']

export const contractTpSlTpMarks = [0, 30, 60, 90, 120, 150] as const
export const contractTpSlSlMarks = [0, 15, 30, 45, 60, 75] as const
export const contractClosePercentMarks = [0, 25, 50, 75, 100] as const
