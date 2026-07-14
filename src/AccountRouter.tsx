import { usePrototype } from './context/PrototypeContext'
import { AccountSettingsPage } from './pages/account/AccountSettingsPage'
import { ChangeLoginPasswordPage } from './pages/account/ChangeLoginPasswordPage'
import { DeleteAccountPage } from './pages/account/DeleteAccountPage'
import { DeleteAccountSuccessPage } from './pages/account/DeleteAccountSuccessPage'
import { DeleteAccountVerifyPage } from './pages/account/DeleteAccountVerifyPage'
import { InviteFriendsPage } from './pages/account/InviteFriendsPage'
import { KycPage } from './pages/account/KycPage'
import { KycSumsubPage } from './pages/account/KycSumsubPage'
import { LogoutPage } from './pages/account/LogoutPage'
import { PaymentPasswordPage } from './pages/account/PaymentPasswordPage'
import { AccountSecurityVerifyPage } from './pages/account/AccountSecurityVerifyPage'
import { ProfilePage } from './pages/account/ProfilePage'
import { SecurityEmailPage } from './pages/account/SecurityEmailPage'
import { SecurityGoogleSetupPage } from './pages/account/SecurityGoogleSetupPage'
import { SecurityGooglePage } from './pages/account/SecurityGooglePage'
import { SecurityGoogleVerifyPage } from './pages/account/SecurityGoogleVerifyPage'
import { AntiPhishingFormPage } from './pages/account/AntiPhishingFormPage'
import { AntiPhishingPage } from './pages/account/AntiPhishingPage'
import { SecuritySettingsPage } from './pages/account/SecuritySettingsPage'
import { AboutPage } from './pages/account/AboutPage'
import { AboutLegalPage } from './pages/account/AboutLegalPage'

export function AccountRouter() {
  const { accountScreen } = usePrototype()

  if (!accountScreen) return null

  switch (accountScreen.screen) {
    case 'hub':
      return <AccountSettingsPage />
    case 'invite':
      return <InviteFriendsPage />
    case 'profile':
      return <ProfilePage />
    case 'security':
      return <SecuritySettingsPage />
    case 'security-google':
      return <SecurityGooglePage />
    case 'security-google-setup':
      return <SecurityGoogleSetupPage />
    case 'security-google-verify':
      return <SecurityGoogleVerifyPage />
    case 'security-email':
      return <SecurityEmailPage />
    case 'security-login-password':
      return <ChangeLoginPasswordPage />
    case 'security-payment-password':
      return <PaymentPasswordPage />
    case 'security-verify':
      return <AccountSecurityVerifyPage />
    case 'security-anti-phishing':
      return <AntiPhishingPage />
    case 'security-anti-phishing-form':
      return <AntiPhishingFormPage />
    case 'kyc':
      return <KycPage />
    case 'kyc-sumsub':
      return <KycSumsubPage />
    case 'logout':
      return <LogoutPage />
    case 'delete':
      return <DeleteAccountPage />
    case 'delete-verify':
      return <DeleteAccountVerifyPage />
    case 'delete-success':
      return <DeleteAccountSuccessPage />
    case 'about':
      return <AboutPage />
    case 'about-legal':
      return <AboutLegalPage />
    default:
      return null
  }
}
