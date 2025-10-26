import React, { useState } from 'react';
import { Alert, Platform, Share, StyleSheet, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useAppTheme } from '../hooks/useAppTheme';
import { ThemedCard } from './ThemedCard';

interface Dream {
  dreamText: string;
  todayDate: string;
  dreamType?: string;
  location?: string;
  characters?: string;
  emotionalIntensity?: number;
  clarity?: number;
  sleepQuality?: number;
  personalMeaning?: string;
  keywords?: string[];
  emotionBefore?: string[];
  emotionAfter?: string[];
}

export default function ExportDreams() {
  const theme = useAppTheme();
  const [isExporting, setIsExporting] = useState(false);

  const getDreams = async (): Promise<Dream[]> => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load dreams for export:', error);
      return [];
    }
  };

  const sanitizeText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;');
  };

  const formatDreamToHTML = (dream: Dream, index: number): string => {
    const date = new Date(dream.todayDate).toLocaleDateString('fr-FR');
    
    return `
      <div style="margin-bottom: 30px; page-break-inside: avoid; border-bottom: 1px solid #eee; padding-bottom: 20px;">
        <h2 style="color: #2196F3; margin-bottom: 5px;">Rêve #${index + 1}</h2>
        <p style="color: #666; margin-bottom: 15px;">${date}</p>
        
        <div style="margin-bottom: 15px;">
          <h3 style="color: #333; margin-bottom: 8px;">📝 Description</h3>
          <p style="line-height: 1.6;">${sanitizeText(dream.dreamText)}</p>
        </div>
        
        ${dream.location ? `<p><strong>📍 Lieu:</strong> ${sanitizeText(dream.location)}</p>` : ''}
        ${dream.characters ? `<p><strong>👥 Personnages:</strong> ${sanitizeText(dream.characters)}</p>` : ''}
        ${dream.emotionalIntensity ? `<p><strong>💫 Intensité:</strong> ${dream.emotionalIntensity}/10</p>` : ''}
        ${dream.clarity ? `<p><strong>🔍 Clarté:</strong> ${dream.clarity}/10</p>` : ''}
        ${dream.sleepQuality ? `<p><strong>😴 Sommeil:</strong> ${dream.sleepQuality}/10</p>` : ''}
        
        ${dream.emotionBefore?.length ? `<p><strong>😴 Émotions avant:</strong> ${dream.emotionBefore.map(e => sanitizeText(e)).join(', ')}</p>` : ''}
        ${dream.emotionAfter?.length ? `<p><strong>😊 Émotions après:</strong> ${dream.emotionAfter.map(e => sanitizeText(e)).join(', ')}</p>` : ''}
        ${dream.keywords?.length ? `<p><strong>🏷️ Mots-clés:</strong> ${dream.keywords.map(k => sanitizeText(k)).join(', ')}</p>` : ''}
        
        ${dream.personalMeaning ? `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <h4 style="color: #495057; margin-bottom: 8px;">💭 Signification personnelle</h4>
            <p style="margin: 0; line-height: 1.6;">${sanitizeText(dream.personalMeaning)}</p>
          </div>
        ` : ''}
      </div>
    `;
  };

  const formatDreamToText = (dream: Dream, index: number): string => {
    const date = new Date(dream.todayDate).toLocaleDateString('fr-FR');
    
    let text = `\n${'='.repeat(60)}\n`;
    text += `RÊVE #${index + 1} - ${date}\n`;
    text += `${'='.repeat(60)}\n\n`;
    text += `DESCRIPTION:\n${dream.dreamText}\n\n`;
    
    if (dream.location) text += `📍 Lieu: ${dream.location}\n`;
    if (dream.characters) text += `👥 Personnages: ${dream.characters}\n`;
    if (dream.emotionalIntensity) text += `💫 Intensité émotionnelle: ${dream.emotionalIntensity}/10\n`;
    if (dream.clarity) text += `🔍 Clarté: ${dream.clarity}/10\n`;
    if (dream.sleepQuality) text += `😴 Qualité du sommeil: ${dream.sleepQuality}/10\n`;
    
    if (dream.emotionBefore?.length) text += `😴 Émotions avant: ${dream.emotionBefore.join(', ')}\n`;
    if (dream.emotionAfter?.length) text += `😊 Émotions après: ${dream.emotionAfter.join(', ')}\n`;
    if (dream.keywords?.length) text += `🏷️ Mots-clés: ${dream.keywords.join(', ')}\n`;
    
    if (dream.personalMeaning) {
      text += `\n💭 SIGNIFICATION PERSONNELLE:\n${dream.personalMeaning}\n`;
    }
    
    return text;
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const dreams = await getDreams();
      if (!dreams || dreams.length === 0) {
        Alert.alert('Erreur', 'Aucun rêve à exporter');
        setIsExporting(false);
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
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
              border-bottom: 3px solid #2196F3; 
              padding-bottom: 20px; 
            }
            .header h1 { 
              color: #2196F3; 
              margin: 0 0 10px 0; 
              font-size: 28px; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌙 Mon Journal de Rêves</h1>
            <p>Exporté le ${new Date().toLocaleDateString('fr-FR')}</p>
            <p>Total: ${dreams.length} rêve${dreams.length > 1 ? 's' : ''}</p>
          </div>
          ${dreams.map((dream, index) => formatDreamToHTML(dream, index)).join('')}
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = `journal-reves-${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Partager mon journal de rêves'
        });
      }

      Alert.alert('Succès', 'Export PDF réussi !');
    } catch (error) {
      console.error('PDF export failed:', error);
      Alert.alert('Erreur', "Impossible d'exporter en PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsText = async () => {
    setIsExporting(true);
    try {
      const dreams = await getDreams();
      if (dreams.length === 0) {
        Alert.alert('Erreur', 'Aucun rêve à exporter');
        return;
      }

      let content = `MON JOURNAL DE RÊVES\n`;
      content += `Exporté le ${new Date().toLocaleDateString('fr-FR')}\n`;
      content += `Total: ${dreams.length} rêve${dreams.length > 1 ? 's' : ''}\n`;
      content += dreams.map((dream, index) => formatDreamToText(dream, index)).join('');

      if (Platform.OS === 'web') {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `journal-reves-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        await Share.share({ message: content, title: 'Mon Journal de Rêves' });
      }

      Alert.alert('Succès', 'Export texte réussi !');
    } catch (error) {
      console.error('Text export failed:', error);
      Alert.alert('Erreur', "Impossible d'exporter en texte");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsCSV = async () => {
    setIsExporting(true);
    try {
      const dreams = await getDreams();
      if (dreams.length === 0) {
        Alert.alert('Erreur', 'Aucun rêve à exporter');
        return;
      }

      let csvContent = 'Date,Type,Description,Lieu,Personnages,Intensité,Clarté,Sommeil,Émotions Avant,Émotions Après,Mots-clés,Signification\n';
      
      dreams.forEach(dream => {
        const sanitizeCSV = (text: string) => text ? text.replace(/"/g, '""').replace(/[\r\n]/g, ' ') : '';
        
        const row = [
          new Date(dream.todayDate).toLocaleDateString('fr-FR'),
          sanitizeCSV(dream.dreamType || ''),
          `"${sanitizeCSV(dream.dreamText || '')}"`,
          sanitizeCSV(dream.location || ''),
          sanitizeCSV(dream.characters || ''),
          dream.emotionalIntensity || '',
          dream.clarity || '',
          dream.sleepQuality || '',
          dream.emotionBefore?.map(e => sanitizeCSV(e)).join(';') || '',
          dream.emotionAfter?.map(e => sanitizeCSV(e || '')).join(';') || '',
          dream.keywords?.map(k => sanitizeCSV(k || '')).join(';') || '',
          dream.personalMeaning ? `"${sanitizeCSV(dream.personalMeaning)}"` : ''
        ];
        csvContent += row.join(',') + '\n';
      });

      if (Platform.OS === 'web') {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `journal-reves-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        if (FileSystem.documentDirectory) {
          const fileUri = `${FileSystem.documentDirectory}journal-reves-${new Date().toISOString().split('T')[0]}.csv`;
          await FileSystem.writeAsStringAsync(fileUri, csvContent);
          
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          }
        }
      }

      Alert.alert('Succès', 'Export CSV réussi !');
    } catch (error) {
      console.error('CSV export failed:', error);
      Alert.alert('Erreur', "Impossible d'exporter en CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsJSON = async () => {
    setIsExporting(true);
    try {
      const dreams = await getDreams();
      if (dreams.length === 0) {
        Alert.alert('Erreur', 'Aucun rêve à exporter');
        return;
      }

      const content = JSON.stringify({
        exportDate: new Date().toISOString(),
        totalDreams: dreams.length,
        dreams: dreams
      }, null, 2);

      if (Platform.OS === 'web') {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `journal-reves-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        if (FileSystem.documentDirectory) {
          const fileUri = `${FileSystem.documentDirectory}journal-reves-${new Date().toISOString().split('T')[0]}.json`;
          await FileSystem.writeAsStringAsync(fileUri, content);
          
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          }
        }

      Alert.alert('Succès', 'Export JSON réussi !');
    } catch (error) {
      console.error('JSON export failed:', error);
      Alert.alert('Erreur', "Impossible d'exporter en JSON");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedCard>
        <View style={styles.content}>
          <Text variant="titleLarge" style={{ color: theme.text, marginBottom: 8 }}>
            📤 Exporter mes rêves
          </Text>
          <Text style={{ color: theme.text, marginBottom: 24 }}>
            Exportez votre journal de rêves dans différents formats pour le sauvegarder ou le partager.
          </Text>

          <View style={styles.exportOption}>
            <Text variant="titleMedium" style={{ color: theme.text }}>📄 Format PDF</Text>
            <Text style={{ color: theme.text, marginBottom: 12, fontSize: 14 }}>
              Document formaté et imprimable avec mise en page professionnelle
            </Text>
            <Button
              mode="contained"
              onPress={exportAsPDF}
              loading={isExporting}
              disabled={isExporting}
              icon="file-pdf-box"
              buttonColor="#E53935"
            >
              Exporter en PDF
            </Button>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.exportOption}>
            <Text variant="titleMedium" style={{ color: theme.text }}>📝 Format Texte</Text>
            <Text style={{ color: theme.text, marginBottom: 12, fontSize: 14 }}>
              Export lisible avec toutes les informations formatées
            </Text>
            <Button
              mode="outlined"
              onPress={exportAsText}
              loading={isExporting}
              disabled={isExporting}
              icon="file-document"
            >
              Exporter en TXT
            </Button>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.exportOption}>
            <Text variant="titleMedium" style={{ color: theme.text }}>📊 Format CSV</Text>
            <Text style={{ color: theme.text, marginBottom: 12, fontSize: 14 }}>
              Format tableur compatible Excel et Google Sheets
            </Text>
            <Button
              mode="outlined"
              onPress={exportAsCSV}
              loading={isExporting}
              disabled={isExporting}
              icon="table"
            >
              Exporter en CSV
            </Button>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.exportOption}>
            <Text variant="titleMedium" style={{ color: theme.text }}>💾 Format JSON</Text>
            <Text style={{ color: theme.text, marginBottom: 12, fontSize: 14 }}>
              Format de données brut pour développeurs et backup complet
            </Text>
            <Button
              mode="contained"
              onPress={exportAsJSON}
              loading={isExporting}
              disabled={isExporting}
              icon="code-braces"
            >
              Exporter en JSON
            </Button>
          </View>
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
  content: {
    padding: 16,
  },
  exportOption: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
});