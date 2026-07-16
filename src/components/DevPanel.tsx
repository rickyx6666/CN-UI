import type { ReactNode } from 'react'
import { usePrototype } from '../context/PrototypeContext'
import { antiPhishingDemoScenes } from '../data/antiPhishing'
import type { BottomTabId, KycStatus } from '../data/mock'
import {
  securityVerifyScenarioLabels,
  type SecurityVerifyScenario,
} from '../data/securityVerify'
import { defaultGoogleAuthBoundAt } from '../data/googleAuth'
import { getKycLabel } from '../data/mock'
import { previewPlatforms } from '../data/platform'
import { useInspect } from '../context/InspectContext'

const tabs: { id: BottomTabId; label: string }[] = [
  { id: 'market', label: '行情' },
  { id: 'trade', label: '交易' },
  { id: 'assets', label: '资产' },
]

const kycStatuses: KycStatus[] = ['unverified', 'pending', 'verified']

export function DevPanel() {
  const {
    isLoggedIn,
    setLoggedIn,
    user,
    updateProfile,
    activeTab,
    setActiveTab,
    previewPlatform,
    setPreviewPlatform,
    openLogin,
    openRegister,
    openAccount,
    openComplianceRestriction,
    openVersionUpdate,
    openAntiPhishingDemo,
    openKline,
    securityVerifyScenario,
    setSecurityVerifyScenario,
    navigateWallet,
    setWithdrawDraft,
  } = usePrototype()
  const { inspectMode, toggleInspectMode } = useInspect()

  function setKycStatus(status: KycStatus) {
    if (!isLoggedIn) setLoggedIn(true)
    updateProfile({ kycStatus: status })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-60 rounded-lg border border-border bg-elevated p-3 shadow-md">
      <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-brand">
        原型调试
      </p>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">预览端</p>
        <div className="flex gap-1">
          {previewPlatforms.map((platform) => (
            <ToggleBtn
              key={platform.id}
              active={previewPlatform === platform.id}
              onClick={() => setPreviewPlatform(platform.id)}
            >
              {platform.label}
            </ToggleBtn>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">切图批注</p>
        <ToggleBtn active={inspectMode} onClick={toggleInspectMode}>
          {inspectMode ? '批注开' : '批注关'}
        </ToggleBtn>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">快捷</p>
        <div className="flex flex-wrap gap-1">
          <ToggleBtn active={false} onClick={() => openKline()}>
            K 线页
          </ToggleBtn>
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">登录态</p>
        <div className="flex gap-1">
          <ToggleBtn active={!isLoggedIn} onClick={() => setLoggedIn(false)}>
            游客
          </ToggleBtn>
          <ToggleBtn active={isLoggedIn} onClick={() => setLoggedIn(true)}>
            已登录
          </ToggleBtn>
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">身份认证</p>
        <div className="grid grid-cols-3 gap-1">
          {kycStatuses.map((status) => (
            <ToggleBtn
              key={status}
              active={isLoggedIn && user.kycStatus === status}
              onClick={() => setKycStatus(status)}
            >
              {getKycLabel(status)}
            </ToggleBtn>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">支付密码</p>
        <div className="grid grid-cols-2 gap-1">
          <ToggleBtn
            active={isLoggedIn && !user.paymentPasswordSet}
            onClick={() => {
              if (!isLoggedIn) setLoggedIn(true)
              updateProfile({ paymentPasswordSet: false })
            }}
          >
            未设置
          </ToggleBtn>
          <ToggleBtn
            active={isLoggedIn && user.paymentPasswordSet}
            onClick={() => {
              if (!isLoggedIn) setLoggedIn(true)
              updateProfile({ paymentPasswordSet: true })
            }}
          >
            已设置
          </ToggleBtn>
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">Google 验证</p>
        <div className="grid grid-cols-2 gap-1">
          <ToggleBtn
            active={isLoggedIn && !user.googleAuthBound}
            onClick={() => {
              if (!isLoggedIn) setLoggedIn(true)
              updateProfile({ googleAuthBound: false, googleAuthBoundAt: null })
            }}
          >
            未绑定
          </ToggleBtn>
          <ToggleBtn
            active={isLoggedIn && user.googleAuthBound}
            onClick={() => {
              if (!isLoggedIn) setLoggedIn(true)
              updateProfile({
                googleAuthBound: true,
                googleAuthBoundAt: defaultGoogleAuthBoundAt,
              })
            }}
          >
            已绑定
          </ToggleBtn>
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">手机验证</p>
        <div className="grid grid-cols-2 gap-1">
          <ToggleBtn
            active={isLoggedIn && !user.phoneBound}
            onClick={() => {
              if (!isLoggedIn) setLoggedIn(true)
              updateProfile({ phoneBound: false })
            }}
          >
            未绑定
          </ToggleBtn>
          <ToggleBtn
            active={isLoggedIn && user.phoneBound}
            onClick={() => {
              if (!isLoggedIn) setLoggedIn(true)
              updateProfile({ phoneBound: true, phone: '13800138000' })
            }}
          >
            已绑定
          </ToggleBtn>
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">安全验证场景</p>
        <div className="grid grid-cols-2 gap-1">
          {(Object.keys(securityVerifyScenarioLabels) as SecurityVerifyScenario[]).map(
            (scenario) => (
              <ToggleBtn
                key={scenario}
                active={securityVerifyScenario === scenario}
                onClick={() => {
                  if (!isLoggedIn) setLoggedIn(true)
                  setSecurityVerifyScenario(scenario)
                  setWithdrawDraft({
                    coin: 'USDT',
                    chain: 'TRC20',
                    address: 'TXk3yP9n8vL2mR4qW6sH1jF5cD7bA9eG0x',
                    amount: 100,
                    fee: 1,
                    receive: 99,
                  })
                  navigateWallet({
                    screen: 'withdraw-security-verify',
                    coin: 'USDT',
                    chain: 'TRC20',
                  })
                }}
              >
                {securityVerifyScenarioLabels[scenario]}
              </ToggleBtn>
            ),
          )}
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">认证流</p>
        <div className="flex flex-wrap gap-1">
          <ToggleBtn active={false} onClick={openLogin}>
            登录页
          </ToggleBtn>
          <ToggleBtn active={false} onClick={openRegister}>
            注册页
          </ToggleBtn>
          <ToggleBtn active={false} onClick={openAccount}>
            账户设置
          </ToggleBtn>
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">合规</p>
        <ToggleBtn
          active={false}
          onClick={() => openComplianceRestriction({ module: 'trade' })}
        >
          地区限制弹窗
        </ToggleBtn>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">版本更新</p>
        <div className="flex flex-wrap gap-1">
          <ToggleBtn active={false} onClick={() => openVersionUpdate('force')}>
            强制更新
          </ToggleBtn>
          <ToggleBtn active={false} onClick={() => openVersionUpdate('soft')}>
            弱更新
          </ToggleBtn>
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1.5 text-caption text-secondary">防钓鱼码</p>
        <div className="grid grid-cols-3 gap-1">
          {antiPhishingDemoScenes.map((scene) => (
            <ToggleBtn
              key={scene.id}
              active={false}
              onClick={() => openAntiPhishingDemo(scene.id)}
            >
              {scene.label}
            </ToggleBtn>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-caption text-secondary">页面</p>
        <div className="grid grid-cols-2 gap-1">
          {tabs.map((tab) => (
            <ToggleBtn
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </ToggleBtn>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2 py-1.5 text-caption transition-colors duration-200 ${
        active
          ? 'bg-brand font-semibold text-brand-dark'
          : 'bg-sunken text-secondary active:opacity-70'
      }`}
    >
      {children}
    </button>
  )
}
