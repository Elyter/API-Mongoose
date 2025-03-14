# API Mongoose - Gestion de profils

Une API RESTful pour la gestion de profils, développée avec Express.js et MongoDB/Mongoose.

## Table des matières

- [Présentation](#présentation)
- [Technologies](#technologies)
- [Installation](#installation)
  - [Option 1 : Installation directe](#option-1--installation-directe)
  - [Option 2 : Installation avec Docker](#option-2--installation-avec-docker)
- [Utilisation de l'API](#utilisation-de-lapi)
  - [Gestion des profils](#gestion-des-profils)
  - [Gestion des expériences](#gestion-des-expériences)
  - [Gestion des compétences](#gestion-des-compétences)
  - [Gestion des informations](#gestion-des-informations)
  - [Gestion des amis](#gestion-des-amis)
- [Structure du projet](#structure-du-projet)
- [Modèle de données](#modèle-de-données)

## Présentation

Cette API permet de gérer des profils d'utilisateurs avec leurs expériences professionnelles, compétences, informations personnelles et relations d'amitié. Elle utilise MongoDB comme base de données et Mongoose comme ODM (Object Document Mapper).

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- Docker & Docker Compose

## Installation

Vous pouvez installer et lancer l'API de deux façons différentes :

### Option 1 : Installation directe

1. Clonez le dépôt :
   ```bash
   git clone <url-du-depot>
   cd API\ Mongoose
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env` à la racine du projet avec les variables d'environnement suivantes :
   ```
   PORT=3000
   MONGO_URI=mongodb://root:example@localhost:27017/profilesdb?authSource=admin
   ```

4. Assurez-vous que MongoDB est installé et en cours d'exécution sur votre machine

5. Lancez l'application :
   ```bash
   # Mode production
   npm start
   
   # Mode développement (avec nodemon)
   npm run dev
   ```

### Option 2 : Installation avec Docker

1. Clonez le dépôt :
   ```bash
   git clone <url-du-depot>
   cd API\ Mongoose
   ```

2. Lancez les conteneurs avec Docker Compose :
   ```bash
   docker-compose up --build
   ```

3. Pour arrêter les conteneurs :
   ```bash
   docker-compose down
   ```

## Utilisation de l'API

L'API est accessible à l'adresse `http://localhost:3000/api/profiles`.

### Gestion des profils

- **Créer un profil** :
  ```bash
  curl -X POST http://localhost:3000/api/profiles \
    -H "Content-Type: application/json" \
    -d '{"name": "John Doe", "email": "john@example.com"}'
  ```

- **Obtenir tous les profils** :
  ```bash
  curl http://localhost:3000/api/profiles
  ```

- **Obtenir un profil par ID** :
  ```bash
  curl http://localhost:3000/api/profiles/PROFILE_ID
  ```

- **Mettre à jour un profil** :
  ```bash
  curl -X PUT http://localhost:3000/api/profiles/PROFILE_ID \
    -H "Content-Type: application/json" \
    -d '{"name": "John Updated", "email": "john_updated@example.com"}'
  ```

- **Supprimer un profil** :
  ```bash
  curl -X DELETE http://localhost:3000/api/profiles/PROFILE_ID
  ```

### Gestion des expériences

- **Ajouter une expérience** :
  ```bash
  curl -X POST http://localhost:3000/api/profiles/PROFILE_ID/experience \
    -H "Content-Type: application/json" \
    -d '{"title": "Developer", "company": "Tech Inc", "dates": "2020-2023", "description": "Full-stack development"}'
  ```

- **Supprimer une expérience** :
  ```bash
  curl -X DELETE http://localhost:3000/api/profiles/PROFILE_ID/experience/EXPERIENCE_ID
  ```

### Gestion des compétences

- **Ajouter une compétence** :
  ```bash
  curl -X POST http://localhost:3000/api/profiles/PROFILE_ID/skills \
    -H "Content-Type: application/json" \
    -d '{"skill": "JavaScript"}'
  ```

- **Supprimer une compétence** :
  ```bash
  curl -X DELETE http://localhost:3000/api/profiles/PROFILE_ID/skills/JavaScript
  ```

### Gestion des informations

- **Mettre à jour les informations** :
  ```bash
  curl -X PUT http://localhost:3000/api/profiles/PROFILE_ID/information \
    -H "Content-Type: application/json" \
    -d '{"bio": "Développeur passionné", "location": "Paris", "website": "https://example.com"}'
  ```

### Gestion des amis

- **Ajouter un ami** :
  ```bash
  curl -X POST http://localhost:3000/api/profiles/PROFILE_ID/friends \
    -H "Content-Type: application/json" \
    -d '{"friendId": "FRIEND_ID"}'
  ```

- **Supprimer un ami** :
  ```bash
  curl -X DELETE http://localhost:3000/api/profiles/PROFILE_ID/friends/FRIEND_ID
  ```

- **Obtenir la liste des amis** :
  ```bash
  curl http://localhost:3000/api/profiles/PROFILE_ID/friends
  ```

## Structure du projet

```
API Mongoose/
├── api/
│   └── profiles/
│       ├── controller.js
│       ├── index.js
│       └── model.js
├── .env
├── docker-compose.yml
├── Dockerfile
├── index.js
├── package.json
└── routes.js
```

## Modèle de données

Le modèle de profil contient les champs suivants :

- `name` (String, obligatoire) : Nom de l'utilisateur
- `email` (String, obligatoire, unique) : Email de l'utilisateur
- `experience` (Array) : Liste des expériences professionnelles
  - `title` (String) : Titre du poste
  - `company` (String) : Nom de l'entreprise
  - `dates` (String) : Période d'emploi
  - `description` (String) : Description du poste
- `skills` (Array of String) : Liste des compétences
- `information` (Object) : Informations complémentaires
  - `bio` (String) : Biographie
  - `location` (String) : Localisation
  - `website` (String) : Site web
- `friends` (Array of ObjectId) : Liste des amis (référence à d'autres profils)
- `isDeleted` (Boolean) : Marqueur de suppression logique
- `timestamps` : Dates de création et de modification
