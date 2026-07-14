import { Check } from 'lucide-react'
import { antiPhishingRules, validateAntiPhishingCode } from '../../data/antiPhishing'

interface AntiPhishingRulesProps {
  code: string
}

export function AntiPhishingRules({ code }: AntiPhishingRulesProps) {
  const rules = validateAntiPhishingCode(code)

  return (
    <ul className="mb-6 space-y-2">
      {antiPhishingRules.map((rule) => {
        const met = rules[rule.id]
        return (
          <li
            key={rule.id}
            className={`flex items-start gap-2 text-body-sm ${
              met ? 'text-success' : 'text-secondary'
            }`}
          >
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                met ? 'text-success' : 'text-primary-muted'
              }`}
              strokeWidth={2}
            />
            <span>{rule.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
