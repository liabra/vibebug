export const networkChallenges = {
  net_1: {
    title: 'Connectivité de base',
    challenges: [
      {
        id: 1,
        type: 'explain',
        title: 'Interpréter les pertes ping',
        prompt: 'Tu lances ce ping depuis ton serveur. Que peut-on conclure avec certitude ?',
        code: '$ ping -c 4 google.com\nPING google.com (142.250.185.78)\n64 bytes from 142.250.185.78: icmp_seq=1 ttl=117 time=12ms\nRequest timeout for icmp_seq 2\nRequest timeout for icmp_seq 3\n64 bytes from 142.250.185.78: icmp_seq=4 ttl=117 time=11ms\n\n4 packets transmitted, 2 received, 50% packet loss',
        options: [
          'Google est en panne à 50 %',
          'La connexion fonctionne mais est instable — le DNS résout encore correctement',
          'Le DNS est cassé, les paquets ne partent pas',
          'Le TTL est trop bas pour atteindre Google',
        ],
        correctAnswer: 1,
        explanation:
          "Le DNS résout bien (`142.250.185.78` est renvoyé), certains paquets passent — le problème est une instabilité réseau entre les deux nœuds, pas une panne totale. 50 % de perte avec résolution DNS réussie oriente vers le transit réseau, pas la machine locale.",
      },
      {
        id: 2,
        type: 'find_error',
        title: 'DNS en panne ou réseau coupé ?',
        prompt: "Tu essaies de diagnostiquer une perte de connectivité totale. Quel test permet de distinguer une panne DNS d'une panne réseau ?",
        code: '# Test A\n$ ping google.com\nping: google.com: Name or service not known\n\n# Test B\n$ ping 8.8.8.8\nRequest timeout for icmp_seq 0\nRequest timeout for icmp_seq 1',
        options: [
          "Les deux tests échouent, donc DNS et réseau sont cassés en même temps",
          "Test A échoue = DNS possiblement cassé. Mais Test B échoue aussi sur une IP directe = c'est le réseau, pas juste le DNS",
          "Test B échoue = le serveur 8.8.8.8 est down",
          "Il faut aussi tester avec curl pour confirmer",
        ],
        correctAnswer: 1,
        explanation:
          "Si `ping IP` échoue (pas de résolution impliquée), c'est le réseau lui-même qui est coupé. Si `ping IP` passait mais `ping google.com` échouait, on saurait que c'est DNS. Tester l'IP en direct est le premier réflexe pour isoler la cause.",
      },
      {
        id: 3,
        type: 'explain',
        title: 'Lire un traceroute',
        prompt: "À quelle étape la connexion échoue-t-elle et que cela indique-t-il ?",
        code: '$ traceroute google.com\n 1  192.168.1.1 (passerelle)  1.2 ms\n 2  10.0.0.1 (FAI — hop 1)    8.4 ms\n 3  * * *\n 4  * * *\n 5  * * *',
        options: [
          "La machine locale est déconnectée (hop 1 échoue)",
          "La passerelle locale répond mais la connexion bloque chez le FAI au-delà du hop 2",
          "Google bloque les paquets traceroute pour des raisons de sécurité",
          "Le TTL est trop bas, il faut l'augmenter",
        ],
        correctAnswer: 1,
        explanation:
          "Hop 1 (passerelle locale) et hop 2 (FAI) répondent — le réseau local est sain. Le blocage commence au hop 3 : c'est dans l'infrastructure du FAI ou entre le FAI et internet. `* * *` peut aussi indiquer un routeur qui ne répond pas au traceroute, mais l'absence de réponse à partir du hop 3 est le signal diagnostique clé.",
      },
      {
        id: 4,
        type: 'ai_error',
        title: 'Séquence de diagnostic inversée',
        prompt: "L'IA propose cette séquence pour diagnostiquer \"le site ne répond pas\". Quel est le problème ?",
        code: '# Séquence proposée par l\'IA\ncurl https://monsite.com       # 1. Teste si le site répond\nping monsite.com               # 2. Vérifie si le DNS résout\nping 8.8.8.8                   # 3. Vérifie la connectivité IP',
        options: [
          "curl est la mauvaise commande pour tester un site web",
          "La séquence est dans le mauvais sens : on commence par le plus bas niveau (IP) avant de remonter vers HTTP, pour isoler précisément l'étape qui échoue",
          "Il faudrait utiliser wget à la place de curl",
          "ping 8.8.8.8 ne teste pas vraiment la connectivité",
        ],
        correctAnswer: 1,
        explanation:
          "Le diagnostic réseau se fait du bas vers le haut : réseau IP → DNS → protocole applicatif. En commençant par `curl`, on ne sait pas si l'échec vient du réseau, du DNS ou du serveur web. La bonne séquence : `ping 8.8.8.8` (réseau) → `ping monsite.com` (DNS) → `curl` (HTTP/S). Chaque étape confirme ou élimine une couche.",
      },
    ],
  },

  net_2: {
    title: 'Ports et services',
    challenges: [
      {
        id: 1,
        type: 'explain',
        title: 'Lire la sortie de ss',
        prompt: "Que peut-on déduire de cette sortie concernant PostgreSQL ?",
        code: '$ ss -tulpn\nState   Recv-Q  Local Address:Port\nLISTEN  0       0.0.0.0:80\nLISTEN  0       0.0.0.0:443\nLISTEN  0       127.0.0.1:5432',
        options: [
          "PostgreSQL est accessible depuis l'extérieur sur le port 5432",
          "PostgreSQL écoute uniquement sur localhost (127.0.0.1) — inaccessible depuis le réseau",
          "PostgreSQL n'est pas démarré",
          "Le port 5432 est bloqué par le firewall",
        ],
        correctAnswer: 1,
        explanation:
          "`127.0.0.1:5432` signifie que PostgreSQL n'écoute que sur l'interface loopback — seuls les processus de la même machine peuvent s'y connecter. `0.0.0.0:80` à l'inverse écoute sur toutes les interfaces (accessible depuis le réseau). C'est une distinction critique pour la sécurité.",
      },
      {
        id: 2,
        type: 'find_error',
        title: 'Connection refused vs Timeout',
        prompt: "Deux erreurs curl différentes. Laquelle correspond à quel scénario ?",
        code: '# Erreur A\ncurl: (7) Failed to connect to monapp port 8080: Connection refused\n\n# Erreur B\ncurl: (28) Connection timed out after 30000 milliseconds',
        options: [
          "Les deux indiquent que le serveur est éteint",
          "Erreur A = le port est ouvert mais le service plante. Erreur B = firewall actif",
          "Erreur A = service arrêté ou port fermé sur la machine. Erreur B = paquet filtré (firewall) ou hôte injoignable",
          "Erreur A = DNS cassé. Erreur B = service surchargé",
        ],
        correctAnswer: 2,
        explanation:
          "\"Connection refused\" arrive quand la machine répond au paquet TCP mais rejette la connexion — le port n'écoute pas. \"Timeout\" arrive quand le paquet est absorbé sans réponse — généralement un firewall `DROP` ou un hôte injoignable. Cette distinction oriente directement vers `ss -tulpn` (Refused) ou `ufw status` / `iptables -L` (Timeout).",
      },
      {
        id: 3,
        type: 'ai_error',
        title: 'Relancer avant de diagnostiquer',
        prompt: "Ton appli Node répond \"Connection refused\" sur le port 3000. L'IA propose immédiatement :",
        code: '# Solution proposée par l\'IA\npm2 restart myapp\n# ou\nsystemctl restart myapp\n\n# "Le service a dû crasher, il faut le relancer"',
        options: [
          "C'est la bonne approche, un restart règle la plupart des problèmes",
          "Relancer un service crashé avant de lire les logs efface parfois les traces de l'erreur et ne règle pas la cause réelle",
          "pm2 et systemctl ne peuvent pas gérer ce type de problème",
          "Il faudrait d'abord vérifier les variables d'environnement",
        ],
        correctAnswer: 1,
        explanation:
          "Relancer sans lire les logs (`pm2 logs myapp` ou `journalctl -u myapp -n 50`) efface parfois l'erreur du buffer. La bonne séquence : 1) lire les logs pour comprendre pourquoi ça a planté, 2) corriger la cause, 3) relancer. Relancer à l'aveugle peut masquer un problème récurrent (port déjà utilisé, variable manquante, fichier de config corrompu).",
      },
      {
        id: 4,
        type: 'fix',
        title: 'SSH inaccessible — quelle commande en premier ?',
        prompt: "Un collègue dit que SSH est inaccessible depuis l'extérieur. Tu es déjà connecté en SSH sur la machine. Quelle est la première vérification ?",
        code: '# Option A\nufw allow 22\n\n# Option B\nss -tulpn | grep sshd\n\n# Option C\nsystemctl restart sshd\n\n# Option D\ncat /etc/ssh/sshd_config | grep Port',
        options: [
          "Option A — ouvrir le port 22 dans le firewall en premier",
          "Option C — relancer sshd règle la plupart des problèmes de connexion",
          "Option B — vérifier si sshd écoute bien et sur quelle interface/port",
          "Option D — le port a peut-être été changé dans la config",
        ],
        correctAnswer: 2,
        explanation:
          "Si tu es déjà connecté en SSH, le service tourne probablement. La question est : sur quelle interface et quel port écoute-t-il ? `ss -tulpn | grep sshd` répond directement. Modifier le firewall (Option A) sans vérifier peut ouvrir le mauvais port. Option D est pertinente en second, mais Option B donne à la fois le port ET l'interface d'écoute.",
      },
      {
        id: 5,
        type: 'ai_error',
        title: 'dig vs nslookup — lequel croire ?',
        prompt: "L'IA recommande nslookup pour diagnostiquer un problème DNS en production. Quelle nuance importante omet-elle ?",
        code: '# Recommandation IA\nnslookup monsite.com\n\n# "nslookup est la commande standard pour tester le DNS"',
        options: [
          "nslookup n'existe pas sur Linux, il faut utiliser dig",
          "nslookup utilise sa propre bibliothèque de résolution qui peut ignorer /etc/resolv.conf et donner des résultats différents du comportement réel de l'application",
          "nslookup ne supporte pas les enregistrements MX et CNAME",
          "nslookup est obsolète mais donne exactement les mêmes résultats que dig",
        ],
        correctAnswer: 1,
        explanation:
          "`nslookup` a sa propre implémentation du client DNS, indépendante de la bibliothèque système (`glibc`). Elle peut ignorer `/etc/hosts`, certaines options de `/etc/resolv.conf`, et ne reflète pas toujours ce qu'une vraie application verra. `dig` et `getent hosts` donnent des résultats plus fidèles au comportement applicatif réel. En prod, vérifier avec les deux si les résultats diffèrent.",
      },
    ],
  },
}
