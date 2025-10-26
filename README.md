# 🌙 DreamGuide - Technical Documentation

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.10-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![React Native Paper](https://img.shields.io/badge/React%20Native%20Paper-5.14.5-purple.svg)](https://reactnativepaper.com/)

A React Native/Expo mobile application for dream journaling and analysis with advanced search, statistics, and export capabilities.

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🏗️ Architecture](#️-architecture)
- [📊 Data Models](#-data-models)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [🔧 Configuration](#-configuration)
- [🎨 Theme System](#-theme-system)
- [📱 Components](#-components)
- [🔄 State Management](#-state-management)
- [💾 Data Persistence](#-data-persistence)
- [📤 Export System](#-export-system)
- [🔔 Notifications](#-notifications)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)

## 🚀 Quick Start

```bash
# Clone repository
git clone [REPO_URL]
cd DreamGuide

# Install dependencies
npm install

# Start development server
npm start

# Platform-specific builds
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## 🏗️ Architecture

### Project Structure

```
DreamGuide/
├── app/                           # Expo Router screens
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx             # Dream creation form
│   │   ├── two.tsx               # Dreams list
│   │   ├── three.tsx             # Search functionality
│   │   ├── stats.tsx             # Statistics dashboard
│   │   ├── export.tsx            # Export features
│   │   └── settings.tsx          # Notification settings
│   ├── _layout.tsx               # Root layout
│   ├── +html.tsx                 # Web HTML template
│   └── +not-found.tsx            # 404 page
├── components/                    # Reusable components
│   ├── DreamForm.tsx             # Main form component
│   ├── DreamList.tsx             # Dreams listing
│   ├── ExportDreams.tsx          # Export functionality
│   ├── StatisticsScreen.tsx      # Stats visualization
│   ├── NotificationSettings.tsx  # Notification config
│   ├── ThemedCard.tsx            # Themed card wrapper
│   ├── ThemedScreen.tsx          # Themed screen wrapper
│   ├── ThemeProvider.tsx         # Theme context provider
│   ├── ThemeToggle.tsx           # Theme switcher
│   └── ScrollAwareScreen.tsx     # Scroll-aware container
├── constants/                     # App constants
│   └── AppConstants.ts           # Global constants
├── hooks/                         # Custom hooks
│   └── useAppTheme.ts            # Theme hook
├── services/                      # Business logic
│   └── dreamService.ts           # Dream CRUD operations
├── store/                         # State management
│   └── themeStore.ts             # Theme state (Zustand)
├── types/                         # TypeScript definitions
│   └── Dream.ts                  # Dream interfaces
├── utils/                         # Utility functions
│   └── dreamUtils.ts             # Dream-related utilities
├── assets/                        # Static assets
│   ├── fonts/                    # Custom fonts
│   └── images/                   # App icons and images
├── app.json                       # Expo configuration
├── package.json                   # Dependencies
└── tsconfig.json                  # TypeScript config
```

### Architectural Patterns

- **File-based Routing**: Expo Router for navigation
- **Component Composition**: Reusable, themed components
- **Custom Hooks**: Encapsulated business logic
- **Service Layer**: Data access abstraction
- **Type Safety**: Strict TypeScript configuration
- **Theme System**: Dynamic light/dark mode support

## 📊 Data Models

### Core Dream Interface

```typescript
interface Dream {
  // Core fields
  dreamText: string;                    // Dream description (required)
  isLucidDream: boolean;               // Lucid dream flag
  todayDate: string;                   // Dream date (ISO string)
  
  // Classification
  dreamType?: DreamType;               // Dream category
  overallTone?: ToneType;              // Emotional tone
  
  // Context
  location?: string;                   // Dream location
  characters?: string;                 // People in dream
  
  // Emotional data
  emotionBefore?: string[];            // Pre-sleep emotions
  emotionAfter?: string[];             // Post-dream emotions
  emotionalIntensity?: number;         // Scale 1-10
  
  // Quality metrics
  clarity?: number;                    // Dream clarity 1-10
  sleepQuality?: number;               // Sleep quality 1-10
  
  // Metadata
  keywords?: string[];                 // Search keywords
  personalMeaning?: string;            // User interpretation
  createdAt?: string;                  // Creation timestamp
  
  // Hashtags (dual format for compatibility)
  hashtags?: {                         // Legacy format
    hashtag1?: Hashtag;
    hashtag2?: Hashtag;
    hashtag3?: Hashtag;
  };
  hashtagsArray?: Hashtag[];          // New array format
}
```

### Type Definitions

```typescript
type DreamType = 'ordinary' | 'lucid' | 'nightmare' | 'premonitory' | 'fantasy';
type ToneType = 'positive' | 'neutral' | 'negative';

interface Hashtag {
  id: string;                          // Unique identifier
  label: string;                       // Display text
}

interface DreamStatistics {
  total: number;
  lucidCount: number;
  lucidPercentage: number;
  avgIntensity: number;
  avgClarity: number;
  dreamTypes: Record<DreamType, number>;
  emotions: {
    before: Record<string, number>;
    after: Record<string, number>;
  };
  keywords: Record<string, number>;
  sleepQuality: Record<string, number>;
  toneDistribution: Record<ToneType, number>;
}
```

## 🛠️ Tech Stack

### Core Framework
```json
{
  "react": "19.1.0",
  "react-native": "0.81.4",
  "expo": "~54.0.10",
  "typescript": "~5.9.2"
}
```

### Navigation & Routing
```json
{
  "expo-router": "~6.0.8",
  "@react-navigation/native": "^7.1.8"
}
```

### UI Components
```json
{
  "react-native-paper": "^5.14.5",
  "@expo/vector-icons": "^15.0.2",
  "react-native-reanimated": "~4.1.1",
  "expo-linear-gradient": "~15.0.7"
}
```

### State Management
```json
{
  "zustand": "^5.0.8",
  "@react-native-async-storage/async-storage": "2.2.0"
}
```

### Native Features
```json
{
  "expo-notifications": "~0.32.12",
  "expo-file-system": "~19.0.16",
  "expo-sharing": "~14.0.7",
  "expo-print": "~15.0.7",
  "@react-native-community/datetimepicker": "8.4.4",
  "@react-native-community/slider": "^5.0.1"
}
```

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator or Android Emulator

### Setup Process

```bash
# 1. Clone and navigate
git clone [REPO_URL]
cd DreamGuide

# 2. Install dependencies
npm install

# 3. Verify Expo setup
npx expo doctor

# 4. Start development server
npm start
```

## 🔧 Configuration

### Expo Configuration (`app.json`)

```json
{
  "expo": {
    "name": "Dreamguide",
    "slug": "Dreamguide",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "permissions": [
        "NOTIFICATIONS",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ]
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/icon.png",
          "color": "#6366F1"
        }
      ]
    ]
  }
}
```

### TypeScript Configuration

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 🎨 Theme System

### Theme Store (Zustand)

```typescript
// store/themeStore.ts
export type ThemeType = 'light' | 'dark';

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  setTheme: async (newTheme: ThemeType) => {
    await AsyncStorage.setItem('userTheme', newTheme);
    set({ theme: newTheme });
  },
  toggleTheme: async () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem('userTheme', newTheme);
    set({ theme: newTheme });
  }
}));
```

### Theme Colors

```typescript
// hooks/useAppTheme.ts
interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  card: string;
  border: string;
  accent: string;
  surface: string;
}

const THEME_COLORS: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    card: '#ffffff',
    border: '#e0e0e0',
    accent: '#000000',
    surface: '#f5f5f5'
  },
  dark: {
    background: '#000000',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    card: '#1a1a1a',
    border: '#333333',
    accent: '#ffffff',
    surface: '#1a1a1a'
  }
};
```

## 📱 Components

### DreamForm Component

Comprehensive form with 15+ fields:

```typescript
// Key features:
- Date/time picker with DateTimePicker
- Dream type selector with modal
- Multi-line text input for description
- Location and characters fields
- Emotion chips (before/after sleep)
- Quality sliders with dynamic colors
- Hashtag and keyword management
- Form validation and error handling
- AsyncStorage persistence
```

### Export System

Multi-format export capabilities:

```typescript
// Supported formats:
- PDF: Formatted document with Print API
- TXT: Plain text with structured layout
- CSV: Spreadsheet-compatible format
- JSON: Raw data for backup/migration

// Platform handling:
- Web: Direct download via blob URLs
- Mobile: Share API integration
- Error handling and validation
```

### Statistics Dashboard

Data visualization and analytics:

```typescript
// Metrics calculated:
- Total dreams and lucid percentage
- Average intensity, clarity, sleep quality
- Dream type distribution
- Emotion frequency analysis
- Keyword occurrence tracking
- Temporal trends
```

## 🔄 State Management

### Theme State (Zustand)

```typescript
// Persistent theme preferences
// Automatic system theme detection
// Smooth theme transitions
// AsyncStorage integration
```

### Local Component State

```typescript
// Form state management
// Search filters and results
// Modal visibility states
// Loading and error states
```

## 💾 Data Persistence

### AsyncStorage Service

```typescript
// services/dreamService.ts
export const getAllDreams = async (): Promise<Dream[]> => {
  const data = await AsyncStorage.getItem('dreamFormDataArray');
  return data ? JSON.parse(data) : [];
};

export const saveDream = async (dream: Dream): Promise<void> => {
  const existingDreams = await getAllDreams();
  existingDreams.push(dream);
  await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(existingDreams));
};

export const updateDream = async (index: number, updatedDream: Dream): Promise<void> => {
  const dreams = await getAllDreams();
  dreams[index] = updatedDream;
  await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(dreams));
};

export const deleteDream = async (index: number): Promise<void> => {
  const dreams = await getAllDreams();
  dreams.splice(index, 1);
  await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(dreams));
};
```

### Storage Keys

```typescript
export const STORAGE_KEYS = {
  DREAMS: 'dreamFormDataArray',
  THEME: 'userTheme'
} as const;
```

## 📤 Export System

### PDF Export

```typescript
// Uses expo-print for PDF generation
// HTML template with CSS styling
// Platform-specific sharing
// Error handling and validation
```

### Text Export

```typescript
// Structured plain text format
// Cross-platform compatibility
// Share API integration
// Blob handling for web
```

### CSV Export

```typescript
// Spreadsheet-compatible format
// Proper escaping and encoding
// Column headers and data mapping
// Excel/Google Sheets compatible
```

### JSON Export

```typescript
// Raw data backup format
// Complete data preservation
// Migration and import support
// Structured JSON with metadata
```

## 🔔 Notifications

### Configuration

```typescript
// expo-notifications integration
// Permission handling
// Scheduled notifications
// Platform-specific setup
```

### Implementation

```typescript
// Morning/evening reminders
// Custom notification messages
// Repeat scheduling
// Background notification handling
```

## 🧪 Testing

### Test Structure

```
__tests__/
├── components/           # Component tests
├── services/            # Service layer tests
├── utils/               # Utility function tests
└── hooks/               # Custom hook tests
```

### Testing Commands

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 🚀 Deployment

### Build Commands

```bash
# Development build
npx expo start

# Production builds
npx expo build:android
npx expo build:ios
npx expo build:web
```

### Platform Deployment

```bash
# App Store submission
npx expo submit --platform ios

# Play Store submission
npx expo submit --platform android

# Web deployment
npx expo export:web
```

### Environment Configuration

```bash
# Production environment variables
# Build optimization settings
# Platform-specific configurations
# Asset optimization
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

---

**DreamGuide** - Par Simon GODARD et Arthur Magès 🌙✨