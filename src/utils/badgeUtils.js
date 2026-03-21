import { getSaved, getGlobalStats } from './progressUtils'
import { bashChallenges } from '../data/bashChallenges'

const levelEntries = Object.entries(bashChallenges)

function getSavedSpeed() {
  try { return JSON.parse(localStorage.getItem('vibebug_speed')) ?? null } catch { return null }
}

export const SPECIAL_BADGES = [
  {
    id: 'debug_express',
    icon: '⚡',
    label: 'Debug Express',
    desc: 'Score parfait en Speed Debug',
    color: '#854d0e', bg: '#fefce8', border: '#ca8a04',
  },
  {
    id: 'detecteur_illusions',
    icon: '🧠',
    label: "Détecteur d'illusions",
    desc: '5 pièges sur 5 en mode Piège IA',
    color: '#9f1239', bg: '#fff1f2', border: '#be123c',
  },
  {
    id: 'oeil_critique',
    icon: '🔍',
    label: 'Œil critique',
    desc: 'Mode Piège IA terminé avec ≥ 3/5',
    color: '#7c3aed', bg: '#f5f3ff', border: '#7c3aed',
  },
  {
    id: 'reparateur_scripts',
    icon: '🛠',
    label: 'Réparateur de scripts',
    desc: '2 niveaux terminés avec un score parfait',
    color: '#1d4ed8', bg: '#eff6ff', border: '#3b82f6',
  },
  {
    id: 'analyste_bash',
    icon: '📊',
    label: 'Analyste Bash',
    desc: 'Taux de réussite global ≥ 80 %',
    color: '#166534', bg: '#f0fdf4', border: '#16a34a',
  },
]

/**
 * Calcule les IDs des badges spécialisés actuellement débloqués.
 * Lit uniquement depuis localStorage — pas d'état externe.
 */
export function computeEarnedBadgeIds() {
  const earned = []

  // ⚡ Debug Express : score parfait en Speed Debug
  const speed = getSavedSpeed()
  if (speed?.perfect) earned.push('debug_express')

  // 🧠 Détecteur d'illusions + 🔍 Œil critique
  const ai = getSaved('ai')
  if (ai?.completed && ai.score != null && ai.total) {
    if (ai.score === ai.total) earned.push('detecteur_illusions')
    if (ai.score >= 3)        earned.push('oeil_critique')
  }

  // 🛠 Réparateur de scripts : 2+ niveaux bash avec score parfait
  const perfectLevels = levelEntries.filter(([id]) => {
    const s = getSaved(id)
    return s?.completed && s.score === s.total && s.total > 0
  }).length
  if (perfectLevels >= 2) earned.push('reparateur_scripts')

  // 📊 Analyste Bash : taux de réussite global ≥ 80 %
  const stats = getGlobalStats(levelEntries)
  if (stats.successRate !== null && stats.successRate >= 80) earned.push('analyste_bash')

  return earned
}

/**
 * Retourne les objets badge pour une liste d'IDs.
 */
export function badgesFromIds(ids) {
  return ids.map((id) => SPECIAL_BADGES.find((b) => b.id === id)).filter(Boolean)
}

/**
 * IDs des badges déjà enregistrés (connus de l'app).
 */
export function getStoredBadgeIds() {
  try { return JSON.parse(localStorage.getItem('vibebug_badges')) ?? [] } catch { return [] }
}

/**
 * Persiste la liste à jour des IDs obtenus.
 */
export function storeBadgeIds(ids) {
  localStorage.setItem('vibebug_badges', JSON.stringify(ids))
}
