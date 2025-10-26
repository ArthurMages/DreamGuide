/**
 * Service pour la gestion des rêves dans le stockage local
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/AppConstants';
import type { Dream } from '@/types/Dream';

/**
 * Récupère tous les rêves depuis le stockage local
 */
export const getAllDreams = async (): Promise<Dream[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DREAMS);
    if (!data) return [];
    
    const dreams: Dream[] = JSON.parse(data);
    if (!Array.isArray(dreams)) {
      throw new Error('Invalid dreams data format');
    }
    
    return dreams.filter(dream => dream?.dreamText?.trim());
  } catch {
    console.error('Failed to retrieve dreams');
    return [];
  }
};

/**
 * Sauvegarde un nouveau rêve
 */
export const saveDream = async (dream: Dream): Promise<void> => {
  if (!dream || !dream.dreamText?.trim()) {
    throw new Error('Invalid dream data');
  }
  
  try {
    const existingDreams = await getAllDreams();
    const updatedDreams = [...existingDreams, dream];
    await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(updatedDreams));
  } catch (error) {
    console.error('Failed to save dream');
    if (error instanceof Error && error.message.includes('storage')) {
      throw new Error('Insufficient storage space');
    }
    throw new Error('Failed to save dream');
  }
};

/**
 * Met à jour un rêve existant
 */
export const updateDream = async (index: number, updatedDream: Dream): Promise<void> => {
  if (!updatedDream || !updatedDream.dreamText?.trim()) {
    throw new Error('Invalid dream data');
  }
  
  try {
    const dreams = await getAllDreams();
    if (index < 0 || index >= dreams.length) {
      throw new Error('Invalid dream index');
    }
    
    const updatedDreams = [...dreams];
    updatedDreams[index] = updatedDream;
    await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(updatedDreams));
  } catch (error) {
    console.error('Failed to update dream');
    if (error instanceof Error && error.message.includes('Invalid')) {
      throw error;
    }
    throw new Error('Failed to update dream');
  }
};

/**
 * Supprime un rêve
 */
export const deleteDream = async (index: number): Promise<void> => {
  try {
    const dreams = await getAllDreams();
    if (index < 0 || index >= dreams.length) {
      throw new Error('Invalid dream index');
    }
    
    const updatedDreams = dreams.filter((_, i) => i !== index);
    await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(updatedDreams));
  } catch (error) {
    console.error('Failed to delete dream');
    if (error instanceof Error && error.message.includes('Invalid')) {
      throw error;
    }
    throw new Error('Failed to delete dream');
  }
};