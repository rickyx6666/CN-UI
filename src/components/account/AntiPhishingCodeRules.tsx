import { Check } from 'lucide-react'
import {
  antiPhishingRules,
  validateAntiPhishingCode,
  type AntiPhishingRuleId,
} from '../../data/antiPhishing'

interface AntiPhishingCodeRulesProps {
  code: string
}

export function AntiPhishingCodeRules({ code }: AntiPhishingCodeRulesProps) {
  const validation = validateAntiPhishingCode(code)

  return (
    <ul className="space-y-2">
      {antiPhishingRules.map((rule) => {
        const met = validation[rule.id as AntiPhishingRuleId]

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
