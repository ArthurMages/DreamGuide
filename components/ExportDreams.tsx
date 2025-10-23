import { useAppTheme } from '@/hooks/useAppTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, Platform, Share, StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { ThemedCard } from './ThemedCard';

interface Dream {
  dreamText: string;
  isLucidDream: boolean;
  todayDate: string;
  hashtags?: any;
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

const getDocumentDirectory = () => {
  return ((FileSystem as any).documentDirectory as string) || '';
};

export default function ExportDreams() {
  const [isExporting, setIsExporting] = useState(false);
  const theme = useAppTheme();

  const formatDreamToText = (dream: Dream, index: number): string => {
    const date = new Date(dream.todayDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let text = `\n${'='.repeat(50)}\n`;
    text += `RÊVE #${index + 1} - ${date}\n`;
    text += `${'='.repeat(50)}\n\n`;

    // Type de rêve
    const typeLabels: { [key: string]: string } = {
      ordinary: 'Ordinaire',
      lucid: 'Lucide',
      nightmare: 'Cauchemar',
      premonitory: 'Prémonitoire',
      fantasy: 'Fantastique',
    };
    text += `Type: ${typeLabels[dream.dreamType || 'ordinary']}\n\n`;

    // Description
    text += `DESCRIPTION:\n${dream.dreamText}\n\n`;

    // Lieu
    if (dream.location) {
      text += `📍 Lieu: ${dream.location}\n`;
    }

    // Personnages
    if (dream.characters) {
      text += `👥 Personnages: ${dream.characters}\n`;
    }

    // Émotions
    if (dream.emotionBefore && dream.emotionBefore.length > 0) {
      text += `😴 Émotions avant: ${dream.emotionBefore.join(', ')}\n`;
    }
    if (dream.emotionAfter && dream.emotionAfter.length > 0) {
      text += `😊 Émotions après: ${dream.emotionAfter.join(', ')}\n`;
    }

    // Intensité et clarté
    if (dream.emotionalIntensity) {
      text += `💫 Intensité émotionnelle: ${dream.emotionalIntensity}/10\n`;
    }
    if (dream.clarity) {
      text += `🔍 Clarté: ${dream.clarity}/10\n`;
    }

    // Tonalité
    if (dream.overallTone) {
      const tones: { [key: string]: string } = {
        positive: 'Positive',
        neutral: 'Neutre',
        negative: 'Négative',
      };
      text += `🎭 Tonalité: ${tones[dream.overallTone]}\n`;
    }

    // Qualité du sommeil
    if (dream.sleepQuality) {
      text += `😴 Qualité du sommeil: ${dream.sleepQuality}\n`;
    }

    // Mots-clés
    if (dream.keywords && dream.keywords.length > 0) {
      text += `🏷️ Mots-clés: ${dream.keywords.join(', ')}\n`;
    }

    // Hashtags (support new array and legacy fields)
    const tagsArray = dream.hashtagsArray && Array.isArray(dream.hashtagsArray)
      ? dream.hashtagsArray.map((h: any) => h?.label).filter(Boolean)
      : [
        dream.hashtags?.hashtag1?.label,
        dream.hashtags?.hashtag2?.label,
        dream.hashtags?.hashtag3?.label,
      ].filter(Boolean);

    if (tagsArray.length > 0) {
      text += `#️⃣ Hashtags: ${tagsArray.map((t: string) => `#${t}`).join(' ')}\n`;
    }

    // Signification personnelle
    if (dream.personalMeaning) {
      text += `\n💭 SIGNIFICATION PERSONNELLE:\n${dream.personalMeaning}\n`;
    }

    return text;
  };

  const formatDreamToJSON = (dreams: Dream[]): string => {
    return JSON.stringify(dreams, null, 2);
  };

  const formatDreamToCSV = (dreams: Dream[]): string => {
    let csv = 'Date,Type,Description,Lieu,Personnages,Intensité,Clarté,Tonalité,Qualité Sommeil,Mots-clés,Hashtags\n';

    dreams.forEach(dream => {
      const date = new Date(dream.todayDate).toLocaleDateString('fr-FR');
      const type = dream.dreamType || 'ordinary';
      const description = `"${dream.dreamText.replace(/"/g, '""')}"`;
      const location = dream.location || '';
      const characters = dream.characters || '';
      const intensity = dream.emotionalIntensity || '';
      const clarity = dream.clarity || '';
      const tone = dream.overallTone || '';
      const sleepQuality = dream.sleepQuality || '';
      const keywords = dream.keywords?.join(';') || '';
      const hashtags = dream.hashtagsArray && Array.isArray(dream.hashtagsArray)
        ? dream.hashtagsArray.map((h: any) => h?.label).filter(Boolean).join(';')
        : [
          dream.hashtags?.hashtag1?.label,
          dream.hashtags?.hashtag2?.label,
          dream.hashtags?.hashtag3?.label,
        ].filter(Boolean).join(';');

      csv += `${date},${type},${description},${location},${characters},${intensity},${clarity},${tone},${sleepQuality},${keywords},${hashtags}\n`;
    });

    return csv;
  };

  const exportAsText = async () => {
    try {
      setIsExporting(true);
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreams: Dream[] = data ? JSON.parse(data) : [];

      if (dreams.length === 0) {
        Alert.alert('Erreur', 'Aucun rêve à exporter');
        return;
      }

      let fullText = `MON JOURNAL DE RÊVES\n`;
      fullText += `Exporté le ${new Date().toLocaleDateString('fr-FR')}\n`;
      fullText += `Nombre total de rêves: ${dreams.length}\n`;

      dreams.forEach((dream, index) => {
        fullText += formatDreamToText(dream, index);
      });

      if (Platform.OS === 'web') {
        // Pour le web, télécharger le fichier
        const blob = new Blob([fullText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mes-reves-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // Pour mobile, partager
        await Share.share({
          message: fullText,
          title: 'Mes Rêves',
        });
      }

      Alert.alert('Succès', 'Export réussi !');
    } catch (error) {
      console.error('Erreur export:', error);
      Alert.alert('Erreur', "Impossible d'exporter les rêves");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsJSON = async () => {
    try {
      setIsExporting(true);
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreams: Dream[] = data ? JSON.parse(data) : [];

      if (dreams.length === 0) {
        Alert.alert('Erreur', 'Aucun rêve à exporter');
        return;
      }

      const jsonContent = formatDreamToJSON(dreams);

      if (Platform.OS === 'web') {
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mes-reves-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const fileUri = `${getDocumentDirectory()}mes-reves-${new Date().toISOString().split('T')[0]}.json`;
        await FileSystem.writeAsStringAsync(fileUri, jsonContent);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('Erreur', 'Le partage de fichiers n\'est pas disponible');
        }
      }

      Alert.alert('Succès', 'Export JSON réussi !');
    } catch (error) {
      console.error('Erreur export JSON:', error);
      Alert.alert('Erreur', "Impossible d'exporter en JSON");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsCSV = async () => {
    try {
      setIsExporting(true);
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreams: Dream[] = data ? JSON.parse(data) : [];

      if (dreams.length === 0) {
        Alert.alert('Erreur', 'Aucun rêve à exporter');
        return;
      }

      const csvContent = formatDreamToCSV(dreams);

      if (Platform.OS === 'web') {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mes-reves-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const fileUri = `${getDocumentDirectory()}mes-reves-${new Date().toISOString().split('T')[0]}.csv`;
        await FileSystem.writeAsStringAsync(fileUri, csvContent);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('Erreur', 'Le partage de fichiers n\'est pas disponible');
        }
      }

      Alert.alert('Succès', 'Export CSV réussi !');
    } catch (error) {
      console.error('Erreur export CSV:', error);
      Alert.alert('Erreur', "Impossible d'exporter en CSV");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedCard style={styles.card}>
        <View style={{ padding: 16 }}>
          <Text variant="titleLarge" style={{ color: theme.text, marginBottom: 8 }}>📤 Exporter mes rêves</Text>
          <Text variant="bodyMedium" style={{ color: theme.text }}>
            Exportez votre journal de rêves dans différents formats pour le sauvegarder ou le partager.
          </Text>

          <Divider style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.exportOption}>
            <Text variant="titleMedium" style={{ color: theme.text }}>📄 Format Texte</Text>
            <Text variant="bodyMedium" style={{ color: theme.text, marginBottom: 12 }}>
              Export lisible avec toutes les informations formatées
            </Text>
            <Button
              mode="outlined"
              onPress={exportAsText}
              loading={isExporting}
              disabled={isExporting}
              style={styles.button}
              textColor={theme.text}
              icon="file-document"
            >
              Exporter en TXT
            </Button>
          </View>

          <Divider style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.exportOption}>
            <Text style={[styles.optionTitle, { color: theme.text }]}>📊 Format CSV</Text>
            <Text style={[styles.optionDescription, { color: theme.text }]}>
              Format tableur compatible Excel et Google Sheets
            </Text>
            <Button
              mode="contained"
              onPress={exportAsCSV}
              loading={isExporting}
              disabled={isExporting}
              style={styles.button}
              icon="table"
              textColor={theme.background}
            >
              Exporter en CSV
            </Button>
          </View>

          <Divider style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.exportOption}>
            <Text style={[styles.optionTitle, { color: theme.text }]}>💾 Format JSON</Text>
            <Text style={[styles.optionDescription, { color: theme.text }]}>
              Format de données brut pour développeurs et backup complet
            </Text>
            <Button
              mode="contained"
              onPress={exportAsJSON}
              loading={isExporting}
              disabled={isExporting}
              style={styles.button}
              icon="code-braces"
              textColor={theme.background}
            >
              Exporter en JSON
            </Button>
          </View>
        </View>
      </ThemedCard>

      <ThemedCard style={styles.card}>
        <View style={{ padding: 16 }}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>ℹ️ Informations</Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            • Les exports incluent tous vos rêves enregistrés{'\n'}
            • Vos données restent privées et ne sont partagées que si vous le choisissez{'\n'}
            • Les fichiers peuvent être réimportés ou consultés sur n'importe quel appareil{'\n'}
            • Pensez à faire des sauvegardes régulières
          </Text>
        </View>
      </ThemedCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  divider: {
    marginVertical: 16,
  },
  exportOption: {
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  button: {
    marginTop: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});