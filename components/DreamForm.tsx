import { useAppTheme } from '@/hooks/useAppTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Button, Chip, SegmentedButtons, Text, TextInput } from 'react-native-paper';

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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  segmentedButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  typeButton: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  fullWidthButton: {
    alignSelf: 'center',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 8,
    padding: 12,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
  },
  sliderContainer: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  qualityLabel: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
});

const DREAM_TYPES = [
  { label: '💭 Ordinaire', value: 'ordinary' },
  { label: '✨ Lucide', value: 'lucid' },
  { label: '😱 Cauchemar', value: 'nightmare' },
  { label: '🔮 Prémonitoire', value: 'premonitory' },
  { label: '🌈 Fantastique', value: 'fantasy' },
];

const EMOTIONS = ['Joie', 'Tristesse', 'Peur', 'Colère', 'Anxiété', 'Paix', 'Excitation', 'Confusion', 'Amour', 'Nostalgie'];

const findHashtagIdByLabel = async (label: string): Promise<string> => {
  return `${label}-${Date.now()}`;
};

const qualityLabel = (v: number) => {
  if (v <= 2) return 'Cauchemar';
  if (v <= 4) return 'Très mauvaise';
  if (v <= 6) return 'Moyenne';
  if (v <= 8) return 'Bonne';
  return 'Beaux rêves';
};

const GradientSlider: React.FC<{ value: number; onChange: (n: number) => void }> = ({ value, onChange }) => {
  const theme = useAppTheme();

  const getBackgroundColor = (value: number) => {
    const red = '#D32F2F';
    const orange = '#F57C00';
    const green = '#4CAF50';

    if (value <= 4) return red;
    if (value <= 7) return orange;
    return green;
  };

  return (
    <View style={styles.sliderContainer}>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={getBackgroundColor(value)}
        maximumTrackTintColor={theme.border}
        thumbTintColor={getBackgroundColor(value)}
        tapToSeek={true}
      />
    </View>
  );
};

export default function DreamForm() {
  const theme = useAppTheme();

  // State
  const [dreamText, setDreamText] = useState('');
  const [hashtags, setHashtags] = useState<string[]>(['']);
  const [dreamDate, setDreamDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dreamType, setDreamType] = useState('');
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const [emotionBefore, setEmotionBefore] = useState<string[]>([]);
  const [emotionAfter, setEmotionAfter] = useState<string[]>([]);
  const [characters, setCharacters] = useState('');
  const [location, setLocation] = useState('');
  const [emotionalIntensity, setEmotionalIntensity] = useState('5');
  const [clarity, setClarity] = useState('5');
  const [keywords, setKeywords] = useState('');
  const [sleepQuality, setSleepQuality] = useState<number>(5);
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

      const cleanedHashtags = hashtags.map(h => h.trim()).filter(h => h);
      const hashtagObjs = await Promise.all(cleanedHashtags.map(async (label) => ({
        id: await findHashtagIdByLabel(label),
        label
      })));

      const hashtagsLegacy: any = {};
      if (hashtagObjs[0]) hashtagsLegacy.hashtag1 = hashtagObjs[0];
      if (hashtagObjs[1]) hashtagsLegacy.hashtag2 = hashtagObjs[1];
      if (hashtagObjs[2]) hashtagsLegacy.hashtag3 = hashtagObjs[2];

      const selectedDreamType = dreamType || 'ordinary';

      formDataArray.push({
        dreamText,
        isLucidDream: selectedDreamType === 'lucid',
        todayDate: dreamDate.toISOString(),
        hashtags: {
          ...hashtagsLegacy,
        },
        hashtagsArray: hashtagObjs,
        dreamType: selectedDreamType,
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

      // Reset form
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
      setSleepQuality(5);
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
          contentContainerStyle={[styles.contentContainer, { backgroundColor: theme.background }]}
        >
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
            <Button
              mode="outlined"
              onPress={() => setTypePickerVisible(true)}
              style={[styles.typeButton, styles.fullWidthButton]}
            >
              {dreamType ? (
                DREAM_TYPES.find(d => d.value === dreamType)?.label
              ) : (
                <Text style={{ color: theme.textSecondary }}>Sélectionner le type de rêve</Text>
              )}
            </Button>

            <Modal
              visible={typePickerVisible}
              animationType="fade"
              transparent
              onRequestClose={() => setTypePickerVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setTypePickerVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                    {DREAM_TYPES.map(dt => (
                      <TouchableWithoutFeedback
                        key={dt.value}
                        onPress={() => {
                          setDreamType(dt.value);
                          setTypePickerVisible(false);
                        }}
                      >
                        <View style={styles.modalItem}>
                          <Text style={{ color: theme.text }}>{dt.label}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
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
          <View style={[styles.section, styles.input]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>💫 Intensité émotionnelle: {emotionalIntensity}</Text>
            <GradientSlider
              value={(parseFloat(emotionalIntensity) || 1) / 10}
              onChange={(value) => setEmotionalIntensity(Math.round(value * 10).toString())}
            />
          </View>

          {/* Clarté */}
          <View style={[styles.section, styles.input]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>🔍 Clarté du rêve: {clarity}/10</Text>
            <GradientSlider
              value={(parseFloat(clarity) || 1) / 10}
              onChange={(value) => setClarity(Math.round(value * 10).toString())}
            />
          </View>

          {/* Tonalité globale */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>🎭 Tonalité globale</Text>
            <View style={styles.segmentedButtonContainer}>
              <SegmentedButtons
                value={overallTone}
                onValueChange={setOverallTone}
                buttons={[
                  {
                    label: '😊 Positive',
                    value: 'positive',
                    style: { minWidth: 100 }
                  },
                  {
                    label: '😐 Neutre',
                    value: 'neutral',
                    style: { minWidth: 100 }
                  },
                  {
                    label: '😔 Négative',
                    value: 'negative',
                    style: { minWidth: 100 }
                  },
                ]}
                style={[styles.segmentedButtons, styles.fullWidthButton]}
              />
            </View>
          </View>

          {/* Qualité du sommeil - Slider draggable */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>😴 Qualité du sommeil</Text>
            <GradientSlider
              value={sleepQuality}
              onChange={setSleepQuality}
            />
            <Text style={[styles.qualityLabel, { color: theme.text }]}>
              {qualityLabel(sleepQuality)}
            </Text>
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

          {/* Hashtags */}
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
                  outlineColor={theme.border}
                  activeOutlineColor={theme.accent}
                  textColor={theme.text}
                  placeholderTextColor={theme.textSecondary}
                  right={
                    idx > 0 ? <TextInput.Icon icon="close" onPress={() => {
                      const copy = [...hashtags];
                      copy.splice(idx, 1);
                      setHashtags(copy.length ? copy : ['']);
                    }} /> : undefined
                  }
                  theme={{
                    colors: {
                      background: theme.surface,
                      onSurfaceVariant: theme.text,
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
              placeholder="Qu'est-ce que ce rêve signifie pour vous ?"
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