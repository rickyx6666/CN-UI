import { AuthPageShell } from '../../components/auth/AuthPageShell'
import { MultiFactorSecurityVerifyForm } from '../../components/security/MultiFactorSecurityVerifyForm'
import { authCopy, getForgotPasswordUserProfile } from '../../data/auth'
import { getSecurityVerifyConfig } from '../../data/securityVerify'
import { usePrototype } from '../../context/PrototypeContext'

interface ForgotPasswordSecurityVerifyPageProps {
  account: string
  returnScreen?: 'entry' | 'login'
}

export function ForgotPasswordSecurityVerifyPage({
  account,
  returnScreen = 'login',
}: ForgotPasswordSecurityVerifyPageProps) {
  const { setAuthScreen } = usePrototype()
  const userProfile = getForgotPasswordUserProfile(account)

  return (
    <AuthPageShell
      title={authCopy.securityTitle}
      onBack={() =>
        setAuthScreen({
          screen: 'forgot-password',
          email: account,
          flow: 'reset',
          returnScreen,
        })
      }
    >
      <MultiFactorSecurityVerifyForm
        userOverride={userProfile}
        config={{
          ...getSecurityVerifyConfig('google-contact'),
          hint: '为保障账户安全，请完成身份验证器验证，并通过邮箱或手机完成二次验证。',
          submitLabel: '验证并继续',
        }}
        onSuccess={() =>
          setAuthScreen({
            screen: 'reset-password',
            email: account,
            flow: 'reset',
            returnScreen,
          })
        }
        onRequireGoogleSetup={() => {
          /* 找回密码场景下账户已绑定 Google，原型无需引导设置 */
        }}
      />
    </AuthPageShell>
  )
}
