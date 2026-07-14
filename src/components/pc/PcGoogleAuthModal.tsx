import { Copy, Plus, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { AccountScreenState } from '../../data/account'
import { securityVerifyScreen } from '../../data/account'
import { isValidOtp } from '../../data/auth'
import { usePrototype } from '../../context/PrototypeContext'
import { AuthButton } from '../auth/AuthButton'
import { OtpField } from '../auth/OtpField'
import { TextField } from '../auth/TextField'
import { FigmaQrPlaceholder } from '../figma/FigmaQrPlaceholder'
import { PcModalShell } from './PcModalShell'
import type { PcGoogleAuthScreen } from './pcAccountModalScreens'

const GOOGLE_SECRET = '5XUXUOOCYOSWT3BV'

interface PcGoogleAuthModalProps {
  screen: PcGoogleAuthScreen
  onClose: () => void
  onNavigate: (screen: AccountScreenState) => void
}

export function PcGoogleAuthModal({ screen, onClose, onNavigate }: PcGoogleAuthModalProps) {
  const { user, updateProfile, figmaExport, antiPhishingDraft, paymentPasswordDraft } =
    usePrototype()

  if (screen === 'security-google-setup') {
    return (
      <PcModalShell
        title={accountCopy.googleSetupTitle}
        onClose={() => onNavigate({ screen: 'security-google' })}
        maxWidth="max-w-xl"
      >
        <GoogleSetupContent
          onNext={() => onNavigate({ screen: 'security-google-verify' })}
          figmaExport={figmaExport}
        />
      </PcModalShell>
    )
  }

  if (screen === 'security-google-verify') {
    return (
      <PcVerifyModal
        onClose={() => onNavigate({ screen: 'security-google-setup' })}
        onSuccess={() => {
          updateProfile({ googleAuthBound: true })
          if (antiPhishingDraft) {
            onNavigate(securityVerifyScreen('anti-phishing'))
            return
          }
          if (paymentPasswordDraft) {
            onNavigate(securityVerifyScreen('payment-password'))
            return
          }
          onClose()
        }}
      />
    )
  }

  if (user.googleAuthBound) {
    return <PcUnbindModal onClose={onClose} />
  }

  return (
    <PcModalShell title="Google 身份验证" onClose={onClose} maxWidth="max-w-lg">
      <div className="rounded-xl border border-brand/20 bg-[linear-gradient(135deg,rgba(255,204,0,0.14),rgba(255,204,0,0.04))] px-4 py-3">
        <p className="text-body-sm leading-relaxed text-primary">
          Google 身份验证器是一种动态密码工具，可进一步提升您账户的安全性，绑定后可用于提币、修改密码等敏感操作验证。
        </p>
      </div>

      <ol className="mt-5 space-y-3 text-body-sm text-secondary">
        <li>1. 下载并安装 Google 身份验证器应用</li>
        <li>2. 扫描二维码或输入密钥</li>
        <li>3. 输入 Google 验证码</li>
      </ol>

      <div className="mt-6">
        <AuthButton
          type="button"
          onClick={() => onNavigate({ screen: 'security-google-setup' })}
        >
          立即绑定
        </AuthButton>
      </div>
    </PcModalShell>
  )
}

function PcUnbindModal({ onClose }: { onClose: () => void }) {
  const { updateProfile } = usePrototype()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidOtp(otp)) {
      setError('请输入 6 位 Google 验证码')
      return
    }
    setError(undefined)
    setLoading(true)
    window.setTimeout(() => {
      updateProfile({ googleAuthBound: false })
      setLoading(false)
      onClose()
    }, 400)
  }

  return (
    <PcModalShell title="Google 验证器" onClose={onClose} maxWidth="max-w-md">
      <p className="mb-4 text-body-sm text-secondary">
        已绑定 Google 验证器。解绑后，提币等敏感操作将不再需要 Google 验证码。
      </p>
      <form onSubmit={handleSubmit}>
        <OtpField label="Google 验证码" value={otp} onChange={setOtp} error={error} />
        <AuthButton type="submit" loading={loading}>
          确认解绑
        </AuthButton>
      </form>
    </PcModalShell>
  )
}

function PcVerifyModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [emailCode, setEmailCode] = useState('')
  const [googleCode, setGoogleCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ emailCode?: string; googleCode?: string }>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isValidOtp(emailCode)) next.emailCode = '请输入 6 位邮箱验证码'
    if (!isValidOtp(googleCode)) next.googleCode = '请输入 6 位谷歌验证码'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 400)
  }

  return (
    <PcModalShell
      title={accountCopy.googleVerifyTitle}
      onClose={onClose}
      maxWidth="max-w-md"
      hideHeader
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 className="text-h3 font-semibold text-primary">{accountCopy.googleVerifyTitle}</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sunken text-secondary hover:text-primary"
          aria-label="关闭"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <TextField
          label="邮箱验证码"
          value={emailCode}
          onChange={(value) => setEmailCode(value.replace(/\D/g, '').slice(0, 6))}
          placeholder="请输入验证码"
          error={errors.emailCode}
          autoComplete="one-time-code"
          suffix={
            <button type="button" className="text-body-sm font-medium text-primary">
              获取验证码
            </button>
          }
        />
        <TextField
          label="Google 验证码"
          value={googleCode}
          onChange={(value) => setGoogleCode(value.replace(/\D/g, '').slice(0, 6))}
          placeholder="请输入 Google 验证码"
          error={errors.googleCode}
          autoComplete="one-time-code"
        />
        <AuthButton type="submit" loading={loading}>
          确认
        </AuthButton>
      </form>
    </PcModalShell>
  )
}

function GoogleSetupContent({
  onNext,
  figmaExport,
}: {
  onNext: () => void
  figmaExport: boolean
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(GOOGLE_SECRET)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <div className="relative max-h-[52vh] space-y-5 overflow-y-auto pl-8 pr-1">
        <div className="absolute bottom-4 left-[11px] top-2 w-px bg-border-subtle" />

        <GoogleStep number={1}>
          <p className="text-body-sm leading-relaxed text-primary">
            打开 Google 身份验证器，扫描下方二维码
          </p>
          <div className="mt-3 flex flex-wrap items-start gap-4">
            <div className="rounded-2xl bg-white p-2.5">
              <FigmaQrPlaceholder size={96} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-sunken px-3 py-2.5">
                <span className="min-w-0 flex-1 truncate text-body-sm tracking-[0.08em] text-primary">
                  {GOOGLE_SECRET}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-secondary hover:bg-elevated"
                  aria-label="复制密钥"
                >
                  <Copy className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
              {copied && <p className="mt-1.5 text-caption text-brand">已复制密钥</p>}
            </div>
          </div>
        </GoogleStep>

        <GoogleStep number={2}>
          <p className="text-body-sm leading-relaxed text-primary">
            请务必备份您的 16 位密钥，以便在手机丢失时找回 Google 身份验证器
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border-subtle bg-sunken px-3 py-2.5">
            <span className="min-w-0 flex-1 truncate text-body-sm tracking-[0.08em] text-primary">
              {GOOGLE_SECRET}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-8 w-8 items-center justify-center rounded-md text-secondary hover:bg-elevated"
              aria-label="复制密钥"
            >
              <Copy className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </GoogleStep>

        <GoogleStep number={3}>
          <p className="text-body-sm leading-relaxed text-primary">
            输入 Google 身份验证器中的 6 位验证码
          </p>
          <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-[20px] border-2 border-dashed border-border bg-sunken">
            <Plus className="h-7 w-7 text-brand" strokeWidth={1.75} />
          </div>
        </GoogleStep>
      </div>

      <p className="mt-4 text-caption text-secondary">请确保您已完成步骤 2，再进行下一步</p>

      <div className="mt-4">
        <AuthButton type="button" onClick={onNext}>
          下一步
        </AuthButton>
      </div>

      {figmaExport && (
        <p className="mt-3 text-center text-caption text-primary-muted">
          Figma 导出：二维码为静态示意
        </p>
      )}
    </>
  )
}

function GoogleStep({
  number,
  children,
}: {
  number: number
  children: ReactNode
}) {
  return (
    <section className="relative">
      <span className="absolute -left-8 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-brand-dark">
        {number}
      </span>
      {children}
    </section>
  )
}
