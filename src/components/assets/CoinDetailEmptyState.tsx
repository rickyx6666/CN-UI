import { FilePenLine } from 'lucide-react'

export function CoinDetailEmptyState({ message = '暂无记录' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-secondary">
      <FilePenLine className="mb-3 h-10 w-10 opacity-40" strokeWidth={1.25} />
      <p className="text-body-sm">{message}</p>
    </div>
  )
}
