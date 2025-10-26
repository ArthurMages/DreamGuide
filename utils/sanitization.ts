/**
 * Utility functions for input sanitization and validation
 */

/**
 * Sanitizes text input to prevent XSS attacks
 */
export const sanitizeText = (text: string, maxLength = 1000): string => {
  try {
    if (typeof text !== 'string') return '';
    
    return text
      .replace(/[<>\"'&\r\n\t]/g, '') // Remove dangerous characters
      .slice(0, maxLength)
      .trim();
  } catch (error) {
    console.error('Text sanitization failed:', error instanceof Error ? error.message : 'Unknown error');
    return '';
  }
};

/**
 * Validates and sanitizes dream text input
 */
export const sanitizeDreamText = (text: string): string => {
  return sanitizeText(text, 5000); // Allow longer text for dream descriptions
};

/**
 * Validates and sanitizes notification text
 */
export const sanitizeNotificationText = (text: string): string => {
  return sanitizeText(text, 200); // Shorter limit for notifications
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates time format (HH:MM)
 */
export const isValidTimeFormat = (time: string): boolean => {
  try {
    if (typeof time !== 'string') return false;
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  } catch (error) {
    console.error('Time validation failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
};

/**
 * Validates numeric input within range
 */
export const validateNumericRange = (value: number, min: number, max: number): boolean => {
  return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
};

/**
 * Sanitizes array of strings
 */
export const sanitizeStringArray = (arr: unknown, maxItems = 50): string[] => {
  if (!Array.isArray(arr)) return [];
  
  return arr
    .filter((item): item is string => typeof item === 'string')
    .map(item => sanitizeText(item, 100))
    .filter(item => item.length > 0)
    .slice(0, maxItems);
};