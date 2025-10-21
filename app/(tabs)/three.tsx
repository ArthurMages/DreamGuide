import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { TextInput, Chip, Button, Card, SegmentedButtons } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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

export default function TabThreeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allDreams, setAllDreams] = useState<Dream[]>([]);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);
  const [allHashtags, setAllHashtags] = useState<string[]>([]);
  const [allEmotions, setAllEmotions] = useState<string[]>([]);
  const [allKeywords, setAllKeywords] = useState<string[]>([]);
  
  // Filtres avancés
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTone, setFilterTone] = useState<string>('all');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const fetchDreams = async () => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreamFormDataArray: Dream[] = data ? JSON.parse(data) : [];
      const validDreams = dreamFormDataArray.filter(dream => dream && dream.dreamText);
      setAllDreams(validDreams);

      // Extraire tous les hashtags
      const hashtags = new Set<string>();
      validDreams.forEach(dream => {
        if (dream.hashtags?.hashtag1?.label) hashtags.add(dream.hashtags.hashtag1.label);
        if (dream.hashtags?.hashtag2?.label) hashtags.add(dream.hashtags.hashtag2.label);
        if (dream.hashtags?.hashtag3?.label) hashtags.add(dream.hashtags.hashtag3.label);
      });
      setAllHashtags(Array.from(hashtags).sort());

      // Extraire toutes les émotions
      const emotions = new Set<string>();
      validDreams.forEach(dream => {
        dream.emotionBefore?.forEach(e => emotions.add(e));
        dream.emotionAfter?.forEach(e => emotions.add(e));
      });
      setAllEmotions(Array.from(emotions).sort());

      // Extraire tous les mots-clés
      const keywords = new Set<string>();
      validDreams.forEach(dream => {
        dream.keywords?.forEach(k => keywords.add(k));
      });
      setAllKeywords(Array.from(keywords).sort());
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDreams();
    }, [])
  );

  // Fonction de recherche et filtrage
  const applyFilters = () => {
    let filtered = [...allDreams];

    // Filtre par texte de recherche
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(dream => {
        const text = dream.dreamText.toLowerCase();
        const location = dream.location?.toLowerCase() || '';
        const characters = dream.characters?.toLowerCase() || '';
        const h1 = dream.hashtags?.hashtag1?.label?.toLowerCase() || '';
        const h2 = dream.hashtags?.hashtag2?.label?.toLowerCase() || '';
        const h3 = dream.hashtags?.hashtag3?.label?.toLowerCase() || '';
        const keywords = dream.keywords?.join(' ').toLowerCase() || '';
        
        return text.includes(searchTerm) || 
               location.includes(searchTerm) || 
               characters.includes(searchTerm) ||
               h1.includes(searchTerm) || 
               h2.includes(searchTerm) || 
               h3.includes(searchTerm) ||
               keywords.includes(searchTerm);
      });
    }

    // Filtre par type de rêve
    if (filterType !== 'all') {
      filtered = filtered.filter(dream => dream.dreamType === filterType);
    }

    // Filtre par tonalité
    if (filterTone !== 'all') {
      filtered = filtered.filter(dream => dream.overallTone === filterTone);
    }

    // Filtre par émotions
    if (selectedEmotions.length > 0) {
      filtered = filtered.filter(dream => {
        const allEmotions = [...(dream.emotionBefore || []), ...(dream.emotionAfter || [])];
        return selectedEmotions.some(emotion => allEmotions.includes(emotion));
      });
    }

    setFilteredDreams(filtered);
  };

  // Appliquer les filtres à chaque changement
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

  const renderDreamCard = (dream: Dream, index: number) => {
    const dreamIcon = DREAM_TYPE_ICONS[dream.dreamType || 'ordinary'] || '💭';
    
    return (
      <Card key={index} style={styles.dreamCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.dreamIcon}>{dreamIcon}</Text>
            <View style={styles.headerInfo}>
              <Text style={styles.dreamDate}>
                {new Date(dream.todayDate).toLocaleDateString('fr-FR', {
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

          <Text style={styles.dreamText} numberOfLines={3}>
            {dream.dreamText}
          </Text>

          {dream.characters && (
            <Text style={styles.dreamMeta}>
              👥 {dream.characters}
            </Text>
          )}

          <View style={styles.metaRow}>
            {dream.emotionalIntensity && (
              <Chip compact icon="lightning-bolt" style={styles.metaChip}>
                {dream.emotionalIntensity}/10
              </Chip>
            )}
            {dream.clarity && (
              <Chip compact icon="eye" style={styles.metaChip}>
                Clarté {dream.clarity}/10
              </Chip>
            )}
          </View>

          <View style={styles.hashtagsContainer}>
            {dream.hashtags?.hashtag1?.label && (
              <Chip compact style={styles.hashtag}>#{dream.hashtags.hashtag1.label}</Chip>
            )}
            {dream.hashtags?.hashtag2?.label && (
              <Chip compact style={styles.hashtag}>#{dream.hashtags.hashtag2.label}</Chip>
            )}
            {dream.hashtags?.hashtag3?.label && (
              <Chip compact style={styles.hashtag}>#{dream.hashtags.hashtag3.label}</Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          label="Rechercher dans mes rêves"
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
          placeholder="Texte, hashtag, lieu, personnage..."
          right={searchQuery ? <TextInput.Icon icon="close" onPress={() => setSearchQuery('')} /> : undefined}
        />
        
        <Button
          mode={showAdvancedFilters ? 'contained' : 'outlined'}
          onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
          style={styles.filterButton}
          icon="filter-variant"
        >
          Filtres {showAdvancedFilters ? '▲' : '▼'}
        </Button>
      </View>

      {/* Filtres avancés */}
      {showAdvancedFilters && (
        <View style={styles.advancedFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Type de rêve */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Type de rêve</Text>
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
              />
            </View>

            {/* Tonalité */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Tonalité</Text>
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
              />
            </View>
          </ScrollView>

          {/* Filtres d'émotions */}
          {allEmotions.length > 0 && (
            <View style={styles.emotionFilterSection}>
              <Text style={styles.filterLabel}>Émotions</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.emotionChips}>
                  {allEmotions.map(emotion => (
                    <Chip
                      key={emotion}
                      selected={selectedEmotions.includes(emotion)}
                      onPress={() => toggleEmotion(emotion)}
                      style={styles.emotionChip}
                      mode="outlined"
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
          >
            Effacer les filtres
          </Button>
        </View>
      )}

      {/* Suggestions rapides */}
      {!searchQuery && !showAdvancedFilters && (
        <View style={styles.suggestionsSection}>
          <Text style={styles.sectionTitle}>Recherches rapides :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.suggestionChips}>
              {allHashtags.slice(0, 10).map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSearchQuery(tag)}
                >
                  <Chip style={styles.suggestionChip}>#{tag}</Chip>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Résultats */}
      <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
        {/* Indicateur de résultats */}
        {(searchQuery || filterType !== 'all' || filterTone !== 'all' || selectedEmotions.length > 0) && (
          <View style={styles.resultHeader}>
            <Text style={styles.resultCount}>
              {filteredDreams.length} rêve{filteredDreams.length > 1 ? 's' : ''} trouvé{filteredDreams.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {filteredDreams.length === 0 && (searchQuery || showAdvancedFilters) ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsText}>Aucun rêve trouvé</Text>
            <Text style={styles.noResultsSubtext}>
              Essayez de modifier vos critères de recherche
            </Text>
          </View>
        ) : (
          filteredDreams.map((dream, index) => renderDreamCard(dream, index))
        )}

        {!searchQuery && !showAdvancedFilters && filteredDreams.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌙</Text>
            <Text style={styles.emptyText}>Commencez à rechercher vos rêves</Text>
            <Text style={styles.emptySubtext}>
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
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  filterButton: {
    marginTop: 4,
  },
  advancedFilters: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterSection: {
    marginRight: 16,
    minWidth: 200,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  suggestionChips: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#242424ff',
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
    backgroundColor: '#e8f4f8',
    borderRadius: 8,
  },
  resultCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
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
    color: '#ffffffff',
  },
  dreamLocation: {
    fontSize: 12,
    color: '#ffffffff',
    marginTop: 2,
  },
  dreamText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ffffffff',
    marginBottom: 12,
  },
  dreamMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metaChip: {
    backgroundColor: '#171717',
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtag: {
    backgroundColor: '#e0f2f1',
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
    color: '#333',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});