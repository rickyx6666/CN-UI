import { SubPageLayout } from '../../components/account/SubPageLayout'
import { usePrototype } from '../../context/PrototypeContext'
import { getHelpArticle } from '../../data/support'

export function AboutLegalPage() {
  const { accountScreen, navigateAccount } = usePrototype()
  const article = getHelpArticle(accountScreen?.legalId ?? '')

  if (!article) return null

  return (
    <SubPageLayout
      title={article.title}
      onBack={() => navigateAccount({ screen: 'about' })}
    >
      <p className="mb-4 text-caption text-secondary">{article.description}</p>
      <div className="space-y-4">
        {article.sections.map((section, index) => (
          <section key={`${article.id}-${index}`}>
            {section.heading && (
              <h2 className="mb-1.5 text-body-sm font-semibold text-primary">
                {section.heading}
              </h2>
            )}
            <p className="text-body-sm leading-relaxed text-secondary">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </SubPageLayout>
  )
}
