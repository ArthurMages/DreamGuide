import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, Checkbox, Chip, SegmentedButtons, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  // Champs existants
  const [dreamText, setDreamText] = useState('');
  const [hashtag1, setHashtag1] = useState('');
  const [hashtag2, setHashtag2] = useState('');
  const [hashtag3, setHashtag3] = useState('');

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

      const hashtag1Id = await findHashtagIdByLabel(hashtag1);
      const hashtag2Id = await findHashtagIdByLabel(hashtag2);
      const hashtag3Id = await findHashtagIdByLabel(hashtag3);

      formDataArray.push({
        dreamText,
        isLucidDream: dreamType === 'lucid',
        todayDate: dreamDate.toISOString(),
        hashtags: {
          hashtag1: { id: hashtag1Id, label: hashtag1 },
          hashtag2: { id: hashtag2Id, label: hashtag2 },
          hashtag3: { id: hashtag3Id, label: hashtag3 },
        },
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
      setHashtag1('');
      setHashtag2('');
      setHashtag3('');
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
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          
          {/* Date et heure */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Date du rêve</Text>
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
            <Text style={styles.sectionTitle}>🌟 Type de rêve</Text>
            <SegmentedButtons
              value={dreamType}
              onValueChange={setDreamType}
              buttons={DREAM_TYPES}
              style={styles.segmentedButtons}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Description du rêve</Text>
            <TextInput
              value={dreamText}
              onChangeText={setDreamText}
              mode="outlined"
              multiline
              numberOfLines={6}
              placeholder="Décrivez votre rêve en détail..."
              style={styles.textArea}
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

          {/* Lieu */}
          <View style={styles.section}>
            <TextInput
              label="📍 Lieu du rêve"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              placeholder="Ex: Maison d'enfance, forêt, ville inconnue..."
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

          {/* Personnages */}
          <View style={styles.section}>
            <TextInput
              label="👥 Personnages présents"
              value={characters}
              onChangeText={setCharacters}
              mode="outlined"
              placeholder="Ex: Maman, ami d'enfance, inconnu..."
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

          {/* Émotions avant */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>😴 État émotionnel avant le rêve</Text>
            <View style={styles.chipContainer}>
              {EMOTIONS.map(emotion => (
                <Chip
                  key={emotion}
                  selected={emotionBefore.includes(emotion)}
                  onPress={() => toggleEmotion(emotion, 'before')}
                  style={styles.chip}
                  mode="outlined"
                  textStyle={{ color: '#1a1a1a' }}
                >
                  {emotion}
                </Chip>
              ))}
            </View>
          </View>

          {/* Émotions après */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>😊 État émotionnel après le rêve</Text>
            <View style={styles.chipContainer}>
              {EMOTIONS.map(emotion => (
                <Chip
                  key={emotion}
                  selected={emotionAfter.includes(emotion)}
                  onPress={() => toggleEmotion(emotion, 'after')}
                  style={styles.chip}
                  mode="outlined"
                  textStyle={{ color: '#1a1a1a' }}
                >
                  {emotion}
                </Chip>
              ))}
            </View>
          </View>

          {/* Intensité émotionnelle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💫 Intensité émotionnelle: {emotionalIntensity}/10</Text>
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
            <Text style={styles.sectionTitle}>🔍 Clarté du rêve: {clarity}/10</Text>
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
            <Text style={styles.sectionTitle}>🎭 Tonalité globale</Text>
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
            <Text style={styles.sectionTitle}>😴 Qualité du sommeil</Text>
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
            <Text style={styles.sectionTitle}>#️⃣ Hashtags</Text>
            <TextInput
              label="Hashtag 1"
              value={hashtag1}
              onChangeText={setHashtag1}
              mode="outlined"
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
            <TextInput
              label="Hashtag 2"
              value={hashtag2}
              onChangeText={setHashtag2}
              mode="outlined"
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
            <TextInput
              label="Hashtag 3"
              value={hashtag3}
              onChangeText={setHashtag3}
              mode="outlined"
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

          {/* Signification personnelle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💭 Signification personnelle</Text>
            <TextInput
              value={personalMeaning}
              onChangeText={setPersonalMeaning}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Que pensez-vous que ce rêve signifie pour vous ?"
              style={styles.textArea}
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
    backgroundColor: '#f5f5f5',
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
    color: '#1a1a1a',
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  textArea: {
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  dateButton: {
    marginBottom: 8,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#ffffff',
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
  },
});