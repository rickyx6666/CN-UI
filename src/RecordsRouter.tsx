import { usePrototype } from './context/PrototypeContext'
import { DepositDetailPage } from './pages/records/DepositDetailPage'
import { FundDetailPage } from './pages/records/FundDetailPage'
import { FundHistoryPage } from './pages/records/FundHistoryPage'
import { ContractOrderHistoryDetailPage } from './pages/records/ContractOrderHistoryDetailPage'
import { ContractRecordsPage } from './pages/records/ContractRecordsPage'
import { OrderDetailPage } from './pages/records/OrderDetailPage'
import { OrderHistoryPage } from './pages/records/OrderHistoryPage'

export function RecordsRouter() {
  const { recordsScreen } = usePrototype()

  if (!recordsScreen) return null

  switch (recordsScreen.screen) {
    case 'fund':
      return <FundHistoryPage />
    case 'fund-detail':
      return <FundDetailPage />
    case 'deposit-detail':
      return <DepositDetailPage />
    case 'orders':
      return <OrderHistoryPage />
    case 'contract-records':
      return <ContractRecordsPage />
    case 'contract-order-detail':
      return <ContractOrderHistoryDetailPage />
    case 'order-detail':
      return <OrderDetailPage />
    default:
      return null
  }
}
