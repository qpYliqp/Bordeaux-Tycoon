# Projet-Web

Pour lancer le site, il suffit simplement d'utiliser la commande
```
docker compose -f compose-prod.yaml up -d
```

Si vous souhaitez utiliser le compose de développement, il est nécessaire d'avoir la version 2.22 de docker compose.
Ceci est dû à la présence de la commande watch dans le fichier compose.yaml.

## API

Pour lancer correctement l'API, il y a plusieurs étapes à effectuer :

- Tout d'abord, il faut dupliquer le .env.example et le renommer .env
- Ensuite, il faut modifier le champ TOKEN_SECRET dans le .env. 
Une manière simple est de générer une clé depuis le terminal :
```
node
require('crypto').randomBytes(64).toString('hex')
```

Un swagger est disponible sur la route
```
/api/swagger
```

## Webapp

- Pour lancer la webapp, il faut dupliquer le .env_example et le renommer en .env
- Petit conseil pour le dev et afin de limiter le temps de chargement de docker après chaque modification testable (sous condition que les autres dockers soit lancés) :

```
docker compose up webapp --build -d
```
