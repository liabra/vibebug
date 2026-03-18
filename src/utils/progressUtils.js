/**
 * Lit la sauvegarde d'un niveau depuis localStorage.
 * Retourne null si absent ou corrompu.
 */
export function getSaved(levelId) {
  try { return JSON.parse(localStorage.getItem(`vibebug_${levelId}`)) ?? null } catch { return null }
}

/**
 * Retourne le statut d'un niveau : 'locked' | 'new' | 'inProgress' | 'done'
 * - locked     : le niveau précédent n'est pas terminé
 * - new        : aucune donnée sauvegardée
 * - inProgress : en cours (index > 0 ou score existant)
 * - done       : completed === true
 */
export function getLevelStatus(levelId, index, allEntries) {
  if (index > 0) {
    const prevId = allEntries[index - 1][0]
    if (!getSaved(prevId)?.completed) return 'locked'
  }
  const saved = getSaved(levelId)
  if (!saved) return 'new'
  if (saved.completed) return 'done'
  return 'inProgress'
}

/**
 * Retourne le badge obtenu pour un niveau terminé, ou null.
 * Basé sur le pourcentage de bonnes réponses.
 */
export function getBadge(saved) {
  if (!saved?.completed || saved.score == null || !saved.total) return null
  const pct = Math.round((saved.score / saved.total) * 100)
  if (pct === 100) return { icon: '🏆', label: 'Expert Bash', color: '#854d0e', bg: '#fefce8', border: '#ca8a04' }
  if (pct >= 60)   return { icon: '👍', label: 'Bon niveau',  color: '#166534', bg: '#f0fdf4', border: '#16a34a' }
  return                  { icon: '💪', label: 'À améliorer', color: '#991b1b', bg: '#fef2f2', border: '#dc2626' }
}

/**
 * XP total cumulé sur tous les niveaux.
 */
export function getTotalXp(levelEntries) {
  return levelEntries.reduce((sum, [id]) => sum + (getSaved(id)?.xp ?? 0), 0)
}

/**
 * Nombre de niveaux avec completed === true.
 */
export function getCompletedCount(levelEntries) {
  return levelEntries.filter(([id]) => getSaved(id)?.completed === true).length
}

/**
 * Retourne le premier niveau "en cours" (non verrouillé, non terminé, avec progression).
 * Retourne null si aucun niveau n'est en cours.
 * Format : { id, title, saved }
 */
export function getInProgressLevel(levelEntries) {
  for (let i = 0; i < levelEntries.length; i++) {
    const [id, level] = levelEntries[i]
    if (i > 0 && !getSaved(levelEntries[i - 1][0])?.completed) continue
    const saved = getSaved(id)
    if (saved && !saved.completed) return { id, title: level.title, saved }
  }
  return null
}
