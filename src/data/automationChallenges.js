export const automationChallenges = {
  auto_1: {
    title: 'Scripts de base',
    challenges: [
      {
        id: 1,
        type: 'explain',
        title: 'Le shebang',
        prompt: 'À quoi sert la première ligne de ce script ?',
        code: '#!/bin/bash\necho "Déploiement en cours..."',
        options: [
          "Indique que le fichier est un commentaire bash",
          "Spécifie l'interpréteur à utiliser pour exécuter le script",
          "Active le mode débogage de bash",
          "Désactive l'affichage des messages d'erreur",
        ],
        correctAnswer: 1,
        explanation:
          "`#!` (shebang) suivi du chemin d'un interpréteur indique à l'OS comment exécuter le fichier. Sans cette ligne, le shell utilise son propre interpréteur par défaut — comportement non garanti.",
      },
      {
        id: 2,
        type: 'explain',
        title: 'Code de retour',
        prompt: "Que contient `$?` après l'exécution de `cp` ?",
        code: '#!/bin/bash\ncp config.json /etc/app/config.json\necho "Code retour : $?"',
        options: [
          'Le nom du fichier copié',
          "Le code de retour de la dernière commande (0 = succès, autre valeur = erreur)",
          "La durée d'exécution de la commande en secondes",
          "Le nombre d'octets copiés",
        ],
        correctAnswer: 1,
        explanation:
          "`$?` contient le code de sortie de la dernière commande. `0` = succès. Toute autre valeur signale une erreur. C'est le mécanisme de base pour vérifier si une étape a réussi dans un script.",
      },
      {
        id: 3,
        type: 'find_error',
        title: 'Variable non quotée',
        prompt:
          "Ce script doit compter les lignes d'un fichier passé en argument. Quel problème surgit si le chemin contient des espaces ?",
        code: '#!/bin/bash\nFILE=$1\nif [ -e $FILE ]; then\n  wc -l $FILE\nfi',
        options: [
          '`wc -l` ne fonctionne pas avec une variable',
          '`$FILE` non quoté est découpé sur les espaces — `[ -e mon rapport.csv ]` provoque une erreur de syntaxe',
          "`if` ne supporte pas l'option `-e` avec une variable",
          'La variable `$1` ne peut pas être assignée à `FILE`',
        ],
        correctAnswer: 1,
        explanation:
          "Sans guillemets, `$FILE` subit le word splitting : un chemin `mon rapport.csv` devient deux arguments distincts. Toujours écrire `\"$FILE\"` dans les tests et les commandes.",
      },
      {
        id: 4,
        type: 'fix',
        title: 'Backup sans garde-fou',
        prompt:
          "Ce script crée un dossier de backup puis copie les données. Si `mkdir` échoue (droits insuffisants, dossier existant), que se passe-t-il ?",
        code: '#!/bin/bash\nBACKUP_DIR="/backups/$(date +%Y%m%d)"\nmkdir $BACKUP_DIR\ncp -r /var/app/data/* $BACKUP_DIR\necho "Sauvegarde dans $BACKUP_DIR"',
        options: [
          "Le script s'arrête automatiquement si `mkdir` échoue",
          "`cp` est ignoré si le dossier de destination est absent",
          "`cp` s'exécute quand même — les données sont perdues ou copiées au mauvais endroit sans avertissement",
          "bash affiche une erreur et attend une confirmation",
        ],
        correctAnswer: 2,
        explanation:
          "bash ne s'arrête pas sur les erreurs par défaut. Si `mkdir` échoue, `cp` tente de s'exécuter quand même. Fix : ajouter `|| exit 1` après `mkdir`, ou `set -e` en début de script.",
      },
      {
        id: 5,
        type: 'explain',
        title: 'Arguments du script',
        prompt: "On lance `./deploy.sh prod v2.1`. Que contient `$#` ?",
        code: '#!/bin/bash\necho "Script : $0"\necho "1er arg : $1"\necho "Tous les args : $@"\necho "Nombre d\'args : $#"',
        options: [
          "Le nom du script (`./deploy.sh`)",
          "La liste de tous les arguments (`prod v2.1`)",
          "Le nombre d'arguments passés au script (`2` ici)",
          "Le code de retour de la dernière commande",
        ],
        correctAnswer: 2,
        explanation:
          "`$0` = nom du script, `$1`…`$n` = arguments individuels, `$@` = tous les arguments, `$#` = nombre d'arguments. Ces variables spéciales rendent un script flexible et paramétrable.",
      },
    ],
  },

  auto_2: {
    title: 'Automatisation avancée',
    challenges: [
      {
        id: 1,
        type: 'ai_error',
        title: 'Déploiement fragile',
        prompt:
          "L'IA génère ce script de déploiement automatique. Si `npm install` échoue (réseau coupé, dépendance manquante), que se passe-t-il ?",
        code: '#!/bin/bash\ngit pull origin main\nnpm install\nnpm run build\nsystemctl restart app\necho "✓ Déploiement terminé"',
        options: [
          "Le script s'arrête dès qu'une commande échoue",
          'Les étapes suivantes s\'exécutent quand même — le service est redémarré sur un build cassé et le script affiche "✓ Déploiement terminé"',
          "bash signale l'erreur et annule les commandes précédentes",
          "systemctl détecte l'incohérence et refuse le redémarrage",
        ],
        correctAnswer: 1,
        explanation:
          "bash n'arrête pas l'exécution sur les erreurs par défaut. L'IA génère ce pattern sans penser aux cas d'échec. Fix : ajouter `set -e` en début de script — toute commande qui échoue interrompt immédiatement l'exécution.",
      },
      {
        id: 2,
        type: 'fix',
        title: 'Cron silencieux',
        prompt:
          "L'IA génère cette entrée cron pour un backup automatique. Elle ne s'exécute jamais. Quel est le problème ?",
        code: '*/10 * * * * backup.sh >> /var/log/backup.log 2>&1',
        options: [
          "La syntaxe `*/10` est invalide dans crontab",
          "`cron` utilise un `PATH` minimal — `backup.sh` sans chemin absolu ne sera jamais trouvé",
          "La redirection `2>&1` n'est pas supportée dans cron",
          "Il faut relancer le service `cron` après chaque modification de crontab",
        ],
        correctAnswer: 1,
        explanation:
          "`cron` s'exécute avec un PATH réduit (`/usr/bin:/bin`). Un script référencé sans chemin absolu est introuvable. Fix : `/home/user/scripts/backup.sh` ou ajouter `PATH=/usr/local/bin:...` en haut du crontab.",
      },
      {
        id: 3,
        type: 'find_error',
        title: 'Top des erreurs',
        prompt:
          "Ce pipeline est censé afficher les 10 erreurs les plus fréquentes d'un log. Quel est le problème logique ?",
        code: 'cat errors.log | sort | head -10 | uniq -c | sort -rn',
        options: [
          '`sort` et `uniq -c` ne peuvent pas être combinés dans un même pipe',
          '`head -10` est appliqué avant le comptage — on ne compte les doublons que parmi les 10 premières lignes, pas sur l\'ensemble du fichier',
          "`cat` introduit une erreur quand le pipe dépasse trois étapes",
          '`sort -rn` doit toujours précéder `uniq -c`',
        ],
        correctAnswer: 1,
        explanation:
          "L'ordre correct : `sort | uniq -c | sort -rn | head -10`. Il faut d'abord trier, compter les doublons sur TOUT le fichier, trier par fréquence décroissante, puis garder les 10 premiers. `head` va toujours en dernier.",
      },
      {
        id: 4,
        type: 'ai_error',
        title: 'Heredoc et variables',
        prompt:
          "L'IA génère ce script pour créer un fichier de config. Dans le fichier produit, `$DB_PASS` apparaît littéralement au lieu de sa valeur. Pourquoi ?",
        code: "#!/bin/bash\nDB_PASS=\"secret123\"\ncat << 'EOF' > db_config.sh\nexport DB_PASSWORD=$DB_PASS\nEOF",
        options: [
          "`DB_PASS` n'est pas exportée dans l'environnement",
          "Les guillemets simples autour de `'EOF'` désactivent l'expansion des variables dans le heredoc",
          "`cat` ne peut pas écrire dans un fichier avec `>`",
          "Il faut utiliser `echo` à la place de `cat` pour inclure des variables",
        ],
        correctAnswer: 1,
        explanation:
          "Un heredoc avec délimiteur quoté (`'EOF'`) traite tout le contenu comme une chaîne littérale — aucune variable n'est évaluée. Pour que les variables s'expandent, le délimiteur doit être non quoté : `cat << EOF`.",
      },
      {
        id: 5,
        type: 'fix',
        title: 'Variable vide, rm fragile',
        prompt:
          "Ce script nettoie un répertoire de cache. Si `TEMP_DIR` n'est pas définie, que se passe-t-il ?",
        code: '#!/bin/bash\nrm -f $TEMP_DIR/cache_*\necho "Cache nettoyé"',
        options: [
          "bash affiche une erreur et n'exécute pas `rm`",
          '`rm -f` est annulé automatiquement si le chemin est vide',
          '`$TEMP_DIR` vide donne `rm -f /cache_*` — la commande tente de supprimer des fichiers à la racine du système',
          "Le glob `cache_*` protège contre les variables non définies",
        ],
        correctAnswer: 2,
        explanation:
          "Une variable non définie est simplement supprimée dans la commande. `rm -f $TEMP_DIR/cache_*` devient `rm -f /cache_*`. Fix : `${TEMP_DIR:?\"TEMP_DIR non défini\"}` lève une erreur explicite si la variable est absente.",
      },
      {
        id: 6,
        type: 'ai_error',
        title: 'Comparaison numérique piégée',
        prompt:
          "Ce script doit alerter quand un log dépasse 10 erreurs. Il alerte en permanence, même avec une seule erreur. Pourquoi ?",
        code: '#!/bin/bash\nERRORS=$(grep -c "ERROR" /var/log/app.log)\nif [ "$ERRORS" > "10" ]; then\n  echo "Alerte : $ERRORS erreurs détectées"\nfi',
        options: [
          '`grep -c` retourne toujours une valeur supérieure à 10',
          'Dans `[ ]`, `>` est une comparaison lexicographique — `"9" > "10"` est vrai car `"9"` > `"1"` en ordre alphabétique',
          'Les guillemets autour de `"$ERRORS"` forcent une comparaison de chaîne',
          "La syntaxe `$()` ne fonctionne pas dans une condition `if`",
        ],
        correctAnswer: 1,
        explanation:
          "Dans `[ ]`, `>` compare des chaînes. `\"9\" > \"10\"` est vrai alphabétiquement (`9` > `1`). Pour une comparaison numérique, utiliser `-gt` : `[ \"$ERRORS\" -gt 10 ]`. L'IA génère souvent `>` par analogie avec d'autres langages.",
      },
      {
        id: 7,
        type: 'explain',
        title: 'Compteur dans un sous-shell',
        prompt: "Ce script doit compter les lignes d'un fichier. Il affiche toujours `Lignes : 0`. Pourquoi ?",
        code: '#!/bin/bash\nCOUNTER=0\ncat fichier.txt | while read line; do\n  COUNTER=$((COUNTER + 1))\ndone\necho "Lignes : $COUNTER"',
        options: [
          '`$((COUNTER + 1))` est une syntaxe invalide en bash',
          "Le pipe crée un sous-shell pour exécuter `while read` — les modifications de `COUNTER` dans ce sous-shell ne remontent pas au shell parent",
          '`while read` ne peut pas être utilisé avec un pipe',
          "`cat` réinitialise la valeur de `COUNTER` avant la boucle",
        ],
        correctAnswer: 1,
        explanation:
          "Chaque élément d'un pipe s'exécute dans un sous-shell. Les changements de variables restent locaux. Fix : `while read line; do ... done < fichier.txt` (redirection directe, pas de sous-shell) ou simplement `COUNTER=$(wc -l < fichier.txt)`.",
      },
    ],
  },

  auto_3: {
    title: 'Scénarios réels',
    challenges: [
      // ── Scénario A : Site hors-ligne ──────────────────────────────────────
      {
        id: 1,
        type: 'fix',
        scenarioId: 'service-down',
        scenarioTitle: 'Site hors-ligne — 23h',
        scenarioContext:
          "Il est 23h. Une alerte arrive : ton site e-commerce est injoignable. Tu te connectes en SSH au serveur de production. nginx et l'app Node.js tournent normalement d'habitude.",
        title: 'Étape 1 — Premier diagnostic',
        prompt: 'Quelle est ta première action ?',
        options: [
          '`reboot` — relancer le serveur règle la plupart des problèmes',
          '`systemctl status nginx` — vérifier l\'état du serveur web sans rien modifier',
          '`ping google.com` — vérifier la connectivité réseau',
          '`rm -rf /var/log/nginx/*.log` — vider les logs pour voir les nouvelles erreurs',
        ],
        correctAnswer: 1,
        explanation:
          "La première étape du diagnostic est de vérifier l'état du service sans rien modifier. `systemctl status` donne l'état, les erreurs récentes et le PID. Rebooter en premier est une mauvaise pratique : ça efface les preuves et peut aggraver la situation.",
      },
      {
        id: 2,
        type: 'find_error',
        scenarioId: 'service-down',
        scenarioTitle: 'Site hors-ligne — 23h',
        scenarioContext:
          "nginx est actif (`active (running)`), mais le site répond 502 Bad Gateway. Tu consultes les logs d'erreur nginx.",
        title: 'Étape 2 — Interpréter le log',
        prompt: 'Que signifie cette ligne de log ?',
        code: '[error] connect() failed (111: Connection refused) while\nconnecting to upstream: "http://127.0.0.1:3000"',
        options: [
          'Le port 80 est bloqué par le pare-feu',
          'nginx a une erreur dans son fichier de configuration',
          "L'application backend sur le port 3000 ne répond plus — nginx ne peut pas lui relayer les requêtes",
          "La base de données n'est pas accessible",
        ],
        correctAnswer: 2,
        explanation:
          "`Connection refused` sur le port 3000 (upstream) signifie que le processus applicatif n'écoute plus sur ce port. nginx fonctionne correctement — c'est l'app derrière qui est tombée. La prochaine étape : `pm2 logs` ou `pm2 status` pour comprendre pourquoi.",
      },
      {
        id: 3,
        type: 'ai_error',
        scenarioId: 'service-down',
        scenarioTitle: 'Site hors-ligne — 23h',
        scenarioContext:
          "L'app Node.js sur le port 3000 ne répond plus. L'IA propose une commande pour régler le problème rapidement.",
        title: 'Étape 3 — La suggestion de l\'IA',
        prompt: "L'IA propose cette commande pour remettre le site en ligne. Qu'est-ce qui cloche ?",
        code: 'pm2 restart all',
        options: [
          "`pm2` ne peut pas redémarrer des applications Node.js",
          "Redémarrer sans lire les logs masque la cause — si l'app crashe à cause d'un bug, elle sera de nouveau hors-ligne en quelques secondes",
          "Il faut d'abord faire `pm2 stop all` avant `pm2 restart`",
          "La commande est correcte et c'est la bonne première action",
        ],
        correctAnswer: 1,
        explanation:
          "`pm2 logs app --lines 50` doit précéder le redémarrage. Si l'app plante à cause d'une exception non gérée, un accès DB impossible ou une mémoire saturée, redémarrer sans lire les logs conduit à une boucle de crashes. Diagnostiquer d'abord, corriger ensuite.",
      },

      // ── Scénario B : Accès refusé ──────────────────────────────────────────
      {
        id: 4,
        type: 'explain',
        scenarioId: 'perm-denied',
        scenarioTitle: 'Accès refusé',
        scenarioContext:
          "Ton script de déploiement s'arrête avec `bash: /var/app/uploads: Permission denied`. Le dossier existe bien sur le serveur. Tu dois y écrire.",
        title: 'Étape 1 — Lire les permissions',
        prompt: 'Quelle commande donne les informations nécessaires pour comprendre ce refus ?',
        options: [
          '`cat /var/app/uploads` — lire le contenu du dossier',
          '`file /var/app/uploads` — identifier le type de fichier',
          '`ls -la /var/app/` — afficher permissions, propriétaire et groupe du dossier',
          '`chmod status /var/app/uploads` — voir les permissions actuelles',
        ],
        correctAnswer: 2,
        explanation:
          "`ls -la` affiche les permissions sous la forme `drwxr-xr-x`, le propriétaire et le groupe. C'est le point de départ standard pour tout diagnostic d'accès refusé. `chmod status` n'est pas une vraie commande.",
      },
      {
        id: 5,
        type: 'ai_error',
        scenarioId: 'perm-denied',
        scenarioTitle: 'Accès refusé',
        scenarioContext:
          "Le résultat de `ls -la` : `drwxr-xr-x 2 root root uploads/`. Ton script tourne sous l'utilisateur `deploy`. L'IA propose une correction.",
        title: "Étape 2 — La correction de l'IA",
        prompt: "L'IA propose `chmod -R 777 /var/app/uploads`. Quelle est la vraie solution ?",
        options: [
          '`chmod -R 777` est adapté pour un dossier d\'uploads accessible à l\'app',
          '`chown -R deploy:deploy /var/app/uploads` — transférer la propriété à l\'utilisateur deploy sans ouvrir les permissions à tout le monde',
          '`chmod 755 /var/app/uploads` — ajouter le droit d\'exécution au propriétaire',
          "Relancer le script avec `sudo` — c'est plus simple",
        ],
        correctAnswer: 1,
        explanation:
          "Le problème est la propriété, pas les permissions. Le dossier appartient à `root`, donc `deploy` ne peut qu'y lire. `chown` transfère la propriété. `chmod 777` est une faille : n'importe quel utilisateur du serveur peut modifier les uploads. `sudo` masque le problème sans le résoudre.",
      },
    ],
  },
}
