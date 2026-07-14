import type { ContractMarginMode, ContractPosition } from './contract'
import { contractMarginModeLabel } from './contract'
import type { ContractPositionHistory } from './contractRecords'

export type ContractPositionSharePayload =
  | {
      kind: 'open'
      symbol: string
      side: 'long' | 'short'
      marginMode: ContractMarginMode
      leverage: number
      pnlUsd: number
      roePercent: number
      entryPrice: number
      comparePrice: number
      comparePriceLabel: string
      timestamp: number
    }
  | {
      kind: 'closed'
      symbol: string
      side: 'long' | 'short'
      marginMode: ContractMarginMode
      leverage: number
      pnlUsd: number
      roePercent: number
      entryPrice: number
      comparePrice: number
      comparePriceLabel: '平仓均价'
      timestamp: number
    }

export function contractShareFromOpen(
  position: ContractPosition,
): ContractPositionSharePayload {
  return {
    kind: 'open',
    symbol: position.symbol,
    side: position.side,
    marginMode: position.marginMode,
    leverage: position.leverage,
    pnlUsd: position.pnlUsd,
    roePercent: position.roePercent,
    entryPrice: position.entryPrice,
    comparePrice: position.markPrice,
    comparePriceLabel: '标记价格',
    timestamp: Date.now(),
  }
}

export function contractShareFromClosed(
  position: ContractPositionHistory,
): ContractPositionSharePayload {
  return {
    kind: 'closed',
    symbol: position.symbol,
    side: position.side,
    marginMode: position.marginMode,
    leverage: position.leverage,
    pnlUsd: position.realizedPnl,
    roePercent: position.roePercent,
    entryPrice: position.entryPrice,
    comparePrice: position.closePrice,
    comparePriceLabel: '平仓均价',
    timestamp: position.closedAt,
  }
}

export function contractShareSideLabel(side: 'long' | 'short'): string {
  return side === 'long' ? '多' : '空'
}

export function contractSharePnlLabel(kind: ContractPositionSharePayload['kind']): string {
  return kind === 'open' ? '未实现盈亏' : '已实现盈亏'
}

export function contractShareStatusLabel(
  kind: ContractPositionSharePayload['kind'],
): string {
  return kind === 'open' ? '持仓中' : '已平仓'
}

export function contractShareHeadline(payload: ContractPositionSharePayload): string {
  const side = contractShareSideLabel(payload.side)
  return `${side} ${payload.symbol}USDT 永续 · ${contractMarginModeLabel(payload.marginMode)} ${payload.leverage}X`
}
