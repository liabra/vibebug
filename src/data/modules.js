/**
 * Types de défis disponibles.
 * Utilisé dans le champ `type` de chaque challenge.
 * Ajoutés progressivement — les challenges sans `type` sont traités comme 'find_error'.
 */
export const CHALLENGE_TYPES = {
  FIND_ERROR: 'find_error', // Identifier l'erreur ou le comportement incorrect
  EXPLAIN:    'explain',    // Expliquer ce que fait une commande / un script
  FIX:        'fix',        // Corriger une commande ou un script cassé
  AI_ERROR:   'ai_error',   // Repérer et corriger une erreur générée par IA
}

/**
 * Registre global des modules de la plateforme.
 *
 * Chaque module a :
 *   id          : identifiant unique (slug)
 *   title       : nom affiché
 *   track       : intitulé du parcours (Découverte / Pratique / Avancé)
 *   icon        : emoji
 *   desc        : description courte
 *   status      : 'active' | 'soon' | 'later'
 *   path        : route vers laquelle naviguer (null si non déployé)
 *   topics      : thèmes couverts (pour affichage futur)
 */
export const modules = [
  {
    id: 'linux-bash',
    title: 'Linux / Bash',
    track: 'Découverte',
    icon: '🐧',
    desc: 'Commandes, permissions, scripts, pipes — les fondations incontournables du développeur moderne.',
    status: 'active',
    path: '/levels',
    topics: [
      'Introduction Linux',
      'CLI & fichiers',
      'Dataflow & pipes',
      'Processus',
      'Réseau',
      'Scripting Bash',
      'Debug & erreurs IA',
    ],
  },
  {
    id: 'automatisation',
    title: 'Automatisation',
    track: 'Pratique',
    icon: '⚙️',
    desc: 'Scripts, cron, CI/CD — repère les bugs silencieux que l\'IA introduit dans les automatisations.',
    status: 'active',
    path: '/auto-levels',
    topics: ['Scripts Bash', 'Cron & tâches planifiées', 'CI/CD', 'Gestion d\'erreurs'],
  },
  {
    id: 'cloud-deploy',
    title: 'Cloud / Déploiement',
    track: 'Avancé',
    icon: '☁️',
    desc: 'Docker, Nginx, VPS — déploie en comprenant ce que tu fais, pas en espérant que ça marche.',
    status: 'later',
    path: null,
    topics: ['Docker', 'Nginx', 'VPS', 'Variables d\'environnement', 'Logs & monitoring'],
  },
]
