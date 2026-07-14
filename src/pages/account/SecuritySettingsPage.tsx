import { useState } from 'react'
import {
  accountCopy,
  maskEmail,
  securityGroups,
  securityItems,
} from '../../data/account'
import { usePrototype } from '../../context/PrototypeContext'
import {
  SettingsGroup,
  SettingsRow,
  SettingsToggleRow,
} from '../../components/account/SettingsList'
import { SubPageLayout } from '../../components/account/SubPageLayout'

function getSecurityValue(
  id: string,
  user: ReturnType<typeof usePrototype>['user'],
): string | undefined {
  switch (id) {
    case 'google':
      return user.googleAuthBound ? '已绑定' : '未绑定'
    case 'email':
      return user.email ? maskEmail(user.email) : '未绑定'
    case 'login-password':
      return '修改'
    case 'payment-password':
      return user.paymentPasswordSet ? '已设置' : '未设置'
    case 'phone':
      return '未验证'
    case 'anti-phishing':
      return user.antiPhishingCode ? '已设置' : '未设置'
    default:
      return undefined
  }
}

export function SecuritySettingsPage() {
  const { user, navigateAccount, showToast } = usePrototype()
  const [gestureUnlock, setGestureUnlock] = useState(false)

  const basicItems = securityItems.filter((item) => item.group === 'basic')
  const advancedItems = securityItems.filter((item) => item.group === 'advanced')

  function handleBack() {
    navigateAccount({ screen: 'hub' })
  }

  function handleItemClick(item: (typeof securityItems)[number]) {
    if (item.id === 'phone') {
      showToast('手机验证一期仅展示入口', 'info')
      return
    }
    navigateAccount({ screen: item.screen })
  }

  return (
    <SubPageLayout title={accountCopy.securityTitle} onBack={handleBack}>
      <p className="mb-5 text-body-sm text-secondary">
        为保护您的资产安全，请妥善保管账号与密码。
      </p>

      <SettingsGroup>
        {basicItems.map((item) => (
          <SettingsRow
            key={item.id}
            label={item.label}
            value={getSecurityValue(item.id, user)}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </SettingsGroup>

      <SettingsGroup title={securityGroups.advanced}>
        {advancedItems.map((item) => (
          <SettingsRow
            key={item.id}
            label={item.label}
            value={getSecurityValue(item.id, user)}
            onClick={() => handleItemClick(item)}
          />
        ))}
        <SettingsToggleRow
          label="手势解锁"
          checked={gestureUnlock}
          onChange={setGestureUnlock}
        />
      </SettingsGroup>
    </SubPageLayout>
  )
}
