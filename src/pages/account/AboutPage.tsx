import {
  SettingsGroup,
  SettingsRow,
} from '../../components/account/SettingsList'
import { AboutSocialLinks } from '../../components/account/AboutSocialLinks'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { aboutCopy, appInfo, socialContacts } from '../../data/appInfo'
import { accountCopy } from '../../data/account'
import { defaultVersionUpdateInfo } from '../../data/versionUpdate'
import { usePrototype } from '../../context/PrototypeContext'

export function AboutPage() {
  const { navigateAccount, openVersionUpdate } = usePrototype()

  function handleCheckUpdate() {
    openVersionUpdate('soft', {
      ...defaultVersionUpdateInfo,
      currentVersion: appInfo.version,
    })
  }

  return (
    <SubPageLayout
      title={accountCopy.aboutTitle}
      onBack={() => navigateAccount({ screen: 'hub' })}
      footer={
        <AboutSocialLinks
          contacts={socialContacts}
          title={aboutCopy.contactTitle}
        />
      }
    >
      <div className="mb-8 flex flex-col items-center py-6">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-muted text-[28px] font-bold text-brand">
          CN
        </span>
        <p className="mt-4 text-h3 font-semibold text-primary">{appInfo.name}</p>
        <p className="mt-1 font-mono text-body-sm text-secondary">
          v{appInfo.version}
        </p>
        <p className="mt-0.5 text-caption text-secondary">
          Build {appInfo.build}
        </p>
      </div>

      <SettingsGroup>
        <SettingsRow
          label={aboutCopy.userAgreement}
          onClick={() =>
            navigateAccount({ screen: 'about-legal', legalId: 'agreement' })
          }
        />
        <SettingsRow
          label={aboutCopy.privacyPolicy}
          onClick={() =>
            navigateAccount({ screen: 'about-legal', legalId: 'privacy' })
          }
        />
        <SettingsRow
          label={aboutCopy.checkUpdate}
          value={`v${appInfo.version}`}
          onClick={handleCheckUpdate}
        />
      </SettingsGroup>
    </SubPageLayout>
  )
}
