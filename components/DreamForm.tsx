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
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppTheme } from '../hooks/useAppTheme';
import { STORAGE_KEYS, DREAM_TYPES, EMOTIONS, SLIDER_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES, EMOTIONAL_INTENSITY_LABELS, CLARITY_LABELS } from '../constants/AppConstants';
import { generateHashtagId, getSleepQualityLabel, getEmotionalIntensityLabel, getClarityLabel, cleanHashtags, cleanKeywords, validateDream } from '../utils/dreamUtils';
import { saveDream } from '../services/dreamService';
import type { Dream, DreamType, ToneType } from '../types/Dream';

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

// Options pour le sélecteur de type de rêve
const DREAM_TYPE_OPTIONS = Object.entries(DREAM_TYPES).map(([value, { icon, label }]) => ({
  label: `${icon} ${label}`,
  value: value as DreamType,
}));

interface QualitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

// Slider avec couleur dynamique selon la valeur (rouge/orange/vert)
const QualitySlider: React.FC<QualitySliderProps> = React.memo(({ value, onChange }) => {
  const theme = useAppTheme();

  const sliderColor = React.useMemo(() => {
    if (value <= 4) return '#D32F2F'; // Rouge
    if (value <= 7) return '#F57C00'; // Orange
    return '#4CAF50'; // Vert
  }, [value]);

  return (
    <View style={styles.sliderContainer}>
      <Slider
        style={styles.slider}
        minimumValue={SLIDER_CONFIG.MIN_VALUE}
        maximumValue={SLIDER_CONFIG.MAX_VALUE}
        step={SLIDER_CONFIG.STEP}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={sliderColor}
        maximumTrackTintColor={theme.border}
        thumbTintColor={sliderColor}
        tapToSeek
      />
    </View>
  );
});

// Formulaire principal de création de rêve avec 15+ champs et validation
export default function DreamForm() {
  const theme = useAppTheme();

  // États du formulaire - tous les champs du rêve
  const [dreamText, setDreamText] = useState('');
  const [hashtags, setHashtags] = useState<string[]>(['']);
  const [dreamDate, setDreamDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dreamType, setDreamType] = useState<DreamType | ''>('');
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const [emotionBefore, setEmotionBefore] = useState<string[]>([]);
  const [emotionAfter, setEmotionAfter] = useState<string[]>([]);
  const [characters, setCharacters] = useState('');
  const [location, setLocation] = useState('');
  const [emotionalIntensity, setEmotionalIntensity] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [keywords, setKeywords] = useState<string[]>(['']);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [personalMeaning, setPersonalMeaning] = useState('');
  const [overallTone, setOverallTone] = useState<ToneType>('neutral');

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

  // Sauvegarde du rêve avec validation et gestion d'erreurs
  const handleDreamSubmission = async () => {
    const dreamData = { dreamText };
    
    if (!validateDream(dreamData)) {
      Alert.alert('Erreur', ERROR_MESSAGES.EMPTY_DREAM);
      return;
    }

    try {
      const cleanedHashtags = cleanHashtags(hashtags);
      const hashtagObjs = cleanedHashtags.map(label => ({
        id: generateHashtagId(label),
        label
      }));

      const hashtagsLegacy: any = {};
      if (hashtagObjs[0]) hashtagsLegacy.hashtag1 = hashtagObjs[0];
      if (hashtagObjs[1]) hashtagsLegacy.hashtag2 = hashtagObjs[1];
      if (hashtagObjs[2]) hashtagsLegacy.hashtag3 = hashtagObjs[2];

      const newDream: Dream = {
        dreamText,
        isLucidDream: dreamType === 'lucid',
        todayDate: dreamDate.toISOString(),
        hashtags: hashtagsLegacy,
        hashtagsArray: hashtagObjs,
        dreamType: dreamType || 'ordinary',
        emotionBefore,
        emotionAfter,
        characters,
        location,
        emotionalIntensity,
        clarity,
        keywords: cleanKeywords(keywords.join(',')),
        sleepQuality,
        personalMeaning,
        overallTone,
        createdAt: new Date().toISOString(),
      };

      await saveDream(newDream);
      Alert.alert('Succès', SUCCESS_MESSAGES.DREAM_SAVED);
      resetForm();
    } catch {
      console.error('Dream save failed');
      Alert.alert('Erreur', ERROR_MESSAGES.SAVE_ERROR);
    }
  };

  // Reset complet du formulaire
  const resetForm = () => {
    setDreamText('');
    setHashtags(['']);
    setDreamDate(new Date());
    setDreamType('');
    setEmotionBefore([]);
    setEmotionAfter([]);
    setCharacters('');
    setLocation('');
    setEmotionalIntensity(5);
    setClarity(5);
    setKeywords(['']);
    setSleepQuality(5);
    setPersonalMeaning('');
    setOverallTone('neutral');
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
              {dreamType ? 
                DREAM_TYPE_OPTIONS.find(d => d.value === dreamType)?.label :
                "💭 Sélectionner le type de rêve"
              }
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
                    {DREAM_TYPE_OPTIONS.map(dt => (
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
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>💫 Intensité émotionnelle</Text>
            <QualitySlider
              value={emotionalIntensity}
              onChange={setEmotionalIntensity}
            />
            <Text style={[styles.qualityLabel, { color: theme.text }]}>
              {getEmotionalIntensityLabel(emotionalIntensity)}
            </Text>
          </View>

          {/* Clarté */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>🔍 Clarté du rêve</Text>
            <QualitySlider
              value={clarity}
              onChange={setClarity}
            />
            <Text style={[styles.qualityLabel, { color: theme.text }]}>
              {getClarityLabel(clarity)}
            </Text>
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

          {/* Qualité du sommeil */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>😴 Qualité du sommeil</Text>
            <QualitySlider
              value={sleepQuality}
              onChange={setSleepQuality}
            />
            <Text style={[styles.qualityLabel, { color: theme.text }]}>
              {getSleepQualityLabel(sleepQuality)}
            </Text>
          </View>

          {/* Mots-clés */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>🏷️ Mots-clés</Text>
            {keywords.map((keyword, idx) => (
              <View key={`keyword-${idx}`} style={styles.hashtagRow}>
                <TextInput
                  label={`Mot-clé ${idx + 1}`}
                  value={keyword}
                  onChangeText={(text) => {
                    const copy = [...keywords];
                    copy[idx] = text;
                    setKeywords(copy);
                  }}
                  mode="outlined"
                  placeholder="Ex: vol, eau, montagne..."
                  style={[styles.input, { flex: 1 }]}
                  outlineColor={theme.border}
                  activeOutlineColor={theme.accent}
                  textColor={theme.text}
                  placeholderTextColor={theme.textSecondary}
                  right={
                    idx > 0 ? <TextInput.Icon icon="close" onPress={() => {
                      const copy = [...keywords];
                      copy.splice(idx, 1);
                      setKeywords(copy.length ? copy : ['']);
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
              onPress={() => setKeywords(prev => [...prev, ''])}
              style={styles.addButton}
            >
              Ajouter un mot-clé
            </Button>
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