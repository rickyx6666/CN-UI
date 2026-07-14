import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, ChevronRight, Copy, ShieldCheck, UserCircle2 } from 'lucide-react'
import { usePrototype } from '../../context/PrototypeContext'
import { coinBalances, formatBalance, formatUsd, portfolioSummary } from '../../data/mock'
import type { WalletCoin } from '../../data/wallet'
import { PcAppLayout } from '../../components/pc/PcAppLayout'
import { BalanceHero } from '../../components/BalanceHero'
import { CoinAvatar } from '../../components/CoinAvatar'
import {
  deleteAccountWarnings,
  maskEmail,
  securityGroups,
  securityItems,
} from '../../data/account'
import { getKycLabel, getKycValueClassName } from '../../data/mock'

const coinToWallet: Record<string, WalletCoin> = {
  USDT: 'USDT',
  BNB: 'BNB',
  TRX: 'TRX',
}

export function PcAssetsPage() {
  const {
    user,
    openAuth,
    openWallet,
    openFundHistory,
    openOrderHistory,
    navigateAccount,
    openSheet,
    logout,
    deleteAccount,
    figmaAccountOverlay,
  } = usePrototype()
  const autoOpened = useRef(false)
  const [confirmModal, setConfirmModal] = useState<
    null | 'logout' | 'delete' | 'security'
  >(figmaAccountOverlay ?? null)

  useEffect(() => {
    if (!user.isLoggedIn && !autoOpened.current) {
      autoOpened.current = true
      openAuth()
    }
  }, [user.isLoggedIn, openAuth])

  if (!user.isLoggedIn) {
    return (
      <PcAppLayout>
        <div className="flex h-full items-center justify-center p-6 text-secondary">
          请先登录查看资产
        </div>
      </PcAppLayout>
    )
  }

  return (
    <PcAppLayout>
      <div className="mx-auto w-full max-w-[1240px] space-y-6 px-6 py-6">
        <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-2xl border border-border-subtle bg-elevated p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-muted text-brand">
                  <UserCircle2 className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-body font-semibold text-primary">{user.nickname}</p>
                  <p className="mt-1 truncate text-caption text-secondary">
                    {maskEmail(user.email)}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-caption text-secondary">
                    UID {user.uid}
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-brand/20 bg-brand/10 px-4 py-3">
                <div className="flex items-center gap-2 text-body-sm font-medium text-primary">
                  <ShieldCheck className="h-4 w-4 text-brand" strokeWidth={1.75} />
                  账户等级 / 安全
                </div>
                <div className="mt-2 flex items-center justify-between text-caption">
                  <span className="text-secondary">身份认证</span>
                  <span className={getKycValueClassName(user.kycStatus)}>
                    {getKycLabel(user.kycStatus)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border-subtle bg-elevated p-3 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
              <SidebarLink label="订单" onClick={openOrderHistory} />
              <SidebarLink
                label="邀请好友"
                onClick={() => navigateAccount({ screen: 'invite' })}
              />
              <SidebarLink label="安全设置" onClick={() => setConfirmModal('security')} />
              <SidebarLink label="语言设置" onClick={() => openSheet('language')} />
              <SidebarLink label="法币计价" onClick={() => openSheet('fiat')} />
              <SidebarLink label="退出登录" onClick={() => setConfirmModal('logout')} />
              <SidebarLink
                label="注销账户"
                danger
                onClick={() => setConfirmModal('delete')}
              />
            </section>
          </aside>

          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-border-subtle bg-elevated shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
              <div className="border-b border-border-subtle bg-[linear-gradient(90deg,rgba(255,200,0,0.12),rgba(255,200,0,0.04))] px-5 py-5">
                <BalanceHero portfolio={portfolioSummary} user={user} />

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => openWallet('deposit')}
                    className="h-11 rounded-xl bg-brand px-6 text-body-sm font-semibold text-brand-dark hover:bg-brand-hover"
                  >
                    充币
                  </button>
                  <button
                    type="button"
                    onClick={() => openWallet('withdraw')}
                    className="h-11 rounded-xl border border-border px-6 text-body-sm font-medium text-primary hover:bg-sunken"
                  >
                    提币
                  </button>
                  <button
                    type="button"
                    onClick={openFundHistory}
                    className="h-11 rounded-xl border border-border px-6 text-body-sm font-medium text-primary hover:bg-sunken"
                  >
                    充提记录
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateAccount({ screen: 'invite' })}
                    className="h-11 rounded-xl border border-border px-6 text-body-sm font-medium text-primary hover:bg-sunken"
                  >
                    邀请好友
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border-subtle bg-elevated shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <div>
                <h2 className="text-h3 font-semibold text-primary">我的资产</h2>
                <p className="mt-1 text-caption text-secondary">
                  查看余额、估值与快捷充提操作
                </p>
              </div>
              <span className="rounded-full bg-sunken px-3 py-1 text-caption text-secondary">
                {coinBalances.length} 个币种
              </span>
            </div>

            <div className="overflow-hidden">
              <table className="w-full text-left text-body-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-caption text-secondary">
                    <th className="px-5 py-3 font-medium">资产</th>
                    <th className="px-5 py-3 font-medium text-right">余额</th>
                    <th className="px-5 py-3 font-medium text-right">估值 (USD)</th>
                    <th className="px-5 py-3 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {coinBalances.map((coin) => {
                    const walletCoin = coinToWallet[coin.symbol]
                    return (
                      <tr key={coin.id} className="hover:bg-sunken/50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <CoinAvatar symbol={coin.symbol} size={32} />
                            <div className="min-w-0">
                              <span className="font-medium text-primary">{coin.symbol}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right tabular-nums text-primary">
                          {formatBalance(coin.balance, coin.symbol)}
                        </td>
                        <td className="px-5 py-4 text-right tabular-nums text-secondary">
                          ${formatUsd(coin.usdValue)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {walletCoin && (
                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => openWallet('deposit', { coin: walletCoin })}
                                className="text-caption text-brand hover:underline"
                              >
                                充币
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  openWallet('withdraw', { coin: walletCoin })
                                }
                                className="text-caption text-secondary hover:underline"
                              >
                                提币
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            </section>
          </div>
        </div>
      </div>
      <AccountActionModal
        mode={confirmModal}
        onClose={() => setConfirmModal(null)}
        onConfirm={() => {
          if (confirmModal === 'logout') {
            logout()
          } else if (confirmModal === 'delete') {
            deleteAccount()
          }
          setConfirmModal(null)
        }}
        onOpenSecurityItem={(screen) => {
          setConfirmModal(null)
          navigateAccount({ screen })
        }}
        user={user}
      />
    </PcAppLayout>
  )
}

function SidebarLink({
  label,
  onClick,
  danger = false,
}: {
  label: string
  onClick?: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left ${
        danger
          ? 'text-danger hover:bg-sunken'
          : 'text-secondary hover:bg-sunken hover:text-primary'
      }`}
    >
      <span className="text-body-sm">{label}</span>
      <ChevronRight className="h-4 w-4 text-secondary" />
    </button>
  )
}

function AccountActionModal({
  mode,
  onClose,
  onConfirm,
  onOpenSecurityItem,
  user,
}: {
  mode: 'logout' | 'delete' | 'security' | null
  onClose: () => void
  onConfirm: () => void
  onOpenSecurityItem: (
    screen: (typeof securityItems)[number]['screen'],
  ) => void
  user: ReturnType<typeof usePrototype>['user']
}) {
  if (!mode) return null

  const isDelete = mode === 'delete'
  const isSecurity = mode === 'security'

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70" aria-hidden onClick={onClose} />
      <div
        role="alertdialog"
        aria-modal="true"
        className={`relative z-10 w-full rounded-2xl border border-border-subtle bg-elevated p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ${
          isSecurity ? 'max-w-5xl' : 'max-w-md'
        }`}
      >
        {isSecurity ? (
          <>
            <div className="mb-5 flex items-center justify-between border-b border-border-subtle pb-4">
              <h3 className="text-h3 font-semibold text-primary">安全设置</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-body-sm text-secondary hover:bg-sunken hover:text-primary"
              >
                关闭
              </button>
            </div>
            <p className="mb-5 text-body-sm text-secondary">
              为保护您的资产安全，请妥善保管账号与密码。
            </p>
            <div className="space-y-4">
              <SecuritySection
                title={securityGroups.basic}
                items={securityItems.filter((item) => item.group === 'basic')}
                user={user}
                onOpenSecurityItem={onOpenSecurityItem}
              />
              <SecuritySection
                title={securityGroups.advanced}
                items={securityItems.filter((item) => item.group === 'advanced')}
                user={user}
                onOpenSecurityItem={onOpenSecurityItem}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  isDelete ? 'bg-danger/10 text-danger' : 'bg-brand-muted text-brand'
                }`}
              >
                {isDelete ? (
                  <AlertTriangle className="h-5 w-5" strokeWidth={1.5} />
                ) : (
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
                )}
              </span>
              <div className="min-w-0">
                <h3 className="text-h3 font-semibold text-primary">
                  {isDelete ? '确认注销账户' : '确认退出登录'}
                </h3>
                <p className="mt-2 text-body-sm leading-relaxed text-secondary">
                  {isDelete
                    ? '注销账户是不可逆操作，执行后当前原型账户数据会被清空。'
                    : '退出后将返回未登录状态，需重新登录才能查看账户与资产。'}
                </p>
              </div>
            </div>

            {isDelete && (
              <ul className="mt-5 space-y-2">
                {deleteAccountWarnings.slice(0, 3).map((warning) => (
                  <li
                    key={warning}
                    className="rounded-xl border border-border-subtle bg-sunken px-4 py-3 text-body-sm text-secondary"
                  >
                    {warning}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onConfirm}
                className={`h-11 flex-1 rounded-xl text-body-sm font-semibold ${
                  isDelete
                    ? 'bg-danger text-white hover:opacity-90'
                    : 'bg-brand text-brand-dark hover:bg-brand-hover'
                }`}
              >
                {isDelete ? '确认注销' : '确认退出'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 flex-1 rounded-xl border border-border-subtle text-body-sm text-primary hover:bg-sunken"
              >
                取消
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SecuritySection({
  title,
  items,
  user,
  onOpenSecurityItem,
}: {
  title: string
  items: (typeof securityItems)[number][]
  user: ReturnType<typeof usePrototype>['user']
  onOpenSecurityItem: (
    screen: (typeof securityItems)[number]['screen'],
  ) => void
}) {
  return (
    <div>
      <p className="mb-2 text-caption font-semibold text-secondary">{title}</p>
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-sunken">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenSecurityItem(item.screen)}
            className="flex w-full items-center justify-between border-b border-border-subtle px-5 py-4 text-left last:border-b-0 hover:bg-base"
          >
            <p className="text-body-sm text-primary">{item.label}</p>
            <div className="flex items-center gap-2">
              <span className="text-body-sm text-secondary">
                {getSecurityValue(item.id, user)}
              </span>
              <ChevronRight className="h-4 w-4 text-secondary" strokeWidth={1.5} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function getSecurityValue(
  id: string,
  user: ReturnType<typeof usePrototype>['user'],
): string | undefined {
  switch (id) {
    case 'google':
      return user.googleAuthBound ? '已绑定' : '未绑定'
    case 'email':
      return maskEmail(user.email)
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
