import { avatarManifest, type AvatarSeries } from '../assets/images/anna_curated/anna-avatar-manifest'

export type ToneGroup = 'positive' | 'neutral_thoughtful' | 'reminder_caution'

export type StateNowTabId = 'balance' | 'scales' | 'kbju' | 'micro' | 'composition' | 'dynamics'

export interface AvatarResult {
  key: string
  src: string
  level: number
  toneGroup: ToneGroup
  description: string
}

export interface AvatarParams {
  toneGroup: ToneGroup
  intent?: string
  intensity?: number
}

const intentMap: Record<string, string> = {
  affirmation: 'affirmation',
  important_affirmation: 'important_affirmation',
  support: 'joy_and_support',
  user_success: 'joy_user_success',
  success: 'success',
  joy: 'joy',
  approval: 'cheerful_approval',
  satisfaction: 'satisfaction',
  thoughtful: 'thoughtful',
  explanation: 'explanation',
  clear_explanation: 'clear_explanation',
  nuance: 'understanding_nuances',
  subtlety: 'subtleties',
  question: 'questioning',
  curiosity: 'curiosity',
  surprise: 'curious_surprise',
  reminder: 'useful_reminder',
  important_reminder: 'important_reminder',
  cheerful_reminder: 'cheerful_reminder',
  caution: 'caution',
  warning: 'warning',
  important_warning: 'important_warning',
  clarification: 'important_clarification',
}

const toneFallback: Record<ToneGroup, string> = {
  positive: 'affirmation',
  neutral_thoughtful: 'thoughtful',
  reminder_caution: 'useful_reminder',
}

const GLOBAL_FALLBACK: AvatarResult = {
  key: 'thoughtful',
  src: '/src/assets/images/anna_curated/thoughtful/3.png',
  level: 3,
  toneGroup: 'neutral_thoughtful',
  description: 'Задумчивость (глобальный fallback)',
}

const tabAvatarMap: Record<StateNowTabId, { intent: string; level: number }> = {
  balance: { intent: 'explanation', level: 3 },
  scales: { intent: 'clear_explanation', level: 3 },
  kbju: { intent: 'explanation', level: 3 },
  micro: { intent: 'nuance', level: 3 },
  composition: { intent: 'subtlety', level: 3 },
  dynamics: { intent: 'thoughtful', level: 3 },
}

const generalAvatar: AvatarParams = {
  toneGroup: 'neutral_thoughtful',
  intent: 'reminder',
  intensity: 3,
}

function clampIntensity(raw: number | undefined): number {
  if (raw === undefined || raw === null) return 3
  const clamped = Math.round(raw)
  if (clamped < 1) return 1
  if (clamped > 6) return 6
  return clamped
}

export function resolveAvatar(params: AvatarParams): AvatarResult {
  const { toneGroup, intent, intensity } = params
  const level = clampIntensity(intensity)

  const seriesKey = intent ? intentMap[intent] ?? toneFallback[toneGroup] : toneFallback[toneGroup]

  const matched = avatarManifest.series[seriesKey]
  if (!matched) {
    const fallbackKey = toneFallback[toneGroup]
    const fallbackSeries = avatarManifest.series[fallbackKey]
    if (!fallbackSeries) return GLOBAL_FALLBACK
    return {
      key: fallbackKey,
      src: `/src/assets/images/anna_curated/${fallbackKey}/${level}.png`,
      level,
      toneGroup,
      description: fallbackSeries.description,
    }
  }

  return {
    key: matched.key,
    src: `/src/assets/images/anna_curated/${matched.key}/${level}.png`,
    level,
    toneGroup: matched.toneGroup as ToneGroup,
    description: matched.description,
  }
}

export function resolveAvatarForTab(tabId: StateNowTabId): AvatarResult {
  const mapping = tabAvatarMap[tabId]
  if (!mapping) return resolveAvatar(generalAvatar)
  return resolveAvatar({
    toneGroup: 'neutral_thoughtful',
    intent: mapping.intent,
    intensity: mapping.level,
  })
}

export function resolveGeneralAvatar(): AvatarResult {
  return resolveAvatar(generalAvatar)
}
