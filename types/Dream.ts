/**
 * Types et interfaces pour les rêves dans l'application DreamGuide
 */

/**
 * Structure d'un hashtag
 */
export interface Hashtag {
  id: string;
  label: string;
}

/**
 * Types de rêves disponibles
 */
export type DreamType = 'ordinary' | 'lucid' | 'nightmare' | 'premonitory' | 'fantasy';

/**
 * Tonalités possibles pour un rêve
 */
export type ToneType = 'positive' | 'neutral' | 'negative';

/**
 * Structure complète d'un rêve
 */
export interface Dream {
  // Champs de base (compatibilité avec l'ancien format)
  dreamText: string;
  isLucidDream: boolean;
  todayDate: string;
  hashtags: {
    hashtag1?: Hashtag;
    hashtag2?: Hashtag;
    hashtag3?: Hashtag;
  };

  // Champs étendus
  dreamType?: DreamType;
  emotionBefore?: string[];
  emotionAfter?: string[];
  characters?: string;
  location?: string;
  emotionalIntensity?: number;
  clarity?: number;
  keywords?: string[];
  sleepQuality?: number;
  personalMeaning?: string;
  overallTone?: ToneType;
  createdAt?: string;
  
  // Nouveau format de hashtags (array)
  hashtagsArray?: Hashtag[];
}

/**
 * Données de formulaire pour créer/modifier un rêve
 */
export interface DreamFormData extends Omit<Dream, 'todayDate' | 'createdAt'> {
  dreamDate: Date;
}

/**
 * Statistiques calculées sur les rêves
 */
export interface DreamStatistics {
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

/**
 * Filtres pour la recherche de rêves
 */
export interface DreamFilters {
  searchQuery: string;
  dreamType: DreamType | 'all';
  tone: ToneType | 'all';
  emotions: string[];
}