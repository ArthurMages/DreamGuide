import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, Button, Chip, IconButton, Card } from 'react-native-paper';

interface Hashtag {
  id: string;
  label: string;
}

interface Dream {
  dreamText: string;
  isLucidDream: boolean;
  todayDate: string;
  hashtags: {
    hashtag1: Hashtag;
    hashtag2: Hashtag;
    hashtag3: Hashtag;
  };
  dreamType?: string;
  emotionBefore?: string[];
  emotionAfter?: string[];
  characters?: string;
  location?: string;
  emotionalIntensity?: number;
  clarity?: number;
  keywords?: string[];
  sleepQuality?: string;
  personalMeaning?: string;
  overallTone?: string;
}

const DREAM_TYPE_ICONS: { [key: string]: string } = {
  ordinary: '💭',
  lucid: '✨',
  nightmare: '😱',
  premonitory: '🔮',
  fantasy: '🌈',
};

const TONE_COLORS: { [key: string]: string } = {
  positive: '#4CAF50',
  neutral: '#9E9E9E',
  negative: '#F44336',
};

export default function DreamList() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const fetchDreams = async () => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreamFormDataArray: Dream[] = data ? JSON.parse(data) : [];
      const validDreams = dreamFormDataArray.filter(dream => dream && dream.dreamText);
      setDreams(validDreams);
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      setDreams([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDreams();
    }, [])
  );

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
              const data = await AsyncStorage.getItem('dreamFormDataArray');
              const dreamFormDataArray: Dream[] = data ? JSON.parse(data) : [];
              dreamFormDataArray.splice(index, 1);
              await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(dreamFormDataArray));
              fetchDreams();
              Alert.alert('Succès', 'Rêve supprimé');
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
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
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreamFormDataArray: Dream[] = data ? JSON.parse(data) : [];
      dreamFormDataArray[editingIndex] = editingDream;
      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(dreamFormDataArray));
      fetchDreams();
      setEditingIndex(null);
      setEditingDream(null);
      Alert.alert('Succès', 'Rêve modifié avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
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
    const dreamIcon = DREAM_TYPE_ICONS[dream.dreamType || 'ordinary'] || '💭';
    const toneColor = TONE_COLORS[dream.overallTone || 'neutral'];

    return (
      <Card key={index} style={[styles.dreamCard, { borderLeftColor: toneColor, borderLeftWidth: 4 }]}>
        <Card.Content>
          {/* En-tête */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.dreamIcon}>{dreamIcon}</Text>
              <View>
                <Text style={styles.dreamDate}>
                  {new Date(dream.todayDate).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Text>
                {dream.location && (
                  <Text style={styles.dreamLocation}>📍 {dream.location}</Text>
                )}
              </View>
            </View>
            <View style={styles.headerRight}>
              <IconButton
                icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                onPress={() => toggleExpand(index)}
              />
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => startEditing(index)}
              />
              <IconButton
                icon="delete"
                size={20}
                iconColor="#ff4444"
                onPress={() => deleteDream(index)}
              />
            </View>
          </View>

          {/* Texte du rêve - CORRECTION ICI */}
          <Text style={styles.dreamText} numberOfLines={isExpanded ? undefined : 3}>
            {dream.dreamText}
          </Text>

          {/* Métadonnées rapides */}
          <View style={styles.quickMeta}>
            {dream.emotionalIntensity && (
              <Chip icon="lightning-bolt" compact style={styles.metaChip} textStyle={{ color: '#1a1a1a' }}>
                Intensité: {dream.emotionalIntensity}/10
              </Chip>
            )}
            {dream.clarity && (
              <Chip icon="eye" compact style={styles.metaChip} textStyle={{ color: '#1a1a1a' }}>
                Clarté: {dream.clarity}/10
              </Chip>
            )}
          </View>

          {/* Détails expandables */}
          {isExpanded && (
            <View style={styles.expandedContent}>
              {/* Personnages */}
              {dream.characters && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>👥 Personnages:</Text>
                  <Text style={styles.detailText}>{dream.characters}</Text>
                </View>
              )}

              {/* Émotions avant */}
              {dream.emotionBefore && dream.emotionBefore.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>😴 Avant le rêve:</Text>
                  <View style={styles.emotionChips}>
                    {dream.emotionBefore.map((emotion, i) => (
                      <Chip key={i} compact style={styles.emotionChip} textStyle={{ color: '#1a1a1a' }}>
                        {emotion}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}

              {/* Émotions après */}
              {dream.emotionAfter && dream.emotionAfter.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>😊 Après le rêve:</Text>
                  <View style={styles.emotionChips}>
                    {dream.emotionAfter.map((emotion, i) => (
                      <Chip key={i} compact style={styles.emotionChip} textStyle={{ color: '#1a1a1a' }}>
                        {emotion}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}

              {/* Qualité du sommeil */}
              {dream.sleepQuality && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>😴 Sommeil:</Text>
                  <Text style={styles.detailText}>{dream.sleepQuality}</Text>
                </View>
              )}

              {/* Mots-clés */}
              {dream.keywords && dream.keywords.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>🏷️ Mots-clés:</Text>
                  <View style={styles.emotionChips}>
                    {dream.keywords.map((keyword, i) => (
                      <Chip key={i} compact style={styles.keywordChip} textStyle={{ color: '#1a1a1a' }}>
                        {keyword}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}

              {/* Signification personnelle */}
              {dream.personalMeaning && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>💭 Signification:</Text>
                  <Text style={styles.detailText}>{dream.personalMeaning}</Text>
                </View>
              )}
            </View>
          )}

          {/* Hashtags */}
          <View style={styles.hashtagsContainer}>
            {dream.hashtags?.hashtag1?.label && (
              <Chip compact style={styles.hashtag} textStyle={{ color: '#1a1a1a' }}>#{dream.hashtags.hashtag1.label}</Chip>
            )}
            {dream.hashtags?.hashtag2?.label && (
              <Chip compact style={styles.hashtag} textStyle={{ color: '#1a1a1a' }}>#{dream.hashtags.hashtag2.label}</Chip>
            )}
            {dream.hashtags?.hashtag3?.label && (
              <Chip compact style={styles.hashtag} textStyle={{ color: '#1a1a1a' }}>#{dream.hashtags.hashtag3.label}</Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {dreams.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌙</Text>
            <Text style={styles.emptyText}>Aucun rêve enregistré</Text>
            <Text style={styles.emptySubtext}>
              Allez dans l'onglet "Nouveau Rêve" pour commencer votre journal
            </Text>
          </View>
        ) : (
          dreams.map((dream, index) => renderDreamCard(dream, index))
        )}
      </ScrollView>

      {/* Modal d'édition */}
      <Modal
        visible={editingIndex !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={cancelEdit}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le rêve</Text>
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
                    style={styles.modalInput}
                    outlineColor="#d0d0d0"
                    activeOutlineColor="#2196F3"
                    textColor="#000000"
                    placeholderTextColor="#757575"
                    theme={{
                      colors: {
                        background: '#ffffff',
                        onSurfaceVariant: '#000000',
                      }
                    }}
                  />
                  <TextInput
                    label="Lieu"
                    value={editingDream.location || ''}
                    onChangeText={(text) => setEditingDream({ ...editingDream, location: text })}
                    mode="outlined"
                    style={styles.modalInput}
                    outlineColor="#d0d0d0"
                    activeOutlineColor="#2196F3"
                    textColor="#000000"
                    placeholderTextColor="#757575"
                    theme={{
                      colors: {
                        background: '#ffffff',
                        onSurfaceVariant: '#000000',
                      }
                    }}
                  />
                  <TextInput
                    label="Personnages"
                    value={editingDream.characters || ''}
                    onChangeText={(text) => setEditingDream({ ...editingDream, characters: text })}
                    mode="outlined"
                    style={styles.modalInput}
                    outlineColor="#d0d0d0"
                    activeOutlineColor="#2196F3"
                    textColor="#000000"
                    placeholderTextColor="#757575"
                    theme={{
                      colors: {
                        background: '#ffffff',
                        onSurfaceVariant: '#000000',
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
                    style={styles.modalInput}
                    outlineColor="#d0d0d0"
                    activeOutlineColor="#2196F3"
                    textColor="#000000"
                    placeholderTextColor="#757575"
                    theme={{
                      colors: {
                        background: '#ffffff',
                        onSurfaceVariant: '#000000',
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
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  dreamCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#ffffff',
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
    color: '#1a1a1a',
  },
  dreamLocation: {
    fontSize: 12,
    color: '#4a5568',
    marginTop: 2,
  },
  dreamText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  quickMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metaChip: {
    backgroundColor: '#e3f2fd',
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailSection: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#1a1a1a', 
    lineHeight: 20,
  },
  emotionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  emotionChip: {
    backgroundColor: '#fff3e0',
  },
  keywordChip: {
    backgroundColor: '#f3e5f5',
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  hashtag: {
    backgroundColor: '#e0f2f1',
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
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#4a5568',
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  modalInput: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
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