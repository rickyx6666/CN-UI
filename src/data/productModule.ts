export type ProductModule = 'spot' | 'contract'

export const productModuleTabs: { id: ProductModule; label: string }[] = [
  { id: 'spot', label: '现货' },
  { id: 'contract', label: '合约' },
]

export function isContractPairId(pairId: string): boolean {
  return pairId.startsWith('perp-')
}
