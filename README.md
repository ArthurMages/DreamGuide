# 🌙 DreamGuide - Journal de Rêves Mobile

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.10-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![React Native Paper](https://img.shields.io/badge/React%20Native%20Paper-5.14.5-purple.svg)](https://reactnativepaper.com/)

Application mobile React Native/Expo pour journaliser et analyser ses rêves avec fonctionnalités avancées de recherche, statistiques et export.

## 📋 Table des Matières

- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🏗️ Architecture](#️-architecture)
- [📱 Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies](#️-technologies)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [📊 Structure des Données](#-structure-des-données)
- [🎨 Thème et UI](#-thème-et-ui)
- [🔔 Notifications](#-notifications)
- [📤 Export de Données](#-export-de-données)
- [🧪 Tests](#-tests)
- [🚀 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)

## 🚀 Démarrage Rapide

```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd DreamGuide

# Installer les dépendances
npm install

# Démarrer l'application
npm start

# Ou pour une plateforme spécifique
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## 🏗️ Architecture

### Structure du Projet

```
DreamGuide/
├── app/                    # Écrans et navigation (Expo Router)
│   ├── (tabs)/            # Navigation par onglets
│   │   ├── index.tsx      # Création de rêve
│   │   ├── two.tsx        # Liste des rêves
│   │   ├── three.tsx      # Recherche
│   │   ├── stats.tsx      # Statistiques
│   │   ├── export.tsx     # Export
│   │   └── settings.tsx   # Paramètres
│   └── _layout.tsx        # Layout racine
├── components/            # Composants réutilisables
│   ├── DreamForm.tsx      # Formulaire de création
│   ├── DreamList.tsx      # Liste des rêves
│   ├── StatisticsScreen.tsx # Écran statistiques
│   ├── ExportDreams.tsx   # Fonctionnalités d'export
│   └── NotificationSettings.tsx # Configuration notifications
├── constants/             # Constantes de l'application
├── hooks/                 # Hooks personnalisés
├── services/              # Services et API
├── store/                 # Gestion d'état (Zustand)
├── types/                 # Types TypeScript
└── utils/                 # Fonctions utilitaires
```

### Patterns Architecturaux

- **Expo Router** : Navigation basée sur le système de fichiers
- **Component-Based Architecture** : Composants réutilisables et modulaires
- **Custom Hooks** : Logique métier encapsulée
- **Service Layer** : Abstraction des opérations de données
- **Type-Safe** : TypeScript strict pour la robustesse

## 📱 Fonctionnalités

### ✅ Fonctionnalités Principales

| Fonctionnalité | Description | Statut |
|----------------|-------------|--------|
| **Création de Rêves** | Formulaire complet avec 15+ champs | ✅ |
| **Gestion des Rêves** | CRUD complet (Create, Read, Update, Delete) | ✅ |
| **Recherche Avancée** | Filtres multiples et recherche textuelle | ✅ |
| **Statistiques** | Analyses et graphiques détaillés | ✅ |
| **Export Multi-Format** | TXT, CSV, JSON | ✅ |
| **Notifications** | Rappels quotidiens personnalisables | ✅ |
| **Thème Adaptatif** | Mode clair/sombre automatique | ✅ |
| **Stockage Local** | Persistance avec AsyncStorage | ✅ |

### 📝 Détail des Onglets

#### 1. Nouveau Rêve
- Formulaire avec validation en temps réel
- 15+ champs : type, émotions, intensité, clarté, etc.
- Sélecteur de date/heure
- Sliders interactifs avec couleurs dynamiques
- Gestion des hashtags et mots-clés

#### 2. Mes Rêves
- Liste paginée avec cartes extensibles
- Actions : voir, modifier, supprimer
- Indicateurs visuels (tonalité, type)
- Modal d'édition rapide
- Filtrage par métadonnées

#### 3. Recherche
- Barre de recherche intelligente
- Filtres : type de rêve, tonalité, émotions
- Suggestions rapides basées sur les hashtags
- Résultats en temps réel
- Compteur de résultats

#### 4. Statistiques
- Vue d'ensemble : total, lucides, moyennes
- Graphiques de distribution
- Top émotions et mots-clés
- Analyse de la qualité du sommeil
- Tendances temporelles

#### 5. Export
- Export TXT formaté pour lecture
- Export CSV pour analyse Excel
- Export JSON pour backup/migration
- Partage direct multi-plateformes
- Prévisualisation avant export

#### 6. Paramètres
- Configuration des notifications
- Gestion du thème
- Paramètres de l'application
- À propos et version

## 🛠️ Technologies

### Stack Principal
- **React Native** 0.81.4 - Framework mobile
- **Expo** ~54.0.10 - Plateforme de développement
- **TypeScript** ~5.9.2 - Typage statique
- **Expo Router** - Navigation basée sur les fichiers

### UI/UX
- **React Native Paper** 5.14.5 - Composants Material Design
- **Expo Vector Icons** - Icônes vectorielles
- **React Native Reanimated** - Animations fluides
- **Expo Linear Gradient** - Dégradés

### Gestion d'État
- **Zustand** 5.0.8 - Store léger et performant
- **AsyncStorage** - Persistance locale
- **React Hooks** - État local des composants

### Fonctionnalités Natives
- **Expo Notifications** - Notifications push locales
- **Expo File System** - Gestion des fichiers
- **Expo Sharing** - Partage inter-applications
- **DateTime Picker** - Sélection de date/heure

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Simulateur iOS/Android ou appareil physique

### Installation Complète

```bash
# 1. Cloner le repository
git clone [URL_DU_REPO]
cd DreamGuide

# 2. Installer les dépendances
npm install

# 3. Vérifier la configuration Expo
npx expo doctor

# 4. Démarrer en mode développement
npm start
```

### Dépendances Principales

```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-native-community/datetimepicker": "8.4.4",
    "@react-native-community/slider": "^5.0.1",
    "expo-notifications": "~0.32.12",
    "expo-file-system": "~19.0.16",
    "expo-sharing": "~14.0.7",
    "react-native-paper": "^5.14.5",
    "zustand": "^5.0.8"
  }
}
```

## 🔧 Configuration

### Configuration Expo (`app.json`)

```json
{
  "expo": {
    "name": "DreamGuide",
    "slug": "dreamguide",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "dreamguide",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png"
      },
      "permissions": [
        "NOTIFICATIONS",
        "SCHEDULE_EXACT_ALARM",
        "USE_EXACT_ALARM"
      ]
    },
    "notification": {
      "icon": "./assets/images/notification-icon.png",
      "color": "#6366F1"
    }
  }
}
```

### Variables d'Environnement

Créer un fichier `.env` :

```env
# Configuration de l'app
APP_NAME=DreamGuide
APP_VERSION=1.0.0

# Notifications
NOTIFICATION_CHANNEL_ID=dream-reminders
DEFAULT_MORNING_TIME=08:00
DEFAULT_EVENING_TIME=21:00

# Thème
DEFAULT_THEME=auto
PRIMARY_COLOR=#6366F1
```

## 📊 Structure des Données

### Interface Dream

```typescript
interface Dream {
  // Identifiants
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Contenu principal
  dreamText: string;                    // Description du rêve
  todayDate: string;                   // Date du rêve
  
  // Classification
  dreamType?: DreamType;               // Type de rêve
  overallTone?: ToneType;              // Tonalité générale
  isLucidDream: boolean;               // Rêve lucide
  
  // Contexte
  location?: string;                   // Lieu du rêve
  characters?: string;                 // Personnages présents
  
  // Émotions
  emotionBefore?: string[];            // Émotions avant le rêve
  emotionAfter?: string[];             // Émotions après le rêve
  emotionalIntensity?: number;         // Intensité 1-10
  
  // Qualité
  clarity?: number;                    // Clarté 1-10
  sleepQuality?: number;               // Qualité sommeil 1-10
  
  // Métadonnées
  keywords?: string[];                 // Mots-clés
  hashtags?: HashtagsLegacy;          // Format legacy
  hashtagsArray?: Hashtag[];          // Nouveau format
  personalMeaning?: string;            // Signification personnelle
}
```

### Types Énumérés

```typescript
type DreamType = 'ordinary' | 'lucid' | 'nightmare' | 'premonitory' | 'fantasy';
type ToneType = 'positive' | 'neutral' | 'negative';

interface Hashtag {
  id: string;
  label: string;
}
```

### Stockage Local

```typescript
// Clés AsyncStorage
const STORAGE_KEYS = {
  DREAMS: 'dreamFormDataArray',
  THEME: 'app-theme',
  NOTIFICATIONS: 'notification-settings',
  USER_PREFERENCES: 'user-preferences'
};
```

## 🎨 Thème et UI

### Système de Thème

```typescript
interface AppTheme {
  // Couleurs principales
  primary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  
  // Texte
  text: string;
  textSecondary: string;
  
  // États
  border: string;
  error: string;
  success: string;
  warning: string;
}
```

### Thèmes Prédéfinis

```typescript
const LIGHT_THEME: AppTheme = {
  primary: '#6366F1',
  accent: '#4ECDC4',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B'
};

const DARK_THEME: AppTheme = {
  primary: '#818CF8',
  accent: '#34D399',
  background: '#111827',
  surface: '#1F2937',
  card: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  border: '#4B5563',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24'
};
```

### Composants Thématisés

```typescript
// Hook pour accéder au thème
const theme = useAppTheme();

// Composant avec thème
<View style={[styles.container, { backgroundColor: theme.background }]}>
  <Text style={[styles.text, { color: theme.text }]}>
    Contenu thématisé
  </Text>
</View>
```

## 🔔 Notifications

### Configuration des Notifications

```typescript
interface NotificationSettings {
  enabled: boolean;
  morningEnabled: boolean;
  eveningEnabled: boolean;
  morningTime: string;      // Format "HH:MM"
  eveningTime: string;      // Format "HH:MM"
  customMessage?: string;
}
```

### Implémentation

```typescript
// Demander les permissions
const { status } = await Notifications.requestPermissionsAsync();

// Programmer une notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: "DreamGuide 🌙",
    body: "N'oubliez pas de noter votre rêve !",
    sound: true,
  },
  trigger: {
    hour: 8,
    minute: 0,
    repeats: true,
  },
});
```

### Gestion des Permissions

- **iOS** : Demande automatique au premier lancement
- **Android** : Permissions dans `app.json` + demande runtime
- **Web** : Notifications navigateur (limitées)

## 📤 Export de Données

### Formats Supportés

#### 1. Export TXT
```
=== MES RÊVES - DREAMGUIDE ===
Exporté le: [DATE]
Total: [NOMBRE] rêves

--- RÊVE #1 ---
Date: [DATE]
Type: [TYPE] [ICÔNE]
Tonalité: [TONALITÉ]

[CONTENU DU RÊVE]

Lieu: [LIEU]
Personnages: [PERSONNAGES]
Intensité: [X]/10
Clarté: [X]/10
Hashtags: #[TAG1] #[TAG2]
```

#### 2. Export CSV
```csv
Date,Type,Tonalité,Contenu,Lieu,Personnages,Intensité,Clarté,Hashtags
2024-01-01,ordinary,positive,"Contenu du rêve","Maison","Famille",7,8,"#famille #maison"
```

#### 3. Export JSON
```json
{
  "exportDate": "2024-01-01T10:00:00.000Z",
  "version": "1.0.0",
  "totalDreams": 1,
  "dreams": [
    {
      "dreamText": "Contenu du rêve",
      "todayDate": "2024-01-01T00:00:00.000Z",
      "dreamType": "ordinary",
      "overallTone": "positive",
      // ... autres champs
    }
  ]
}
```

### Utilisation

```typescript
// Export TXT
const txtContent = await exportToTXT(dreams);
await shareContent(txtContent, 'mes-reves.txt');

// Export CSV
const csvContent = await exportToCSV(dreams);
await shareContent(csvContent, 'mes-reves.csv');

// Export JSON
const jsonContent = await exportToJSON(dreams);
await shareContent(jsonContent, 'mes-reves.json');
```

## 🧪 Tests

### Structure des Tests

```
__tests__/
├── components/
│   ├── DreamForm.test.tsx
│   ├── DreamList.test.tsx
│   └── StatisticsScreen.test.tsx
├── utils/
│   ├── dreamUtils.test.ts
│   └── exportUtils.test.ts
├── services/
│   └── dreamService.test.ts
└── hooks/
    └── useAppTheme.test.ts
```

### Commandes de Test

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage

# Tests E2E (si configurés)
npm run test:e2e
```

### Exemple de Test

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import DreamForm from '../components/DreamForm';

describe('DreamForm', () => {
  it('should validate required fields', () => {
    const { getByText, getByPlaceholderText } = render(<DreamForm />);
    
    const submitButton = getByText('Enregistrer le rêve');
    fireEvent.press(submitButton);
    
    expect(getByText('Erreur')).toBeTruthy();
  });
});
```

## 🚀 Déploiement

### Build de Production

```bash
# Build pour toutes les plateformes
npx expo build

# Build spécifique
npx expo build:android
npx expo build:ios
npx expo build:web
```

### Configuration EAS Build

```json
{
  "build": {
    "production": {
      "node": "18.x.x",
      "env": {
        "NODE_ENV": "production"
      }
    },
    "preview": {
      "distribution": "internal"
    }
  }
}
```

### Déploiement

#### App Stores
```bash
# Soumettre à l'App Store
npx expo submit --platform ios

# Soumettre au Play Store
npx expo submit --platform android
```

#### Web
```bash
# Build web
npx expo export:web

# Déployer (exemple Netlify)
npm run build:web
netlify deploy --prod --dir web-build
```

## 🤝 Contribution

### Workflow de Développement

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commiter** les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Pousser** la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Créer** une Pull Request

### Standards de Code

- **ESLint** : Configuration stricte
- **Prettier** : Formatage automatique
- **TypeScript** : Typage strict
- **Conventional Commits** : Messages de commit standardisés

### Structure des Commits

```
type(scope): description

feat(dreams): ajout du filtre par date
fix(export): correction du format CSV
docs(readme): mise à jour de la documentation
style(ui): amélioration du thème sombre
refactor(utils): optimisation des fonctions d'export
test(components): ajout des tests unitaires
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Expo Team** pour l'excellent framework
- **React Native Paper** pour les composants UI
- **Communauté React Native** pour le support

---

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/[USERNAME]/dreamguide/issues)
- **Discussions** : [GitHub Discussions](https://github.com/[USERNAME]/dreamguide/discussions)
- **Email** : support@dreamguide.app

---

**DreamGuide** - Transformez vos rêves en souvenirs durables 🌙✨