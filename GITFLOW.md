# Gitflow Workflow

Ce projet suit le workflow Gitflow. Voici les branches principales et leur utilisation :

## Branches principales

- `main` : Code en production
- `develop` : Code en développement

## Branches de fonctionnalités

- `feature/*` : Nouvelles fonctionnalités
- `bugfix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes en production
- `release/*` : Préparation des releases

## Workflow de développement

1. Créer une nouvelle branche depuis `develop` :
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nom-de-la-fonctionnalite
   ```

2. Développer la fonctionnalité :
   ```bash
   git add .
   git commit -m "Description des changements"
   ```

3. Mettre à jour la branche avec develop :
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/nom-de-la-fonctionnalite
   git merge develop
   ```

4. Pousser les changements :
   ```bash
   git push origin feature/nom-de-la-fonctionnalite
   ```

5. Créer une Pull Request vers `develop`

## Release

1. Créer une branche release :
   ```bash
   git checkout develop
   git checkout -b release/x.x.x
   ```

2. Tester et corriger les bugs
3. Merger dans `main` et `develop`
4. Tagger la version :
   ```bash
   git tag -a vx.x.x -m "Version x.x.x"
   git push origin vx.x.x
   ```

## Hotfix

1. Créer depuis `main` :
   ```bash
   git checkout main
   git checkout -b hotfix/description
   ```

2. Corriger le bug
3. Merger dans `main` et `develop`