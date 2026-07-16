import { usePrototype } from '../../context/PrototypeContext'
import { securityVerifyScreen } from '../../data/account'
import { googleAuthCopy } from '../../data/googleAuth'
import { AuthButton } from '../../components/auth/AuthButton'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { GoogleAuthenticatorBoundPanel } from '../../components/account/GoogleAuthenticatorBoundPanel'

export function SecurityGooglePage() {
  const { user, navigateAccount } = usePrototype()

  function handleBack() {
    navigateAccount({ screen: 'security' })
  }

  if (user.googleAuthBound) {
    return (
      <SubPageLayout title={googleAuthCopy.boundPageTitle} onBack={handleBack}>
        <GoogleAuthenticatorBoundPanel
          boundAt={user.googleAuthBoundAt}
          onRemove={() => navigateAccount(securityVerifyScreen('google-unbind'))}
        />
      </SubPageLayout>
    )
  }

  return (
    <SubPageLayout title="Google 验证器" onBack={handleBack}>
      <div className="mb-6 rounded-2xl border border-brand/20 bg-[linear-gradient(135deg,rgba(255,204,0,0.16),rgba(255,204,0,0.04))] p-5">
        <p className="text-caption uppercase tracking-[0.2em] text-brand">
          Google Authenticator
        </p>
        <h2 className="mt-2 text-h2 font-semibold text-primary">Google 验证器未绑定</h2>
        <p className="mt-2 text-body-sm leading-relaxed text-secondary">
          绑定后可用于登录、提币和敏感操作二次验证，显著提升账户安全性。
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-border-subtle bg-elevated p-4">
        <p className="text-body-sm font-medium text-primary">绑定后可获得</p>
        <ul className="mt-3 space-y-2 text-body-sm text-secondary">
          <li>1. 登录与资产操作多一层动态码保护</li>
          <li>2. 未授权设备无法仅凭密码进入账户</li>
          <li>3. 多端统一安全设置体验</li>
        </ul>
      </div>

      <AuthButton
        type="button"
        onClick={() => navigateAccount({ screen: 'security-google-setup' })}
      >
        去绑定
      </AuthButton>
    </SubPageLayout>
  )
}
