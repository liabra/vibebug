// Chaque challenge peut avoir un champ `type` (voir CHALLENGE_TYPES dans modules.js).
// Les challenges sans `type` sont traités comme 'find_error' par défaut.
// Ce champ est ignoré par les composants actuels — il prépare l'évolution future.
export const bashChallenges = {
  1: {
    title: "Débutant",
    challenges: [
      {
        id: 1,
        type: "explain",
        title: "Lister les fichiers",
        prompt: "Que fait cette commande ?",
        code: "ls -la",
        options: [
          "Liste les fichiers avec leurs permissions et fichiers cachés",
          "Supprime tous les fichiers du répertoire",
          "Affiche uniquement les fichiers cachés",
          "Crée un nouveau répertoire nommé 'la'",
        ],
        correctAnswer: 0,
        explanation:
          "`ls -l` affiche les détails (permissions, taille, date), `-a` inclut les fichiers cachés (commençant par `.`).",
      },
      {
        id: 2,
        type: "explain",
        title: "Changer de répertoire",
        prompt: "Que fait cette commande ?",
        code: "cd ..",
        options: [
          "Crée un répertoire parent",
          "Remonte d'un niveau dans l'arborescence",
          "Supprime le répertoire courant",
          "Liste le contenu du répertoire parent",
        ],
        correctAnswer: 1,
        explanation:
          "`..` désigne le répertoire parent. `cd ..` remonte donc d'un niveau dans l'arborescence.",
      },
      {
        id: 3,
        type: "explain",
        title: "Afficher le contenu",
        prompt: "Quelle commande permet d'afficher le contenu d'un fichier ?",
        code: "cat fichier.txt",
        options: [
          "Copie le fichier dans le presse-papier",
          "Concatène et affiche le contenu du fichier",
          "Crée un fichier vide nommé fichier.txt",
          "Supprime le fichier",
        ],
        correctAnswer: 1,
        explanation:
          "`cat` (concatenate) affiche le contenu d'un ou plusieurs fichiers dans le terminal.",
      },
      {
        id: 4,
        type: "explain",
        title: "Copier un fichier",
        prompt: "Que fait cette commande ?",
        code: "cp source.txt destination.txt",
        options: [
          "Déplace source.txt vers destination.txt",
          "Compare les deux fichiers",
          "Copie source.txt vers destination.txt",
          "Crée un lien symbolique",
        ],
        correctAnswer: 2,
        explanation:
          "`cp` copie un fichier. L'original reste intact, une copie est créée à la destination.",
      },
      {
        id: 5,
        type: "explain",
        title: "Chemin courant",
        prompt: "À quoi sert cette commande ?",
        code: "pwd",
        options: [
          "Affiche le mot de passe de l'utilisateur",
          "Change les permissions d'un fichier",
          "Affiche le chemin absolu du répertoire courant",
          "Crée un nouveau répertoire",
        ],
        correctAnswer: 2,
        explanation:
          "`pwd` (print working directory) affiche le chemin complet depuis la racine jusqu'au répertoire où vous vous trouvez.",
      },
    ],
  },
  2: {
    title: "Intermédiaire",
    challenges: [
      {
        id: 1,
        type: "explain",
        title: "Permissions",
        prompt: "Que fait cette commande ?",
        code: "chmod 755 script.sh",
        options: [
          "Supprime les permissions du fichier",
          "Donne les droits lecture/écriture/exécution au propriétaire, lecture/exécution aux autres",
          "Change le propriétaire du fichier",
          "Affiche les permissions actuelles",
        ],
        correctAnswer: 1,
        explanation:
          "`755` = propriétaire (7 = rwx), groupe (5 = r-x), autres (5 = r-x). Typique pour un script exécutable.",
      },
      {
        id: 2,
        type: "find_error",
        title: "Recherche dans les fichiers",
        prompt: "Que fait cette commande ?",
        code: 'grep -r "erreur" /var/log/',
        options: [
          "Supprime les lignes contenant 'erreur' dans /var/log/",
          "Recherche récursivement le mot 'erreur' dans tous les fichiers de /var/log/",
          "Remplace 'erreur' par une chaîne vide",
          "Compte le nombre de fichiers dans /var/log/",
        ],
        correctAnswer: 1,
        explanation:
          "`grep -r` effectue une recherche récursive dans tous les sous-répertoires. Très utile pour fouiller des logs.",
      },
      {
        id: 3,
        type: "find_error",
        title: "Redirection",
        prompt: "Que fait l'opérateur `>>` dans cette commande ?",
        code: 'echo "nouvelle ligne" >> fichier.txt',
        options: [
          "Écrase le contenu de fichier.txt",
          "Lit le contenu de fichier.txt",
          "Ajoute la ligne à la fin de fichier.txt sans écraser",
          "Compare deux fichiers",
        ],
        correctAnswer: 2,
        explanation:
          "`>>` est une redirection en mode append. `>` écrase, `>>` ajoute à la fin du fichier.",
      },
      {
        id: 4,
        type: "fix",
        title: "Pipeline",
        prompt: "Que fait le pipe `|` dans cette commande ?",
        code: "ps aux | grep nginx",
        options: [
          "Sauvegarde la liste des processus dans nginx",
          "Passe la sortie de `ps aux` comme entrée de `grep nginx`",
          "Lance nginx en tant que processus fils",
          "Affiche les logs nginx",
        ],
        correctAnswer: 1,
        explanation:
          "Le pipe `|` chaîne les commandes : la sortie de la première devient l'entrée de la suivante. Ici, on filtre les processus pour trouver nginx.",
      },
      {
        id: 5,
        type: "explain",
        title: "Variables d'environnement",
        prompt: "Comment afficher la valeur de la variable PATH ?",
        code: "echo $PATH",
        options: [
          "Affiche littéralement '$PATH'",
          "Crée une variable nommée PATH",
          "Affiche la valeur de la variable d'environnement PATH",
          "Supprime la variable PATH",
        ],
        correctAnswer: 2,
        explanation:
          "Le `$` devant un nom de variable permet d'accéder à sa valeur. `echo $PATH` affiche les répertoires où bash cherche les exécutables.",
      },
      {
        id: 6,
        type: "fix",
        title: "Script refusé",
        prompt: "L'IA vient de générer ce script de setup. Tu essaies de le lancer et tu obtiens cette erreur. Quelle est la cause et la solution ?",
        code: "$ ./setup.sh\nbash: ./setup.sh: Permission denied",
        options: [
          "Le fichier est corrompu — il faut le recréer",
          "Il manque le droit d'exécution — lancer `chmod +x setup.sh` d'abord",
          "Il faut obligatoirement lancer le script avec `sudo`",
          "bash n'est pas installé sur ce système",
        ],
        correctAnswer: 1,
        explanation:
          "Un fichier créé (par l'IA ou autrement) n'a pas le bit exécutable par défaut. `chmod +x setup.sh` ajoute ce droit. Ensuite seulement, `./setup.sh` fonctionne.",
      },
      {
        id: 7,
        type: "find_error",
        title: "Le log qui disparaît",
        prompt: "Ce script de déploiement devait tenir un historique. Après 5 exécutions, il n'y a qu'une seule ligne dans le fichier. Trouve le problème.",
        code: 'echo "$(date) - déploiement OK" > deploy.log',
        options: [
          "`$(date)` n'est pas évalué à l'intérieur de echo",
          "L'opérateur `>` écrase le fichier à chaque exécution",
          "Le fichier deploy.log n'existait pas au premier lancement",
          "echo ne supporte pas les sous-commandes",
        ],
        correctAnswer: 1,
        explanation:
          "`>` redirige en mode écrasement. Pour accumuler les entrées sans perdre l'historique, il faut `>>` (append). Erreur classique dans les scripts de log générés par IA.",
      },
    ],
  },
  3: {
    title: "Avancé",
    challenges: [
      {
        id: 1,
        type: "explain",
        title: "Substitution de commande",
        prompt: "Que fait cette syntaxe ?",
        code: "DATE=$(date +%Y-%m-%d)\necho \"Aujourd'hui : $DATE\"",
        options: [
          "Affiche littéralement 'date +%Y-%m-%d'",
          "Exécute `date` et stocke son résultat dans DATE",
          "Crée un fichier nommé date",
          "Définit une fonction nommée DATE",
        ],
        correctAnswer: 1,
        explanation:
          "`$(commande)` est une substitution de commande : bash exécute la commande et remplace l'expression par son résultat.",
      },
      {
        id: 2,
        type: "find_error",
        title: "Boucle for",
        prompt: "Combien de fois 'hello' sera-t-il affiché ?",
        code: "for i in 1 2 3 4 5; do\n  echo 'hello'\ndone",
        options: ["1 fois", "3 fois", "5 fois", "En boucle infinie"],
        correctAnswer: 2,
        explanation:
          "La boucle itère sur la liste `1 2 3 4 5`, soit 5 éléments. `echo 'hello'` s'exécute 5 fois.",
      },
      {
        id: 3,
        type: "fix",
        title: "Test conditionnel",
        prompt: "Que vérifie cette condition ?",
        code: 'if [ -f "config.json" ]; then\n  echo "Fichier trouvé"\nfi',
        options: [
          "Si le répertoire config.json existe",
          "Si le fichier config.json est vide",
          "Si le fichier config.json existe et est un fichier régulier",
          "Si config.json a les droits d'exécution",
        ],
        correctAnswer: 2,
        explanation:
          "`-f` teste si le chemin existe ET est un fichier régulier (pas un répertoire ni un lien). `-d` testerait un répertoire.",
      },
      {
        id: 4,
        type: "ai_error",
        title: "xargs",
        prompt: "Que fait cette commande ?",
        code: 'find . -name "*.log" | xargs rm',
        options: [
          "Affiche tous les fichiers .log",
          "Déplace les fichiers .log dans un sous-dossier",
          "Trouve et supprime tous les fichiers .log récursivement",
          "Compte le nombre de fichiers .log",
        ],
        correctAnswer: 2,
        explanation:
          "`find` produit la liste des fichiers, `xargs` passe cette liste en arguments à `rm`. Équivalent à `find . -name '*.log' -delete`.",
      },
      {
        id: 5,
        type: "ai_error",
        title: "Trap et signaux",
        prompt: "À quoi sert cette ligne dans un script ?",
        code: 'trap "rm -f /tmp/lockfile" EXIT',
        options: [
          "Bloque le signal EXIT",
          "Exécute `rm -f /tmp/lockfile` quand le script se termine",
          "Crée un fichier de verrouillage à la sortie",
          "Affiche un message d'erreur à la sortie",
        ],
        correctAnswer: 1,
        explanation:
          "`trap` enregistre une commande à exécuter lors d'un signal. `EXIT` se déclenche à la fin du script (normal ou erreur), utile pour nettoyer.",
      },
      {
        id: 6,
        type: "ai_error",
        title: "Tuer à la brutale",
        prompt: "Nginx répond lentement. L'IA te propose cette commande pour le « redémarrer proprement ». Est-ce vraiment la bonne approche ?",
        code: "kill -9 $(pgrep nginx)",
        options: [
          "Oui, c'est la méthode recommandée pour redémarrer un service",
          "Non — `kill -9` (SIGKILL) force l'arrêt brutal sans laisser nginx fermer ses connexions",
          "Non — la syntaxe `$()` est invalide dans ce contexte",
          "Non — `pgrep` ne fonctionne qu'avec les processus système",
        ],
        correctAnswer: 1,
        explanation:
          "SIGKILL (-9) ne peut pas être intercepté : le processus est tué immédiatement, sans fermer les fichiers ni les connexions actives. Pour nginx, préférer `systemctl reload nginx` (rechargement sans downtime) ou `systemctl restart nginx`.",
      },
      {
        id: 7,
        type: "fix",
        title: "Service injoignable",
        prompt: "Une API que tu as déployée tourne normalement sur le port 8080. Un collègue dit qu'elle ne répond plus. Quelle commande utilises-tu en premier pour diagnostiquer ?",
        options: [
          "`ping localhost` — pour vérifier que la machine répond",
          "`curl -I http://localhost:8080` — pour voir le code de réponse HTTP",
          "`cat /var/log/syslog | grep 8080` — pour fouiller les logs",
          "`ls /etc/nginx/sites-enabled/` — pour vérifier la config nginx",
        ],
        correctAnswer: 1,
        explanation:
          "`curl -I` envoie une requête HEAD et affiche immédiatement le code HTTP (200, 502, connexion refusée…). `ping` ne teste que la connectivité réseau, pas le service. Les logs viennent après pour approfondir.",
      },
    ],
  },
};
