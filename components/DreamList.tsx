import React, { useCallback, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, IconButton, TextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppTheme } from '../hooks/useAppTheme';
import { ThemedCard } from './ThemedCard';
import { STORAGE_KEYS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/AppConstants';
import { getDreamTypeIcon, getToneColor, formatShortDate, extractHashtags } from '../utils/dreamUtils';
import { updateDream, deleteDream as deleteDreamService } from '../services/dreamService';
import type { Dream } from '../types/Dream';

export default function DreamList() {
  const theme = useAppTheme();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const fetchDreams = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DREAMS);
      if (!data) {
        setDreams([]);
        return;
      }
      
      const dreamFormDataArray: Dream[] = JSON.parse(data);
      if (!Array.isArray(dreamFormDataArray)) {
        setDreams([]);
        return;
      }
      
      const validDreams = dreamFormDataArray.filter(dream => 
        dream && typeof dream === 'object' && dream.dreamText?.trim()
      );
      setDreams(validDreams);
    } catch {
      console.error('Failed to load dreams');
      setDreams([]);
    }
  };

  const memoizedFetchDreams = useCallback(() => {
    fetchDreams();
  }, []);

  useFocusEffect(memoizedFetchDreams);

  const handleDeleteDream = async (index: number) => {
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
              await deleteDreamService(index);
              await fetchDreams();
              Alert.alert('Succès', 'Rêve supprimé');
            } catch {
              console.error('Failed to delete dream');
              Alert.alert('Erreur', 'Impossible de supprimer le rêve');
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

  const saveEdit = async () => {
    if (editingIndex === null || !editingDream) return;

    try {
      if (!editingDream?.dreamText?.trim()) {
        Alert.alert('Erreur', 'La description du rêve est requise');
        return;
      }
      
      await updateDream(editingIndex, editingDream);
      await fetchDreams();
      setEditingIndex(null);
      setEditingDream(null);
      Alert.alert('Succès', 'Rêve modifié');
    } catch {
      console.error('Failed to update dream');
      Alert.alert('Erreur', 'Impossible de modifier le rêve');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingDream(null);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderDreamCard = (dream: Dream, index: number) => {
    const isExpanded = expandedIndex === index;
    const dreamIcon = getDreamTypeIcon(dream.dreamType || 'ordinary');
    const toneColor = getToneColor(dream.overallTone || 'neutral');
    const chipTextStyle = { color: theme.text };
    const dreamHashtags = extractHashtags(dream);

    return (
      <ThemedCard key={index} style={[styles.dreamCard, { borderLeftColor: toneColor, borderLeftWidth: 4 }]}>
        <View style={{ padding: 16 }}>
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
                onPress={() => handleDeleteDream(index)}
              />
            </View>
          </View>

          <Text style={[styles.dreamText, { color: theme.text }]} numberOfLines={isExpanded ? undefined : 3}>
            {dream.dreamText}
          </Text>

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
                  <Text style={[styles.detailText, { color: theme.text }]}>{dream.sleepQuality}/10</Text>
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

              {dreamHashtags.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>#️⃣ Hashtags:</Text>
                  <View style={styles.emotionChips}>
                    {dreamHashtags.map((hashtag, i) => (
                      <Chip key={i} compact style={styles.hashtagChip} textStyle={chipTextStyle}>
                        #{hashtag}
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
        </View>
      </ThemedCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {dreams.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              Aucun rêve enregistré pour le moment.
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Commencez par créer votre premier rêve !
            </Text>
          </View>
        ) : (
          dreams.map((dream, index) => renderDreamCard(dream, index))
        )}
      </ScrollView>

      <Modal
        visible={editingIndex !== null}
        animationType="slide"
        transparent
        onRequestClose={cancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Modifier le rêve</Text>
            
            <TextInput
              value={editingDream?.dreamText || ''}
              onChangeText={(text) => setEditingDream(prev => prev ? { ...prev, dreamText: text } : null)}
              mode="outlined"
              multiline
              numberOfLines={6}
              placeholder="Description du rêve..."
              style={styles.editInput}
            />
            
            <View style={styles.modalButtons}>
              <Button mode="outlined" onPress={cancelEdit} style={styles.modalButton}>
                Annuler
              </Button>
              <Button mode="contained" onPress={saveEdit} style={styles.modalButton}>
                Sauvegarder
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  dreamCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    fontSize: 24,
    marginRight: 12,
  },
  dreamDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dreamLocation: {
    fontSize: 14,
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
    marginBottom: 8,
  },
  metaChip: {
    marginRight: 8,
  },
  expandedContent: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 8,
  },
  detailSection: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emotionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  emotionChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  keywordChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  hashtagChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  editInput: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});