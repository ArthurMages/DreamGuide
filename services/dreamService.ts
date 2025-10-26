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
    const dreams: Dream[] = data ? JSON.parse(data) : [];
    return dreams.filter(dream => dream?.dreamText?.trim());
  } catch (error) {
    console.error('Erreur lors de la récupération des rêves:', error);
    return [];
  }
};

/**
 * Sauvegarde un nouveau rêve
 */
export const saveDream = async (dream: Dream): Promise<void> => {
  try {
    const existingDreams = await getAllDreams();
    existingDreams.push(dream);
    await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(existingDreams));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du rêve');
    // Vérifier l'intégrité des données avant de lever l'erreur
    if (error instanceof Error && error.message.includes('storage')) {
      throw new Error('Espace de stockage insuffisant');
    }
    throw new Error('Impossible de sauvegarder le rêve');
  }
};

/**
 * Met à jour un rêve existant
 */
export const updateDream = async (index: number, updatedDream: Dream): Promise<void> => {
  try {
    const dreams = await getAllDreams();
    if (index >= 0 && index < dreams.length) {
      dreams[index] = updatedDream;
      await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreams));
    } else {
      throw new Error('Index de rêve invalide');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rêve');
    // Vérifier si l'erreur est due à un index invalide
    if (error instanceof Error && error.message.includes('Index')) {
      throw error; // Propager l'erreur d'index
    }
    throw new Error('Impossible de mettre à jour le rêve');
  }
};

/**
 * Supprime un rêve
 */
export const deleteDream = async (index: number): Promise<void> => {
  try {
    const dreams = await getAllDreams();
    if (index >= 0 && index < dreams.length) {
      dreams.splice(index, 1);
      await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreams));
    } else {
      throw new Error('Index de rêve invalide');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du rêve');
    // Vérifier si l'erreur est due à un index invalide
    if (error instanceof Error && error.message.includes('Index')) {
      throw error; // Propager l'erreur d'index
    }
    throw new Error('Impossible de supprimer le rêve');
  }
};