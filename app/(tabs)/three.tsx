import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Chip, SegmentedButtons, TextInput } from 'react-native-paper';
import { ScrollAwareScreen } from '../../components/ScrollAwareScreen';
import { useAppTheme } from '../../hooks/useAppTheme';

// Interfaces locales pour la recherche
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
  hashtagsArray?: { id: string; label: string }[];
}

const DREAM_TYPE_ICONS: { [key: string]: string } = {
  ordinary: '💭',
  lucid: '✨',
  nightmare: '😱',
  premonitory: '🔮',
  fantasy: '🌈',
};

// Écran de recherche et filtrage des rêves
export default function TabThreeScreen() {
  const theme = useAppTheme();
  
  // États de recherche et données
  const [searchQuery, setSearchQuery] = useState('');
  const [allDreams, setAllDreams] = useState<Dream[]>([]);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);
  const [allHashtags, setAllHashtags] = useState<string[]>([]);
  const [allEmotions, setAllEmotions] = useState<string[]>([]);
  const [allKeywords, setAllKeywords] = useState<string[]>([]);

  // États des filtres avancés
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTone, setFilterTone] = useState<string>('all');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const loadDreamsData = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      if (!data) {
        setAllDreams([]);
        return;
      }
      
      const dreams: Dream[] = JSON.parse(data);
      const validDreams = dreams.filter(dream => dream?.dreamText);
      setAllDreams(validDreams);

      const hashtags = new Set<string>();
      const emotions = new Set<string>();
      const keywords = new Set<string>();
      
      validDreams.forEach(dream => {
        if (dream.hashtagsArray?.length) {
          dream.hashtagsArray.forEach(h => h?.label && hashtags.add(h.label));
        } else {
          [dream.hashtags?.hashtag1, dream.hashtags?.hashtag2, dream.hashtags?.hashtag3]
            .forEach(h => h?.label && hashtags.add(h.label));
        }
        
        dream.emotionBefore?.forEach(e => emotions.add(e));
        dream.emotionAfter?.forEach(e => emotions.add(e));
        dream.keywords?.forEach(k => keywords.add(k));
      });
      
      setAllHashtags(Array.from(hashtags).sort());
      setAllEmotions(Array.from(emotions).sort());
      setAllKeywords(Array.from(keywords).sort());
    } catch (error) {
      console.error('Failed to load dreams:', error instanceof Error ? error.message : String(error));
      Alert.alert('Erreur', 'Impossible de charger les rêves');
      setAllDreams([]);
      setFilteredDreams([]);
      setAllHashtags([]);
      setAllEmotions([]);
      setAllKeywords([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDreamsData();
    }, [loadDreamsData])
  );

  const applyFilters = useCallback(() => {
    let filtered = [...allDreams];

    // Recherche textuelle dans tous les champs
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(dream => {
        const text = dream.dreamText.toLowerCase();
        const location = dream.location?.toLowerCase() || '';
        const characters = dream.characters?.toLowerCase() || '';
        let hashtagSearch = '';
        if (dream.hashtagsArray && Array.isArray(dream.hashtagsArray)) {
          hashtagSearch = dream.hashtagsArray.map((h: any) => h.label?.toLowerCase()).filter(Boolean).join(' ');
        } else {
          const h1 = dream.hashtags?.hashtag1?.label?.toLowerCase() || '';
          const h2 = dream.hashtags?.hashtag2?.label?.toLowerCase() || '';
          const h3 = dream.hashtags?.hashtag3?.label?.toLowerCase() || '';
          hashtagSearch = [h1, h2, h3].filter(Boolean).join(' ');
        }
        const keywords = dream.keywords?.join(' ').toLowerCase() || '';

        return text.includes(searchTerm) ||
          location.includes(searchTerm) ||
          characters.includes(searchTerm) ||
          hashtagSearch.includes(searchTerm) ||
          keywords.includes(searchTerm);
      });
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(dream => dream.dreamType === filterType);
    }

    if (filterTone !== 'all') {
      filtered = filtered.filter(dream => dream.overallTone === filterTone);
    }

    if (selectedEmotions.length > 0) {
      filtered = filtered.filter(dream => {
        const allEmotions = [...(dream.emotionBefore || []), ...(dream.emotionAfter || [])];
        return selectedEmotions.some(emotion => allEmotions.includes(emotion));
      });
    }

    setFilteredDreams(filtered);
  }, [allDreams, searchQuery, filterType, filterTone, selectedEmotions]);

  // Application automatique des filtres
  React.useEffect(() => {
    applyFilters();
  }, [searchQuery, filterType, filterTone, selectedEmotions, allDreams]);

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterTone('all');
    setSelectedEmotions([]);
  };

  const renderDreamCard = useCallback((dream: Dream, index: number) => {
    try {
      const dreamIcon = DREAM_TYPE_ICONS[dream.dreamType || 'ordinary'] || '💭';
      const formattedDate = dream.todayDate ? 
        new Date(dream.todayDate).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }) : 'Date inconnue';

      return (
        <Card key={index} style={[styles.dreamCard, { backgroundColor: theme.card }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={[styles.dreamIcon, { color: theme.text }]}>{dreamIcon}</Text>
              <View style={styles.headerInfo}>
                <Text style={[styles.dreamDate, { color: theme.text }]}>
                  {formattedDate}
                </Text>
                {dream.location && (
                  <Text style={[styles.dreamLocation, { color: theme.text }]}>📍 {dream.location}</Text>
                )}
              </View>
            </View>

            <Text style={[styles.dreamText, { color: theme.text }]} numberOfLines={3}>
              {dream.dreamText || 'Aucune description'}
            </Text>

          {dream.characters && (
            <Text style={[styles.dreamMeta, { color: theme.text }]}>
              👥 {dream.characters}
            </Text>
          )}

          <View style={styles.metaRow}>
            {dream.emotionalIntensity && (
              <Chip 
                compact 
                icon="lightning-bolt" 
                style={[styles.metaChip, { backgroundColor: theme.surface }]}
                textStyle={{ color: theme.text }}
              >
                {dream.emotionalIntensity}/10
              </Chip>
            )}
            {dream.clarity && (
              <Chip 
                compact 
                icon="eye" 
                style={[styles.metaChip, { backgroundColor: theme.surface }]}
                textStyle={{ color: theme.text }}
              >
                Clarté {dream.clarity}/10
              </Chip>
            )}
          </View>

          <View style={styles.hashtagsContainer}>
            {dream.hashtagsArray && Array.isArray(dream.hashtagsArray) ? (
              dream.hashtagsArray.map((h: any, i: number) => h?.label ? 
                <Chip 
                  key={`chip-${i}`} 
                  compact 
                  style={[styles.hashtag, { backgroundColor: theme.accent }]}
                  textStyle={{ color: theme.background }}
                >
                  #{h.label}
                </Chip> : null)
            ) : (
              <>
                {dream.hashtags?.hashtag1?.label && (
                  <Chip 
                    compact 
                    style={[styles.hashtag, { backgroundColor: theme.accent }]}
                    textStyle={{ color: theme.background }}
                  >
                    #{dream.hashtags.hashtag1.label}
                  </Chip>
                )}
                {dream.hashtags?.hashtag2?.label && (
                  <Chip 
                    compact 
                    style={[styles.hashtag, { backgroundColor: theme.accent }]}
                    textStyle={{ color: theme.background }}
                  >
                    #{dream.hashtags.hashtag2.label}
                  </Chip>
                )}
                {dream.hashtags?.hashtag3?.label && (
                  <Chip 
                    compact 
                    style={[styles.hashtag, { backgroundColor: theme.accent }]}
                    textStyle={{ color: theme.background }}
                  >
                    #{dream.hashtags.hashtag3.label}
                  </Chip>
                )}
              </>
            )}
          </View>
        </Card.Content>
      </Card>
    );
    } catch (error) {
      console.error('Error rendering dream card:', error instanceof Error ? error.message : String(error));
      return (
        <Card key={index} style={[styles.dreamCard, { backgroundColor: theme.card }]}>
          <Card.Content>
            <Text style={{ color: theme.text }}>Erreur lors de l'affichage du rêve</Text>
          </Card.Content>
        </Card>
      );
    }
  }, [theme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Interface de recherche principale */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TextInput
          label="Rechercher dans mes rêves"
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={[styles.searchInput, { backgroundColor: theme.card }]}
          left={<TextInput.Icon icon="magnify" />}
          placeholder="Texte, hashtag, lieu, personnage..."
          right={searchQuery ? <TextInput.Icon icon="close" onPress={() => setSearchQuery('')} /> : undefined}
          textColor={theme.text}
          outlineColor={theme.border}
          activeOutlineColor={theme.accent}
          placeholderTextColor={theme.textSecondary}
          theme={{
            colors: {
              background: theme.card,
              onSurfaceVariant: theme.text,
            }
          }}
        />

        <Button
          mode={showAdvancedFilters ? 'contained' : 'outlined'}
          onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
          style={styles.filterButton}
          icon="filter-variant"
          textColor={showAdvancedFilters ? theme.background : theme.text}
          buttonColor={showAdvancedFilters ? theme.accent : theme.card}
        >
          Filtres {showAdvancedFilters ? '▲' : '▼'}
        </Button>
      </View>

      {/* Panneau de filtres (type, tonalité, émotions) */}
      {showAdvancedFilters && (
        <View style={[styles.advancedFilters, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: theme.text }]}>Type de rêve</Text>
            <SegmentedButtons
              value={filterType}
              onValueChange={setFilterType}
              buttons={[
                { value: 'all', label: 'Tous' },
                { value: 'ordinary', label: '💭' },
                { value: 'lucid', label: '✨' },
                { value: 'nightmare', label: '😱' },
              ]}
              style={styles.segmentedButtons}
              theme={{
                colors: {
                  secondaryContainer: theme.accent,
                  onSecondaryContainer: theme.background,
                }
              }}
            />
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: theme.text }]}>Tonalité</Text>
            <SegmentedButtons
              value={filterTone}
              onValueChange={setFilterTone}
              buttons={[
                { value: 'all', label: 'Toutes' },
                { value: 'positive', label: '😊' },
                { value: 'neutral', label: '😐' },
                { value: 'negative', label: '😔' },
              ]}
              style={styles.segmentedButtons}
              theme={{
                colors: {
                  secondaryContainer: theme.accent,
                  onSecondaryContainer: theme.background,
                }
              }}
            />
          </View>

          {allEmotions.length > 0 && (
            <View style={styles.emotionFilterSection}>
              <Text style={[styles.filterLabel, { color: theme.text }]}>Émotions</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.emotionChips}>
                  {allEmotions.map(emotion => (
                    <Chip
                      key={emotion}
                      selected={selectedEmotions.includes(emotion)}
                      onPress={() => toggleEmotion(emotion)}
                      style={styles.emotionChip}
                      mode="outlined"
                      selectedColor={theme.accent}
                      textStyle={{ color: theme.text }}
                    >
                      {emotion}
                    </Chip>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          <Button
            mode="text"
            onPress={clearFilters}
            style={styles.clearButton}
            icon="close"
            textColor={theme.text}
          >
            Effacer les filtres
          </Button>
        </View>
      )}

      {/* Hashtags populaires pour recherche rapide */}
      {!searchQuery && !showAdvancedFilters && (
        <View style={[styles.suggestionsSection, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recherches rapides :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.suggestionChips}>
              {allHashtags.slice(0, 10).map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSearchQuery(tag)}
                >
                  <Chip 
                    style={[styles.suggestionChip, { backgroundColor: theme.surface }]}
                    textStyle={{ color: theme.text }}
                  >
                    #{tag}
                  </Chip>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Affichage des rêves filtrés */}
      <ScrollView 
        style={styles.resultsContainer} 
        contentContainerStyle={styles.resultsContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Compteur de résultats */}
        {(searchQuery || filterType !== 'all' || filterTone !== 'all' || selectedEmotions.length > 0) && (
          <View style={[styles.resultHeader, { backgroundColor: theme.surface }]}>
            <Text style={[styles.resultCount, { color: theme.accent }]}>
              {filteredDreams.length} rêve{filteredDreams.length > 1 ? 's' : ''} trouvé{filteredDreams.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {filteredDreams.length === 0 && (searchQuery || showAdvancedFilters) ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={[styles.noResultsText, { color: theme.text }]}>Aucun rêve trouvé</Text>
            <Text style={[styles.noResultsSubtext, { color: theme.text }]}>
              Essayez de modifier vos critères de recherche
            </Text>
          </View>
        ) : (
          filteredDreams.map((dream, index) => renderDreamCard(dream, index))
        )}

        {!searchQuery && !showAdvancedFilters && filteredDreams.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌙</Text>
            <Text style={[styles.emptyText, { color: theme.text }]}>Commencez à rechercher vos rêves</Text>
            <Text style={[styles.emptySubtext, { color: theme.text }]}>
              Utilisez la barre de recherche ou les filtres pour explorer votre journal
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInput: {
    marginBottom: 8,
  },
  filterButton: {
    marginTop: 4,
  },
  advancedFilters: {
    padding: 16,
    borderBottomWidth: 1,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 12,
  },
  emotionFilterSection: {
    marginTop: 12,
  },
  emotionChips: {
    flexDirection: 'row',
    gap: 8,
  },
  emotionChip: {
    marginRight: 8,
  },
  clearButton: {
    marginTop: 8,
  },
  suggestionsSection: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  suggestionChips: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionChip: {
    marginRight: 8,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    padding: 16,
  },
  resultHeader: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  resultCount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dreamCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dreamIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  dreamDate: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dreamLocation: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
  dreamText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  dreamMeta: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metaChip: {
    opacity: 0.9,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtag: {
    opacity: 0.9,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
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
    textAlign: 'center',
    paddingHorizontal: 40,
    opacity: 0.7,
  },
});