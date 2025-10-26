import React, { useCallback, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, IconButton, TextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppTheme } from '../hooks/useAppTheme';
import { ThemedCard } from './ThemedCard';
import { STORAGE_KEYS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/AppConstants';
import { getDreamTypeIcon, getToneColor, formatShortDate, extractHashtags } from '../utils/dreamUtils';
import type { Dream } from '../types/Dream';

export default function DreamList() {
  const theme = useAppTheme();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Chargement des rêves depuis AsyncStorage
  const fetchDreams = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DREAMS);
      const dreamFormDataArray: Dream[] = data ? JSON.parse(data) : [];
      const validDreams = dreamFormDataArray.filter(dream => dream?.dreamText?.trim());
      setDreams(validDreams);
    } catch (error) {
      console.error('Erreur lors du chargement des rêves');
      setDreams([]);
      // Notification utilisateur en cas d'erreur critique
      Alert.alert('Erreur', 'Impossible de charger les rêves. Veuillez redémarrer l\'application.');
    }
  };

  const memoizedFetchDreams = useCallback(() => {
    try {
      fetchDreams();
    } catch (error) {
      console.error('Erreur lors du chargement des rêves');
      setDreams([]);
    }
  }, []);

  useFocusEffect(memoizedFetchDreams);

  // Suppression avec confirmation utilisateur
  const deleteDream = async (index: number) => {
    Alert.alert(
      'Supprimer le rêve',
      'Es-tu sûr de vouloir supprimer ce rêve ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const data = await AsyncStorage.getItem(STORAGE_KEYS.DREAMS);
              const dreamFormDataArray: Dream[] = data ? JSON.parse(data) : [];
              dreamFormDataArray.splice(index, 1);
              await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreamFormDataArray));
              fetchDreams();
              Alert.alert('Succès', SUCCESS_MESSAGES.DREAM_DELETED);
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', ERROR_MESSAGES.DELETE_ERROR);
              // Recharger les données pour s'assurer de la cohérence
              fetchDreams();
            }
          },
        },
      ]
    );
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingDream({ ...dreams[index] });
  };

  // Sauvegarde des modifications en mode édition
  const saveEdit = async () => {
    if (editingIndex === null || !editingDream) return;

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DREAMS);
      const dreamFormDataArray: Dream[] = data ? JSON.parse(data) : [];
      dreamFormDataArray[editingIndex] = editingDream;
      await AsyncStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreamFormDataArray));
      fetchDreams();
      setEditingIndex(null);
      setEditingDream(null);
      Alert.alert('Succès', SUCCESS_MESSAGES.DREAM_UPDATED);
    } catch (error) {
      console.error('Erreur lors de la modification');
      Alert.alert('Erreur', ERROR_MESSAGES.SAVE_ERROR);
      // Recharger les données pour maintenir la cohérence
      fetchDreams();
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingDream(null);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Rendu d'une carte de rêve avec expansion/collapse et actions
  const renderDreamCard = (dream: Dream, index: number) => {
    const isExpanded = expandedIndex === index;
    const dreamIcon = getDreamTypeIcon(dream.dreamType || 'ordinary');
    const toneColor = getToneColor(dream.overallTone || 'neutral');
    const chipTextStyle = { color: theme.text };
    const dreamHashtags = extractHashtags(dream);

    return (
      <ThemedCard key={index} style={[styles.dreamCard, { borderLeftColor: toneColor, borderLeftWidth: 4 }]}>
        <View style={{ padding: 16 }}>
          {/* En-tête: icône, date, lieu, actions */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={[styles.dreamIcon, { color: theme.text }]}>{dreamIcon}</Text>
              <View>
                <Text style={[styles.dreamDate, { color: theme.text }]}>
                  {formatShortDate(dream.todayDate)}
                </Text>
                {dream.location && (
                  <Text style={[styles.dreamLocation, { color: theme.text }]}>📍 {dream.location}</Text>
                )}
              </View>
            </View>
            <View style={styles.headerRight}>
              <IconButton
                icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                onPress={() => toggleExpand(index)}
                iconColor={theme.text}
              />
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => startEditing(index)}
                iconColor={theme.text}
              />
              <IconButton
                icon="delete"
                size={20}
                iconColor="#ff4444"
                onPress={() => deleteDream(index)}
              />
            </View>
          </View>

          {/* Contenu principal du rêve */}
          <Text style={[styles.dreamText, { color: theme.text }]} numberOfLines={isExpanded ? undefined : 3}>
            {dream.dreamText}
          </Text>

          {/* Chips intensité/clarté */}
          <View style={styles.quickMeta}>
            {dream.emotionalIntensity && (
              <Chip icon="lightning-bolt" compact style={styles.metaChip} textStyle={chipTextStyle}>
                Intensité: {dream.emotionalIntensity}/10
              </Chip>
            )}
            {dream.clarity && (
              <Chip icon="eye" compact style={styles.metaChip} textStyle={chipTextStyle}>
                Clarté: {dream.clarity}/10
              </Chip>
            )}
          </View>

          {/* Section détails (personnages, émotions, etc.) */}
          {isExpanded && (
            <View style={[styles.expandedContent, { borderTopColor: theme.border }]}>

              {dream.characters && (
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>👥 Personnages:</Text>
                  <Text style={[styles.detailText, { color: theme.text }]}>{dream.characters}</Text>
                </View>
              )}


              {dream.emotionBefore && dream.emotionBefore.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>😴 Avant le rêve:</Text>
                  <View style={styles.emotionChips}>
                    {dream.emotionBefore.map((emotion, i) => (
                      <Chip key={i} compact style={styles.emotionChip} textStyle={chipTextStyle}>
                        {emotion}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}


              {dream.emotionAfter && dream.emotionAfter.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>😊 Après le rêve:</Text>
                  <View style={styles.emotionChips}>
                    {dream.emotionAfter.map((emotion, i) => (
                      <Chip key={i} compact style={styles.emotionChip} textStyle={chipTextStyle}>
                        {emotion}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}


              {dream.sleepQuality && (
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>😴 Sommeil:</Text>
                  <Text style={[styles.detailText, { color: theme.text }]}>{dream.sleepQuality}</Text>
                </View>
              )}


              {dream.keywords && dream.keywords.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>🏷️ Mots-clés:</Text>
                  <View style={styles.emotionChips}>
                    {dream.keywords.map((keyword, i) => (
                      <Chip key={i} compact style={styles.keywordChip} textStyle={chipTextStyle}>
                        {keyword}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}


              {dream.personalMeaning && (
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>💭 Signification:</Text>
                  <Text style={[styles.detailText, { color: theme.text }]}>{dream.personalMeaning}</Text>
                </View>
              )}
            </View>
          )}

          {/* Hashtags en bas de carte */}
          <View style={styles.hashtagsContainer}>
            {dreamHashtags.map((hashtag, i) => (
              <Chip 
                key={`hashtag-${i}`} 
                compact 
                style={styles.hashtag} 
                textStyle={chipTextStyle}
              >
                #{hashtag}
              </Chip>
            ))}
          </View>
        </View>
      </ThemedCard>
    );
  };

  return (
    <>
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {dreams.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌙</Text>
            <Text style={[styles.emptyText, { color: theme.text }]}>Aucun rêve enregistré</Text>
            <Text style={[styles.emptySubtext, { color: theme.text }]}>
              Allez dans l'onglet "Nouveau Rêve" pour commencer votre journal
            </Text>
          </View>
        ) : (
          dreams.map((dream, index) => renderDreamCard(dream, index))
        )}
      </ScrollView>

      {/* Modal d'édition rapide des champs principaux */}
      <Modal
        visible={editingIndex !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={cancelEdit}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Modifier le rêve</Text>
            <ScrollView>
              {editingDream && (
                <>
                  <TextInput
                    label="Description du rêve"
                    value={editingDream.dreamText}
                    onChangeText={(text) => setEditingDream({ ...editingDream, dreamText: text })}
                    mode="outlined"
                    multiline
                    numberOfLines={6}
                    style={[styles.modalInput, { backgroundColor: theme.card }]}
                    outlineColor={theme.border}
                    activeOutlineColor={theme.accent}
                    textColor={theme.text}
                    theme={{
                      colors: {
                        background: theme.card,
                        onSurfaceVariant: theme.text,
                      }
                    }}
                  />
                  <TextInput
                    label="Lieu"
                    value={editingDream.location || ''}
                    onChangeText={(text) => setEditingDream({ ...editingDream, location: text })}
                    mode="outlined"
                    style={[styles.modalInput, { backgroundColor: theme.card }]}
                    outlineColor={theme.border}
                    activeOutlineColor={theme.accent}
                    textColor={theme.text}
                    theme={{
                      colors: {
                        background: theme.card,
                        onSurfaceVariant: theme.text,
                      }
                    }}
                  />
                  <TextInput
                    label="Personnages"
                    value={editingDream.characters || ''}
                    onChangeText={(text) => setEditingDream({ ...editingDream, characters: text })}
                    mode="outlined"
                    style={[styles.modalInput, { backgroundColor: theme.card }]}
                    outlineColor={theme.border}
                    activeOutlineColor={theme.accent}
                    textColor={theme.text}
                    theme={{
                      colors: {
                        background: theme.card,
                        onSurfaceVariant: theme.text,
                      }
                    }}
                  />
                  <TextInput
                    label="Signification personnelle"
                    value={editingDream.personalMeaning || ''}
                    onChangeText={(text) => setEditingDream({ ...editingDream, personalMeaning: text })}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={[styles.modalInput, { backgroundColor: theme.card }]}
                    outlineColor={theme.border}
                    activeOutlineColor={theme.accent}
                    textColor={theme.text}
                    theme={{
                      colors: {
                        background: theme.card,
                        onSurfaceVariant: theme.text,
                      }
                    }}
                  />
                </>
              )}
            </ScrollView>
            <View style={styles.modalButtons}>
              <Button mode="outlined" onPress={cancelEdit} style={styles.modalButton}>
                Annuler
              </Button>
              <Button mode="contained" onPress={saveEdit} style={styles.modalButton}>
                Enregistrer
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  dreamCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dreamIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  dreamDate: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dreamLocation: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  dreamText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  quickMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metaChip: {
    opacity: 0.8,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  detailSection: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  emotionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  emotionChip: {
    opacity: 0.8,
  },
  keywordChip: {
    opacity: 0.8,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  hashtag: {
    opacity: 0.8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});