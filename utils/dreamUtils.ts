/**
 * Utilitaires pour la gestion des rêves
 */

import { SLEEP_QUALITY_LABELS, EMOTIONAL_INTENSITY_LABELS, CLARITY_LABELS, DREAM_TYPES, TONE_TYPES } from '../constants/AppConstants';
import type { Dream, DreamType, ToneType } from '../types/Dream';

/**
 * Génère un ID unique pour un hashtag basé sur son label et un timestamp
 */
export const generateHashtagId = (label: string): string => {
  return `${label}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Retourne le label de qualité du sommeil basé sur la valeur numérique
 */
export const getSleepQualityLabel = (value: number): string => {
  const clampedValue = Math.max(1, Math.min(10, Math.round(value))) as keyof typeof SLEEP_QUALITY_LABELS;
  return SLEEP_QUALITY_LABELS[clampedValue];
};

/**
 * Retourne le label d'intensité émotionnelle basé sur la valeur numérique
 */
export const getEmotionalIntensityLabel = (value: number): string => {
  const clampedValue = Math.max(1, Math.min(10, Math.round(value))) as keyof typeof EMOTIONAL_INTENSITY_LABELS;
  return EMOTIONAL_INTENSITY_LABELS[clampedValue];
};

/**
 * Retourne le label de clarté basé sur la valeur numérique
 */
export const getClarityLabel = (value: number): string => {
  const clampedValue = Math.max(1, Math.min(10, Math.round(value))) as keyof typeof CLARITY_LABELS;
  return CLARITY_LABELS[clampedValue];
};

/**
 * Retourne l'icône correspondant au type de rêve
 */
export const getDreamTypeIcon = (type: DreamType): string => {
  return DREAM_TYPES[type]?.icon || DREAM_TYPES.ordinary.icon;
};

/**
 * Retourne le label correspondant au type de rêve
 */
export const getDreamTypeLabel = (type: DreamType): string => {
  return DREAM_TYPES[type]?.label || DREAM_TYPES.ordinary.label;
};

/**
 * Retourne la couleur correspondant à la tonalité
 */
export const getToneColor = (tone: ToneType): string => {
  return TONE_TYPES[tone]?.color || TONE_TYPES.neutral.color;
};

/**
 * Retourne le label correspondant à la tonalité
 */
export const getToneLabel = (tone: ToneType): string => {
  return TONE_TYPES[tone]?.label || TONE_TYPES.neutral.label;
};

/**
 * Formate une date en chaîne lisible en français
 */
export const formatDreamDate = (dateString: string): string => {
  if (!dateString || typeof dateString !== 'string') {
    console.warn('Invalid date string provided');
    return 'Date invalide';
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error');
    return 'Date invalide';
  }
};

/**
 * Formate une date courte pour l'affichage dans les listes
 */
export const formatShortDate = (dateString: string): string => {
  if (!dateString || typeof dateString !== 'string') {
    console.warn('Invalid date string provided');
    return 'Date invalide';
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Short date formatting error');
    return 'Date invalide';
  }
};

/**
 * Extrait tous les hashtags d'un rêve (ancien et nouveau format)
 */
export const extractHashtags = (dream: Dream): string[] => {
  const hashtags: string[] = [];

  // Nouveau format (array)
  if (dream.hashtagsArray && Array.isArray(dream.hashtagsArray)) {
    dream.hashtagsArray.forEach(h => {
      if (h?.label) hashtags.push(h.label);
    });
  } else {
    // Ancien format (objet)
    if (dream.hashtags?.hashtag1?.label) hashtags.push(dream.hashtags.hashtag1.label);
    if (dream.hashtags?.hashtag2?.label) hashtags.push(dream.hashtags.hashtag2.label);
    if (dream.hashtags?.hashtag3?.label) hashtags.push(dream.hashtags.hashtag3.label);
  }

  return hashtags.filter(Boolean);
};

/**
 * Valide qu'un rêve contient les données minimales requises
 */
export const validateDream = (dream: Partial<Dream>): boolean => {
  return Boolean(dream.dreamText && dream.dreamText.trim().length > 0);
};

/**
 * Nettoie et valide une liste de hashtags
 */
export const cleanHashtags = (hashtags: string[]): string[] => {
  return hashtags
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, 10); // Limite à 10 hashtags maximum
};

/**
 * Nettoie et valide une liste de mots-clés
 */
export const cleanKeywords = (keywordsString: string): string[] => {
  if (!keywordsString) return [];
  
  return keywordsString
    .split(',')
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0)
    .slice(0, 20); // Limite à 20 mots-clés maximum
};

/**
 * Calcule le pourcentage de rêves lucides
 */
export const calculateLucidPercentage = (dreams: Dream[]): number => {
  if (dreams.length === 0) return 0;
  
  const lucidCount = dreams.filter(dream => dream.isLucidDream).length;
  return Math.round((lucidCount / dreams.length) * 100);
};

/**
 * Calcule la moyenne d'une propriété numérique des rêves
 */
export const calculateAverage = (dreams: Dream[], property: keyof Dream): number => {
  try {
    if (!Array.isArray(dreams) || dreams.length === 0) return 0;
    
    const values = dreams
      .map(dream => dream[property])
      .filter((value): value is number => typeof value === 'number' && !isNaN(value) && isFinite(value));
    
    if (values.length === 0) return 0;
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    
    if (!isFinite(average)) return 0;
    
    return Math.round(average * 10) / 10;
  } catch (error) {
    console.error('Average calculation error');
    return 0;
  }
};