/**
 * Défis Reconstruct Script.
 * Chaque défi contient des blocs de code à remettre dans le bon ordre.
 * correctOrder : tableau d'IDs dans l'ordre correct d'exécution.
 */
export const reconstructChallenges = [
  {
    id: 'backup',
    title: 'Script de sauvegarde',
    context: 'Ce script doit créer une sauvegarde datée du dossier web. Remets les blocs dans le bon ordre d\'exécution.',
    blocks: [
      { id: 'a', code: '#!/bin/bash' },
      { id: 'b', code: 'DATE=$(date +%Y-%m-%d)' },
      { id: 'c', code: 'mkdir -p "/backup/$DATE"' },
      { id: 'd', code: 'cp -r /var/www/html "/backup/$DATE"' },
      { id: 'e', code: 'echo "Sauvegarde terminée : /backup/$DATE"' },
    ],
    correctOrder: ['a', 'b', 'c', 'd', 'e'],
    explanation: '$DATE doit être défini avant d\'être utilisé dans les commandes suivantes. Le répertoire doit exister (mkdir) avant qu\'on puisse y copier des fichiers (cp).',
  },
  {
    id: 'deploy',
    title: 'Déploiement d\'une appli',
    context: 'Tu dois déployer une mise à jour sur le serveur. L\'ordre des étapes est critique pour éviter une coupure de service.',
    blocks: [
      { id: 'a', code: 'cd /var/www/myapp' },
      { id: 'b', code: 'git pull origin main' },
      { id: 'c', code: 'npm install --production' },
      { id: 'd', code: 'systemctl restart myapp' },
      { id: 'e', code: 'echo "Déploiement OK"' },
    ],
    correctOrder: ['a', 'b', 'c', 'd', 'e'],
    explanation: 'On récupère le code avant d\'installer les dépendances. Le service ne redémarre qu\'après que tout soit en place — sinon il redémarrerait avec une ancienne version ou des dépendances manquantes.',
  },
  {
    id: 'user_setup',
    title: 'Créer un utilisateur système',
    context: 'Ce script configure un nouvel utilisateur avec accès sudo. Chaque étape dépend de la précédente.',
    blocks: [
      { id: 'a', code: 'useradd -m -s /bin/bash devuser' },
      { id: 'b', code: 'echo "devuser:motdepasse" | chpasswd' },
      { id: 'c', code: 'usermod -aG sudo devuser' },
      { id: 'd', code: 'echo "Utilisateur devuser prêt"' },
    ],
    correctOrder: ['a', 'b', 'c', 'd'],
    explanation: 'L\'utilisateur doit exister (useradd) avant de pouvoir définir son mot de passe ou modifier ses groupes. chpasswd et usermod ne fonctionnent que sur un compte déjà créé.',
  },
  {
    id: 'log_archive',
    title: 'Archiver des logs',
    context: 'Ce script compresse les anciens logs dans une archive datée puis libère de l\'espace.',
    blocks: [
      { id: 'a', code: 'LOG_DIR="/var/log/myapp"' },
      { id: 'b', code: 'ARCHIVE="logs_$(date +%Y%m%d).tar.gz"' },
      { id: 'c', code: 'tar -czf "$ARCHIVE" "$LOG_DIR"' },
      { id: 'd', code: 'rm -rf "$LOG_DIR"/*.log' },
      { id: 'e', code: 'echo "Archive : $ARCHIVE"' },
    ],
    correctOrder: ['a', 'b', 'c', 'd', 'e'],
    explanation: 'Les variables doivent être déclarées avant d\'être utilisées. L\'archive est créée avant la suppression des fichiers originaux — sinon on perdrait les logs avant de les avoir sauvegardés.',
  },
  {
    id: 'ssl_renew',
    title: 'Renouvellement SSL',
    context: 'Ce script renouvelle un certificat SSL et recharge le serveur web. L\'ordre conditionne la sécurité du service.',
    blocks: [
      { id: 'a', code: 'certbot renew --quiet' },
      { id: 'b', code: 'cp /etc/letsencrypt/live/monsite/fullchain.pem /etc/nginx/ssl/' },
      { id: 'c', code: 'cp /etc/letsencrypt/live/monsite/privkey.pem /etc/nginx/ssl/' },
      { id: 'd', code: 'nginx -t' },
      { id: 'e', code: 'systemctl reload nginx' },
    ],
    correctOrder: ['a', 'b', 'c', 'd', 'e'],
    explanation: 'Le certificat est renouvelé en premier, puis copié. nginx -t vérifie la configuration avant le rechargement — si la config est invalide, on évite de couper le service en production.',
  },
]
