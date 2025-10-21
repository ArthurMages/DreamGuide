import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, Platform, Share, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text } from 'react-native-paper';

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
}

export default function ExportDreams() {
  const [isExporting, setIsExporting] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

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

    // Hashtags
    if (dream.hashtags) {
      const tags = [
        dream.hashtags.hashtag1?.label,
        dream.hashtags.hashtag2?.label,
        dream.hashtags.hashtag3?.label,
      ].filter(Boolean);
      if (tags.length > 0) {
        text += `#️⃣ Hashtags: ${tags.map(t => `#${t}`).join(' ')}\n`;
      }
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
      const hashtags = [
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
      <Card style={[styles.card, { backgroundColor: theme.background }]}>
        <Card.Content>
          <Text style={[styles.title, { color: theme.text }]}>📤 Exporter mes rêves</Text>
          <Text style={[styles.description, { color: theme.text }]}>
            Exportez votre journal de rêves dans différents formats pour le sauvegarder ou le partager.
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.exportOption}>
            <Text style={styles.optionTitle}>📄 Format Texte</Text>
            <Text style={styles.optionDescription}>
              Export lisible avec toutes les informations formatées
            </Text>
            <Button
              mode="contained"
              onPress={exportAsText}
              loading={isExporting}
              disabled={isExporting}
              style={styles.button}
              icon="file-document"
            >
              Exporter en TXT
            </Button>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.exportOption}>
            <Text style={styles.optionTitle}>📊 Format CSV</Text>
            <Text style={styles.optionDescription}>
              Format tableur compatible Excel et Google Sheets
            </Text>
            <Button
              mode="contained"
              onPress={exportAsCSV}
              loading={isExporting}
              disabled={isExporting}
              style={styles.button}
              icon="table"
            >
              Exporter en CSV
            </Button>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.exportOption}>
            <Text style={styles.optionTitle}>💾 Format JSON</Text>
            <Text style={styles.optionDescription}>
              Format de données brut pour développeurs et backup complet
            </Text>
            <Button
              mode="contained"
              onPress={exportAsJSON}
              loading={isExporting}
              disabled={isExporting}
              style={styles.button}
              icon="code-braces"
            >
              Exporter en JSON
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.infoTitle}>ℹ️ Informations</Text>
          <Text style={styles.infoText}>
            • Les exports incluent tous vos rêves enregistrés{'\n'}
            • Vos données restent privées et ne sont partagées que si vous le choisissez{'\n'}
            • Les fichiers peuvent être réimportés ou consultés sur n'importe quel appareil{'\n'}
            • Pensez à faire des sauvegardes régulières
          </Text>
        </Card.Content>
      </Card>
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
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
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