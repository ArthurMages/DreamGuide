import { useAppTheme } from '@/hooks/useAppTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Chip, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';

const DREAM_TYPES = [
  { label: '💭 Ordinaire', value: 'ordinary' },
  { label: '✨ Lucide', value: 'lucid' },
  { label: '😱 Cauchemar', value: 'nightmare' },
  { label: '🔮 Prémonitoire', value: 'premonitory' },
  { label: '🌈 Fantastique', value: 'fantasy' },
];

const EMOTIONS = ['Joie', 'Tristesse', 'Peur', 'Colère', 'Anxiété', 'Paix', 'Excitation', 'Confusion', 'Amour', 'Nostalgie'];
const SLEEP_QUALITY = ['Très mauvaise', 'Mauvaise', 'Moyenne', 'Bonne', 'Excellente'];

const findHashtagIdByLabel = async (label: string): Promise<string> => {
  return `${label}-${Date.now()}`;
};

export default function DreamForm() {
  const theme = useAppTheme();
  const paperTheme = useTheme();

  // Champs existants
  const [dreamText, setDreamText] = useState('');
  // hashtags dynamiques: au moins un champ par défaut
  const [hashtags, setHashtags] = useState<string[]>(['']);

  // Nouveaux champs
  const [dreamDate, setDreamDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dreamType, setDreamType] = useState('ordinary');
  const [emotionBefore, setEmotionBefore] = useState<string[]>([]);
  const [emotionAfter, setEmotionAfter] = useState<string[]>([]);
  const [characters, setCharacters] = useState('');
  const [location, setLocation] = useState('');
  const [emotionalIntensity, setEmotionalIntensity] = useState('5');
  const [clarity, setClarity] = useState('5');
  const [keywords, setKeywords] = useState('');
  const [sleepQuality, setSleepQuality] = useState('Moyenne');
  const [personalMeaning, setPersonalMeaning] = useState('');
  const [overallTone, setOverallTone] = useState('neutral');

  const toggleEmotion = (emotion: string, type: 'before' | 'after') => {
    if (type === 'before') {
      setEmotionBefore(prev =>
        prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
      );
    } else {
      setEmotionAfter(prev =>
        prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
      );
    }
  };

  const handleDreamSubmission = async () => {
    if (!dreamText.trim()) {
      Alert.alert('Erreur', 'Veuillez décrire votre rêve');
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem('dreamFormDataArray');
      const formDataArray = existingData ? JSON.parse(existingData) : [];

      // Générer les IDs pour chaque hashtag non vide
      const cleanedHashtags = hashtags.map(h => h.trim()).filter(h => h);
      const hashtagObjs = await Promise.all(cleanedHashtags.map(async (label) => ({ id: await findHashtagIdByLabel(label), label })));

      // Conserver la compatibilité avec l'ancien schéma (hashtag1/2/3)
      const hashtagsLegacy: any = {};
      if (hashtagObjs[0]) hashtagsLegacy.hashtag1 = hashtagObjs[0];
      if (hashtagObjs[1]) hashtagsLegacy.hashtag2 = hashtagObjs[1];
      if (hashtagObjs[2]) hashtagsLegacy.hashtag3 = hashtagObjs[2];

      formDataArray.push({
        dreamText,
        isLucidDream: dreamType === 'lucid',
        todayDate: dreamDate.toISOString(),
        // Nouveau format: tableau et compatibilité legacy
        hashtags: {
          ...hashtagsLegacy,
        },
        hashtagsArray: hashtagObjs,
        // Nouveaux champs
        dreamType,
        emotionBefore,
        emotionAfter,
        characters,
        location,
        emotionalIntensity: parseInt(emotionalIntensity),
        clarity: parseInt(clarity),
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
        sleepQuality,
        personalMeaning,
        overallTone,
        createdAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(formDataArray));

      Alert.alert('Succès', 'Rêve enregistré avec succès ! 🌙');

      // Réinitialisation
      setDreamText('');
      setHashtags(['']);
      setDreamDate(new Date());
      setDreamType('ordinary');
      setEmotionBefore([]);
      setEmotionAfter([]);
      setCharacters('');
      setLocation('');
      setEmotionalIntensity('5');
      setClarity('5');
      setKeywords('');
      setSleepQuality('Moyenne');
      setPersonalMeaning('');
      setOverallTone('neutral');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le rêve');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={[styles.container, { backgroundColor: theme.background }]}
          contentContainerStyle={[styles.contentContainer, { backgroundColor: theme.background }]}>

          {/* Date et heure */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>📅 Date du rêve</Text>
            <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
              {dreamDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={dreamDate}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDreamDate(selectedDate);
                }}
              />
            )}
          </View>

          {/* Type de rêve */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>🌟 Type de rêve</Text>
            <SegmentedButtons
              value={dreamType}
              onValueChange={setDreamType}
              buttons={DREAM_TYPES}
              style={styles.segmentedButtons}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>📝 Description du rêve</Text>
            <TextInput
              value={dreamText}
              onChangeText={setDreamText}
              mode="outlined"
              multiline
              numberOfLines={6}
              placeholder="Décrivez votre rêve en détail..."
              style={styles.textArea}
              outlineColor={theme.border}
              activeOutlineColor={theme.accent}
              textColor={theme.text}
              placeholderTextColor={theme.textSecondary}
              theme={{
                colors: {
                  background: theme.surface,
                  onSurfaceVariant: theme.text,
                }
              }}
            />
          </View>

          {/* Lieu */}
          <View style={styles.section}>
            <TextInput
              label="📍 Lieu du rêve"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              placeholder="Ex: Maison d'enfance, forêt, ville inconnue..."
              style={styles.input}
              outlineColor={theme.border}
              activeOutlineColor={theme.accent}
              textColor={theme.text}
              placeholderTextColor={theme.textSecondary}
              theme={{
                colors: {
                  background: theme.surface,
                  onSurfaceVariant: theme.text,
                }
              }}
            />
          </View>

          {/* Personnages */}
          <View style={styles.section}>
            <TextInput
              label="👥 Personnages présents"
              value={characters}
              onChangeText={setCharacters}
              mode="outlined"
              placeholder="Ex: Maman, ami d'enfance, inconnu..."
              style={styles.input}
              outlineColor={theme.border}
              activeOutlineColor={theme.accent}
              textColor={theme.text}
              placeholderTextColor={theme.textSecondary}
              theme={{
                colors: {
                  background: theme.surface,
                  onSurfaceVariant: theme.text,
                }
              }}
            />
          </View>

          {/* Émotions avant */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>😴 État émotionnel avant le rêve</Text>
            <View style={styles.chipContainer}>
              {EMOTIONS.map(emotion => (
                <Chip
                  key={emotion}
                  selected={emotionBefore.includes(emotion)}
                  onPress={() => toggleEmotion(emotion, 'before')}
                  style={[styles.chip, { backgroundColor: theme.surface }]}
                  mode="outlined"
                  textStyle={{ color: theme.text }}
                >
                  {emotion}
                </Chip>
              ))}
            </View>
          </View>

          {/* Émotions après */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>😊 État émotionnel après le rêve</Text>
            <View style={styles.chipContainer}>
              {EMOTIONS.map(emotion => (
                <Chip
                  key={emotion}
                  selected={emotionAfter.includes(emotion)}
                  onPress={() => toggleEmotion(emotion, 'after')}
                  style={[styles.chip, { backgroundColor: theme.surface }]}
                  mode="outlined"
                  textStyle={{ color: theme.text }}
                >
                  {emotion}
                </Chip>
              ))}
            </View>
          </View>

          {/* Intensité émotionnelle */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>💫 Intensité émotionnelle: {emotionalIntensity}/10</Text>
            <TextInput
              value={emotionalIntensity}
              onChangeText={setEmotionalIntensity}
              mode="outlined"
              keyboardType="numeric"
              maxLength={2}
              style={styles.input}
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
          </View>

          {/* Clarté */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>🔍 Clarté du rêve: {clarity}/10</Text>
            <TextInput
              value={clarity}
              onChangeText={setClarity}
              mode="outlined"
              keyboardType="numeric"
              maxLength={2}
              style={styles.input}
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
          </View>

          {/* Tonalité globale */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>🎭 Tonalité globale</Text>
            <SegmentedButtons
              value={overallTone}
              onValueChange={setOverallTone}
              buttons={[
                { label: '😊 Positive', value: 'positive' },
                { label: '😐 Neutre', value: 'neutral' },
                { label: '😔 Négative', value: 'negative' },
              ]}
            />
          </View>

          {/* Qualité du sommeil */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>😴 Qualité du sommeil</Text>
            <SegmentedButtons
              value={sleepQuality}
              onValueChange={setSleepQuality}
              buttons={SLEEP_QUALITY.map(q => ({ label: q, value: q }))}
            />
          </View>

          {/* Mots-clés */}
          <View style={styles.section}>
            <TextInput
              label="🏷️ Mots-clés (séparés par des virgules)"
              value={keywords}
              onChangeText={setKeywords}
              mode="outlined"
              placeholder="Ex: vol, eau, montagne, poursuite..."
              style={styles.input}
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
          </View>

          {/* Hashtags existants */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>#️⃣ Hashtags</Text>
            {hashtags.map((tag, idx) => (
              <View key={`hashtag-${idx}`} style={styles.hashtagRow}>
                <TextInput
                  label={`Hashtag ${idx + 1}`}
                  value={tag}
                  onChangeText={(text) => {
                    const copy = [...hashtags];
                    copy[idx] = text;
                    setHashtags(copy);
                  }}
                  mode="outlined"
                  style={[styles.input, { flex: 1 }]}
                  outlineColor="#d0d0d0"
                  activeOutlineColor="#2196F3"
                  textColor="#000000"
                  placeholderTextColor="#757575"
                  right={
                    idx > 0 ? <TextInput.Icon icon="close" onPress={() => {
                      const copy = [...hashtags];
                      copy.splice(idx, 1);
                      setHashtags(copy.length ? copy : ['']);
                    }} /> : undefined
                  }
                  theme={{
                    colors: {
                      background: '#ffffff',
                      onSurfaceVariant: '#000000',
                    }
                  }}
                />
              </View>
            ))}

            <Button
              mode="outlined"
              icon="plus"
              onPress={() => setHashtags(prev => [...prev, ''])}
              style={styles.addButton}
            >
              Ajouter un hashtag
            </Button>
          </View>

          {/* Signification personnelle */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>💭 Signification personnelle</Text>
            <TextInput
              value={personalMeaning}
              onChangeText={setPersonalMeaning}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Décrivez votre rêve en détail..."
              style={styles.textArea}
              outlineColor={theme.border}
              activeOutlineColor={theme.accent}
              textColor={theme.text}
              placeholderTextColor={theme.textSecondary}
              theme={{
                colors: {
                  background: theme.surface,
                  onSurfaceVariant: theme.text,
                }
              }}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleDreamSubmission}
            style={styles.submitButton}
            icon="content-save"
          >
            Enregistrer le rêve
          </Button>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
  },
  textArea: {
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  hashtagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
  },
});