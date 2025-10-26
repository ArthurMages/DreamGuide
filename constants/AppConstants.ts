/**
 * Constantes globales de l'application DreamGuide
 */

/**
 * Clés de stockage AsyncStorage
 */
export const STORAGE_KEYS = {
  DREAMS: 'dreamFormDataArray',
  THEME: 'userTheme',
} as const;

/**
 * Types de rêves disponibles avec leurs icônes et labels
 */
export const DREAM_TYPES = {
  ordinary: { icon: '💭', label: 'Ordinaire' },
  lucid: { icon: '✨', label: 'Lucide' },
  nightmare: { icon: '😱', label: 'Cauchemar' },
  premonitory: { icon: '🔮', label: 'Prémonitoire' },
  fantasy: { icon: '🌈', label: 'Fantastique' },
} as const;

/**
 * Tonalités disponibles pour les rêves
 */
export const TONE_TYPES = {
  positive: { icon: '😊', label: 'Positive', color: '#4CAF50' },
  neutral: { icon: '😐', label: 'Neutre', color: '#9E9E9E' },
  negative: { icon: '😔', label: 'Négative', color: '#F44336' },
} as const;

/**
 * Émotions prédéfinies pour les rêves
 */
export const EMOTIONS = [
  'Joie',
  'Tristesse', 
  'Peur',
  'Colère',
  'Anxiété',
  'Paix',
  'Excitation',
  'Confusion',
  'Amour',
  'Nostalgie',
] as const;

/**
 * Labels pour la qualité du sommeil
 */
export const SLEEP_QUALITY_LABELS = {
  1: 'Cauchemar',
  2: 'Cauchemar',
  3: 'Très mauvaise',
  4: 'Très mauvaise',
  5: 'Moyenne',
  6: 'Moyenne',
  7: 'Bonne',
  8: 'Bonne',
  9: 'Beaux rêves',
  10: 'Beaux rêves',
} as const;

/**
 * Labels pour l'intensité émotionnelle
 */
export const EMOTIONAL_INTENSITY_LABELS = {
  1: 'Très faible',
  2: 'Faible',
  3: 'Légère',
  4: 'Modérée',
  5: 'Normale',
  6: 'Élevée',
  7: 'Forte',
  8: 'Très forte',
  9: 'Intense',
  10: 'Extrême',
} as const;

/**
 * Labels pour la clarté du rêve
 */
export const CLARITY_LABELS = {
  1: 'Très floue',
  2: 'Floue',
  3: 'Confuse',
  4: 'Peu claire',
  5: 'Moyenne',
  6: 'Assez claire',
  7: 'Claire',
  8: 'Très claire',
  9: 'Cristalline',
  10: 'Parfaitement nette',
} as const;

/**
 * Configuration des sliders
 */
export const SLIDER_CONFIG = {
  MIN_VALUE: 1,
  MAX_VALUE: 10,
  STEP: 1,
} as const;

/**
 * Messages d'erreur standardisés
 */
export const ERROR_MESSAGES = {
  EMPTY_DREAM: 'Veuillez décrire votre rêve',
  SAVE_ERROR: 'Impossible de sauvegarder le rêve',
  LOAD_ERROR: 'Erreur lors de la récupération des données',
  DELETE_ERROR: 'Impossible de supprimer le rêve',
  EXPORT_ERROR: 'Impossible d\'exporter les rêves',
  NO_DREAMS: 'Aucun rêve à exporter',
} as const;

/**
 * Messages de succès standardisés
 */
export const SUCCESS_MESSAGES = {
  DREAM_SAVED: 'Rêve enregistré avec succès ! 🌙',
  DREAM_UPDATED: 'Rêve modifié avec succès',
  DREAM_DELETED: 'Rêve supprimé',
  EXPORT_SUCCESS: 'Export réussi !',
  PDF_EXPORT_SUCCESS: 'Export PDF réussi ! 📄',
  JSON_EXPORT_SUCCESS: 'Export JSON réussi !',
  CSV_EXPORT_SUCCESS: 'Export CSV réussi !',
} as const;