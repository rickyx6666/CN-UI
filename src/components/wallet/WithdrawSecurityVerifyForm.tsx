import { MultiFactorSecurityVerifyForm } from '../security/MultiFactorSecurityVerifyForm'
import { getSecurityVerifyConfig } from '../../data/securityVerify'
import { usePrototype } from '../../context/PrototypeContext'

interface WithdrawSecurityVerifyFormProps {
  onSuccess: () => void
  onRequireGoogleSetup: () => void
}

export function WithdrawSecurityVerifyForm({
  onSuccess,
  onRequireGoogleSetup,
}: WithdrawSecurityVerifyFormProps) {
  const { securityVerifyScenario } = usePrototype()

  return (
    <MultiFactorSecurityVerifyForm
      config={getSecurityVerifyConfig(securityVerifyScenario)}
      onSuccess={onSuccess}
      onRequireGoogleSetup={onRequireGoogleSetup}
    />
  )
}
