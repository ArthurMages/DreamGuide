import { useAppTheme } from '@/hooks/useAppTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
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
  sleepQuality?: number;
  personalMeaning?: string;
  overallTone?: string;
  hashtagsArray?: { id: string; label: string }[];
}

const getDocumentDirectory = () => {
  return ((FileSystem as any).documentDirectory as string) || '';
};

const qualityLabel = (v: number) => {
  if (v <= 2) return 'Cauchemar';
  if (v <= 4) return 'Très mauvaise';
  if (v <= 6) return 'Moyenne';
  if (v <= 8) return 'Bonne';
  return 'Beaux rêves';
};

export default function ExportDreams() {
  const [isExporting, setIsExporting] = useState(false);
  const theme = useAppTheme();

  const formatDreamToHTML = (dream: Dream, index: number): string => {
    const date = new Date(dream.todayDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const typeLabels: { [key: string]: string } = {
      ordinary: '💭 Ordinaire',
      lucid: '✨ Lucide',
      nightmare: '😱 Cauchemar',
      premonitory: '🔮 Prémonitoire',
      fantasy: '🌈 Fantastique',
    };

    const toneLabels: { [key: string]: string } = {
      positive: '😊 Positive',
      neutral: '😐 Neutre',
      negative: '😔 Négative',
    };

    // Récupérer les hashtags
    const tagsArray = dream.hashtagsArray && Array.isArray(dream.hashtagsArray)
      ? dream.hashtagsArray.map((h: any) => h?.label).filter(Boolean)
      : [
        dream.hashtags?.hashtag1?.label,
        dream.hashtags?.hashtag2?.label,
        dream.hashtags?.hashtag3?.label,
      ].filter(Boolean);

    let html = `
      <div style="margin-bottom: 40px; page-break-inside: avoid;">
        <div style="border-bottom: 3px solid #2196F3; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="color: #2196F3; margin: 0;">Rêve #${index + 1}</h2>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">${date}</p>
        </div>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 0; font-weight: bold;">Type de rêve</p>
          <p style="margin: 5px 0 0 0; font-size: 18px;">${typeLabels[dream.dreamType || 'ordinary']}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">📝 Description</h3>
          <p style="line-height: 1.6; color: #333; white-space: pre-wrap;">${dream.dreamText}</p>
        </div>
    `;

    if (dream.location) {
      html += `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0;"><strong>📍 Lieu:</strong> ${dream.location}</p>
        </div>
      `;
    }

    if (dream.characters) {
      html += `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0;"><strong>👥 Personnages:</strong> ${dream.characters}</p>
        </div>
      `;
    }

    if (dream.emotionBefore && dream.emotionBefore.length > 0) {
      html += `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0;"><strong>😴 Émotions avant:</strong> ${dream.emotionBefore.join(', ')}</p>
        </div>
      `;
    }

    if (dream.emotionAfter && dream.emotionAfter.length > 0) {
      html += `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0;"><strong>😊 Émotions après:</strong> ${dream.emotionAfter.join(', ')}</p>
        </div>
      `;
    }

    if (dream.emotionalIntensity) {
      html += `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0;"><strong>💫 Intensité émotionnelle:</strong> ${dream.emotionalIntensity}/10</p>
        </div>
      `;
    }

    if (dream.clarity) {
      html += `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0;"><strong>🔍 Clarté:</strong> ${dream.clarity}/10</p>
        </div>
      `;
    }

    if (dream.overallTone) {
      html += `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0;"><strong>🎭 Tonalité:</strong> ${toneLabels[dream.overallTone]}</p>
        </div>
      `;
    }

    if (dream.sleepQuality) {
      html += `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0;"><strong>😴 Qualité du sommeil:</strong> ${qualityLabel(dream.sleepQuality)} (${dream.sleepQuality}/10)</p>
        </div>
      `;
    }

    if (dream.keywords && dream.keywords.length > 0) {
      html += `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0;"><strong>🏷️ Mots-clés:</strong> ${dream.keywords.join(', ')}</p>
        </div>
      `;
    }

    if (tagsArray.length > 0) {
      html += `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0;"><strong>#️⃣ Hashtags:</strong> ${tagsArray.map((t: string) => `#${t}`).join(' ')}</p>
        </div>
      `;
    }

    if (dream.personalMeaning) {
      html += `
        <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h4 style="color: #e65100; margin: 0 0 10px 0;">💭 Signification personnelle</h4>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${dream.personalMeaning}</p>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  };

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

    const typeLabels: { [key: string]: string } = {
      ordinary: 'Ordinaire',
      lucid: 'Lucide',
      nightmare: 'Cauchemar',
      premonitory: 'Prémonitoire',
      fantasy: 'Fantastique',
    };
    text += `Type: ${typeLabels[dream.dreamType || 'ordinary']}\n\n`;

    text += `DESCRIPTION:\n${dream.dreamText}\n\n`;

    if (dream.location) {
      text += `📍 Lieu: ${dream.location}\n`;
    }

    if (dream.characters) {
      text += `👥 Personnages: ${dream.characters}\n`;
    }

    if (dream.emotionBefore && dream.emotionBefore.length > 0) {
      text += `😴 Émotions avant: ${dream.emotionBefore.join(', ')}\n`;
    }
    if (dream.emotionAfter && dream.emotionAfter.length > 0) {
      text += `😊 Émotions après: ${dream.emotionAfter.join(', ')}\n`;
    }

    if (dream.emotionalIntensity) {
      text += `💫 Intensité émotionnelle: ${dream.emotionalIntensity}/10\n`;
    }
    if (dream.clarity) {
      text += `🔍 Clarté: ${dream.clarity}/10\n`;
    }

    if (dream.overallTone) {
      const tones: { [key: string]: string } = {
        positive: 'Positive',
        neutral: 'Neutre',
        negative: 'Négative',
      };
      text += `🎭 Tonalité: ${tones[dream.overallTone]}\n`;
    }

    if (dream.sleepQuality) {
      text += `😴 Qualité du sommeil: ${qualityLabel(dream.sleepQuality)} (${dream.sleepQuality}/10)\n`;
    }

    if (dream.keywords && dream.keywords.length > 0) {
      text += `🏷️ Mots-clés: ${dream.keywords.join(', ')}\n`;
    }

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

  const exportAsPDF = async () => {
    try {
      setIsExporting(true);
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreams: Dream[] = data ? JSON.parse(data) : [];

      if (dreams.length === 0) {
        Alert.alert('Erreur', 'Aucun rêve à exporter');
        return;
      }

      // Créer le HTML complet pour le PDF
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              padding: 30px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 4px solid #2196F3;
            }
            .header h1 {
              color: #2196F3;
              font-size: 32px;
              margin: 0 0 10px 0;
            }
            .header p {
              color: #666;
              font-size: 16px;
              margin: 5px 0;
            }
            @media print {
              .page-break {
                page-break-before: always;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌙 Mon Journal de Rêves</h1>
            <p>Exporté le ${new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p>Nombre total de rêves: ${dreams.length}</p>
          </div>
      `;

      dreams.forEach((dream, index) => {
        if (index > 0) {
          htmlContent += '<div class="page-break"></div>';
        }
        htmlContent += formatDreamToHTML(dream, index);
      });

      htmlContent += `
        </body>
        </html>
      `;

      // Générer le PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });

      if (Platform.OS === 'web') {
        // Pour le web, télécharger directement
        const link = document.createElement('a');
        link.href = uri;
        link.download = `mes-reves-${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
      } else {
        // Pour mobile, partager le fichier
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Partager mon journal de rêves'
          });
        } else {
          Alert.alert('Succès', `PDF créé: ${uri}`);
        }
      }

      Alert.alert('Succès', 'Export PDF réussi ! 📄');
    } catch (error) {
      console.error('Erreur export PDF:', error);
      Alert.alert('Erreur', "Impossible d'exporter en PDF");
    } finally {
      setIsExporting(false);
    }
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
        const blob = new Blob([fullText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mes-reves-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
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
            <Text variant="titleMedium" style={{ color: theme.text }}>📄 Format PDF</Text>
            <Text variant="bodyMedium" style={{ color: theme.text, marginBottom: 12 }}>
              Document formaté et imprimable avec mise en page professionnelle
            </Text>
            <Button
              mode="contained"
              onPress={exportAsPDF}
              loading={isExporting}
              disabled={isExporting}
              style={styles.button}
              icon="file-pdf-box"
              buttonColor="#E53935"
              textColor="#FFFFFF"
            >
              Exporter en PDF
            </Button>
          </View>

          <Divider style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.exportOption}>
            <Text variant="titleMedium" style={{ color: theme.text }}>📝 Format Texte</Text>
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
            • Le format PDF offre la meilleure présentation pour l'impression{'\n'}
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