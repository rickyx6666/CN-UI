import { accountCopy, maskEmail } from '../../data/account'
import { getKycLabel, getKycValueClassName } from '../../data/mock'
import { fiatCurrencies, locales } from '../../data/settings'
import { usePrototype } from '../../context/PrototypeContext'
import {
  SettingsGroup,
  SettingsRow,
  UserAvatar,
} from '../../components/account/SettingsList'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { CopyButton } from '../../components/common/CopyButton'

export function AccountSettingsPage() {
  const {
    user,
    closeAccount,
    navigateAccount,
    locale,
    fiat,
    openSheet,
    openSupportCenter,
    previewPlatform,
  } = usePrototype()

  const localeLabel =
    locales.find((item) => item.id === locale)?.label ?? locale
  const fiatLabel =
    fiatCurrencies.find((item) => item.id === fiat)?.label ?? fiat

  return (
    <SubPageLayout title={accountCopy.hubTitle} onBack={closeAccount}>
      {previewPlatform === 'pc' ? (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <section className="rounded-2xl border border-border-subtle bg-sunken p-6">
            <div className="flex items-center gap-4">
              <UserAvatar nickname={user.nickname} size={72} />
              <div className="min-w-0">
                <p className="truncate text-h2 font-semibold text-primary">
                  {user.nickname}
                </p>
                <p className="mt-1 truncate text-body-sm text-secondary">
                  {maskEmail(user.email)}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-caption text-secondary">UID {user.uid}</span>
                  <CopyButton value={user.uid} label="复制 UID" iconOnly />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <InfoTile label="身份认证" value={getKycLabel(user.kycStatus)} valueClassName={getKycValueClassName(user.kycStatus)} />
              <InfoTile label="语言" value={localeLabel} />
              <InfoTile label="计价货币" value={fiatLabel} />
            </div>
          </section>

          <div>
            <SettingsGroup title="账户">
              <SettingsRow
                label="邀请好友"
                hint="分享邀请码与邀请链接，获得返佣奖励"
                onClick={() => navigateAccount({ screen: 'invite' })}
              />
              <SettingsRow
                label="个人资料"
                hint="昵称、邮箱与基础账户信息"
                onClick={() => navigateAccount({ screen: 'profile' })}
              />
              <SettingsRow
                label="身份认证"
                value={getKycLabel(user.kycStatus)}
                valueClassName={getKycValueClassName(user.kycStatus)}
                onClick={() => navigateAccount({ screen: 'kyc' })}
              />
            </SettingsGroup>

            <SettingsGroup title="安全">
              <SettingsRow
                label="安全设置"
                hint="Google 验证、密码与支付密码"
                onClick={() => navigateAccount({ screen: 'security' })}
              />
            </SettingsGroup>

            <SettingsGroup title="偏好">
              <SettingsRow
                label="语言"
                value={localeLabel}
                onClick={() => openSheet('language')}
              />
              <SettingsRow
                label="计价币种"
                value={fiatLabel}
                onClick={() => openSheet('fiat')}
              />
              <SettingsRow
                label="在线客服"
                hint="7 x 24 小时专属支持"
                onClick={openSupportCenter}
              />
            </SettingsGroup>

            <SettingsGroup>
              <SettingsRow
                label="退出登录"
                showChevron={false}
                onClick={() => navigateAccount({ screen: 'logout' })}
              />
              <SettingsRow
                label="注销账户"
                danger
                showChevron
                onClick={() => navigateAccount({ screen: 'delete' })}
              />
            </SettingsGroup>

            <SettingsGroup>
              <SettingsRow
                label="关于"
                onClick={() => navigateAccount({ screen: 'about' })}
              />
            </SettingsGroup>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center gap-4 py-2">
            <UserAvatar nickname={user.nickname} />
            <div className="min-w-0">
              <p className="truncate text-h3 font-semibold text-primary">
                {user.nickname}
              </p>
              <p className="truncate text-body-sm text-secondary">
                {maskEmail(user.email)}
              </p>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="text-caption text-secondary">UID {user.uid}</span>
                <CopyButton value={user.uid} label="复制 UID" iconOnly />
              </div>
            </div>
          </div>

          <SettingsGroup title="账户">
            <SettingsRow
              label="邀请好友"
              hint="分享邀请码与邀请链接，获得返佣奖励"
              onClick={() => navigateAccount({ screen: 'invite' })}
            />
            <SettingsRow
              label="个人资料"
              onClick={() => navigateAccount({ screen: 'profile' })}
            />
            <SettingsRow
              label="身份认证"
              value={getKycLabel(user.kycStatus)}
              valueClassName={getKycValueClassName(user.kycStatus)}
              onClick={() => navigateAccount({ screen: 'kyc' })}
            />
          </SettingsGroup>

          <SettingsGroup title="安全">
            <SettingsRow
              label="安全设置"
              hint="Google 验证、密码与支付密码"
              onClick={() => navigateAccount({ screen: 'security' })}
            />
          </SettingsGroup>

          <SettingsGroup title="偏好">
            <SettingsRow
              label="语言"
              value={localeLabel}
              onClick={() => openSheet('language')}
            />
            <SettingsRow
              label="计价币种"
              value={fiatLabel}
              onClick={() => openSheet('fiat')}
            />
            <SettingsRow
              label="在线客服"
              onClick={openSupportCenter}
            />
          </SettingsGroup>

          <SettingsGroup>
            <SettingsRow
              label="退出登录"
              showChevron={false}
              onClick={() => navigateAccount({ screen: 'logout' })}
            />
            <SettingsRow
              label="注销账户"
              danger
              showChevron
              onClick={() => navigateAccount({ screen: 'delete' })}
            />
          </SettingsGroup>

          <SettingsGroup>
            <SettingsRow
              label="关于"
              onClick={() => navigateAccount({ screen: 'about' })}
            />
          </SettingsGroup>
        </>
      )}
    </SubPageLayout>
  )
}

function InfoTile({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-elevated px-4 py-3">
      <p className="text-caption text-secondary">{label}</p>
      <p className={`mt-1 text-body-sm font-medium ${valueClassName ?? 'text-primary'}`}>
        {value}
      </p>
    </div>
  )
}
