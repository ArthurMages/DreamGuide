import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';

const { width } = Dimensions.get('window');

// Définition des couleurs constantes pour le thème clair
const lightThemeColors = {
  background: '#fff',
  text: '#000',
  card: '#fff',
};

interface Dream {
  dreamText: string;
  isLucidDream: boolean;
  todayDate: string;
  dreamType?: string;
  emotionBefore?: string[];
  emotionAfter?: string[];
  emotionalIntensity?: number;
  clarity?: number;
  keywords?: string[];
  sleepQuality?: string;
  overallTone?: string;
}

export default function StatisticsScreen() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    lucidCount: 0,
    lucidPercentage: 0,
    avgIntensity: 0,
    avgClarity: 0,
    dreamTypes: {} as { [key: string]: number },
    emotions: {} as { [key: string]: number },
    toneDistribution: { positive: 0, neutral: 0, negative: 0 },
    sleepQuality: {} as { [key: string]: number },
    topKeywords: [] as { word: string; count: number }[],
  });

  const fetchDreamsAndCalculateStats = async () => {
    try {
      const data = await AsyncStorage.getItem('dreamFormDataArray');
      const dreamFormDataArray: Dream[] = data ? JSON.parse(data) : [];
      const validDreams = dreamFormDataArray.filter(dream => dream && dream.dreamText);
      setDreams(validDreams);

      if (validDreams.length === 0) {
        return;
      }

      // Calculer les statistiques
      const lucidCount = validDreams.filter(d => d.isLucidDream || d.dreamType === 'lucid').length;

      let totalIntensity = 0;
      let intensityCount = 0;
      let totalClarity = 0;
      let clarityCount = 0;

      const dreamTypes: { [key: string]: number } = {};
      const emotions: { [key: string]: number } = {};
      const toneDistribution = { positive: 0, neutral: 0, negative: 0 };
      const sleepQuality: { [key: string]: number } = {};
      const keywordMap: { [key: string]: number } = {};

      validDreams.forEach(dream => {
        // Intensité et clarté
        if (dream.emotionalIntensity) {
          totalIntensity += dream.emotionalIntensity;
          intensityCount++;
        }
        if (dream.clarity) {
          totalClarity += dream.clarity;
          clarityCount++;
        }

        // Types de rêves
        const type = dream.dreamType || 'ordinary';
        dreamTypes[type] = (dreamTypes[type] || 0) + 1;

        // Émotions
        const allEmotions = [...(dream.emotionBefore || []), ...(dream.emotionAfter || [])];
        allEmotions.forEach(emotion => {
          emotions[emotion] = (emotions[emotion] || 0) + 1;
        });

        // Tonalité
        if (dream.overallTone) {
          toneDistribution[dream.overallTone as keyof typeof toneDistribution]++;
        }

        // Qualité du sommeil
        if (dream.sleepQuality) {
          sleepQuality[dream.sleepQuality] = (sleepQuality[dream.sleepQuality] || 0) + 1;
        }

        // Mots-clés
        if (dream.keywords) {
          dream.keywords.forEach(keyword => {
            keywordMap[keyword] = (keywordMap[keyword] || 0) + 1;
          });
        }
      });

      // Top mots-clés
      const topKeywords = Object.entries(keywordMap)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setStats({
        total: validDreams.length,
        lucidCount,
        lucidPercentage: (lucidCount / validDreams.length) * 100,
        avgIntensity: intensityCount > 0 ? totalIntensity / intensityCount : 0,
        avgClarity: clarityCount > 0 ? totalClarity / clarityCount : 0,
        dreamTypes,
        emotions,
        toneDistribution,
        sleepQuality,
        topKeywords,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDreamsAndCalculateStats();
    }, [])
  );

  const DREAM_TYPE_LABELS: { [key: string]: string } = {
    ordinary: '💭 Ordinaire',
    lucid: '✨ Lucide',
    nightmare: '😱 Cauchemar',
    premonitory: '🔮 Prémonitoire',
    fantasy: '🌈 Fantastique',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Vue d'ensemble */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>📊 Vue d'ensemble</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewNumber}>{stats.total}</Text>
              <Text style={styles.overviewLabel}>Rêves totaux</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewNumber}>{stats.lucidCount}</Text>
              <Text style={styles.overviewLabel}>Rêves lucides</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewNumber}>{stats.lucidPercentage.toFixed(1)}%</Text>
              <Text style={styles.overviewLabel}>Taux de lucidité</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Intensité et Clarté */}
      {stats.total > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>💫 Moyennes</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Intensité émotionnelle</Text>
              <View style={styles.progressContainer}>
                <ProgressBar
                  progress={stats.avgIntensity / 10}
                  color="#FF6B6B"
                  style={styles.progressBar}
                />
                <Text style={styles.statValue}>{stats.avgIntensity.toFixed(1)}/10</Text>
              </View>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Clarté des rêves</Text>
              <View style={styles.progressContainer}>
                <ProgressBar
                  progress={stats.avgClarity / 10}
                  color="#4ECDC4"
                  style={styles.progressBar}
                />
                <Text style={styles.statValue}>{stats.avgClarity.toFixed(1)}/10</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Types de rêves */}
      {Object.keys(stats.dreamTypes).length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🌟 Types de rêves</Text>
            {Object.entries(stats.dreamTypes)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => (
                <View key={type} style={styles.barRow}>
                  <Text style={styles.barLabel}>
                    {DREAM_TYPE_LABELS[type] || type}
                  </Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        { width: `${(count / stats.total) * 100}%` },
                      ]}
                    />
                    <Text style={styles.barCount}>{count}</Text>
                  </View>
                </View>
              ))}
          </Card.Content>
        </Card>
      )}

      {/* Tonalité globale */}
      {stats.total > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🎭 Tonalité globale</Text>
            <View style={styles.toneContainer}>
              <View style={styles.toneItem}>
                <Text style={styles.toneEmoji}>😊</Text>
                <Text style={styles.toneLabel}>Positive</Text>
                <Text style={styles.toneCount}>{stats.toneDistribution.positive}</Text>
                <Text style={styles.tonePercentage}>
                  {((stats.toneDistribution.positive / stats.total) * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.toneItem}>
                <Text style={styles.toneEmoji}>😐</Text>
                <Text style={styles.toneLabel}>Neutre</Text>
                <Text style={styles.toneCount}>{stats.toneDistribution.neutral}</Text>
                <Text style={styles.tonePercentage}>
                  {((stats.toneDistribution.neutral / stats.total) * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.toneItem}>
                <Text style={styles.toneEmoji}>😔</Text>
                <Text style={styles.toneLabel}>Négative</Text>
                <Text style={styles.toneCount}>{stats.toneDistribution.negative}</Text>
                <Text style={styles.tonePercentage}>
                  {((stats.toneDistribution.negative / stats.total) * 100).toFixed(0)}%
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Émotions récurrentes */}
      {Object.keys(stats.emotions).length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>💭 Émotions récurrentes</Text>
            <View style={styles.emotionGrid}>
              {Object.entries(stats.emotions)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([emotion, count]) => (
                  <View key={emotion} style={styles.emotionBadge}>
                    <Text style={styles.emotionName}>{emotion}</Text>
                    <Text style={styles.emotionCount}>{count}</Text>
                  </View>
                ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Top mots-clés */}
      {stats.topKeywords.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🏷️ Mots-clés les plus fréquents</Text>
            {stats.topKeywords.map(({ word, count }, index) => (
              <View key={word} style={styles.keywordRow}>
                <Text style={styles.keywordRank}>#{index + 1}</Text>
                <Text style={styles.keywordWord}>{word}</Text>
                <Text style={styles.keywordCount}>{count}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Qualité du sommeil */}
      {Object.keys(stats.sleepQuality).length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>😴 Qualité du sommeil</Text>
            {Object.entries(stats.sleepQuality)
              .sort((a, b) => b[1] - a[1])
              .map(([quality, count]) => (
                <View key={quality} style={styles.barRow}>
                  <Text style={styles.barLabel}>{quality}</Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        { width: `${(count / stats.total) * 100}%`, backgroundColor: '#9B59B6' },
                      ]}
                    />
                    <Text style={styles.barCount}>{count}</Text>
                  </View>
                </View>
              ))}
          </Card.Content>
        </Card>
      )}

      {stats.total === 0 && (
        <Card style={styles.card}>
          <Card.Content style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>Pas encore de statistiques</Text>
            <Text style={styles.emptySubtext}>
              Commencez à enregistrer vos rêves pour voir vos statistiques personnelles
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffffff',
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#ffffffff',
    marginTop: 4,
    textAlign: 'center',
  },
  statRow: {
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#ffffffff',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffffff',
    minWidth: 40,
  },
  barRow: {
    marginBottom: 12,
  },
  barLabel: {
    fontSize: 14,
    color: '#ffffffff',
    marginBottom: 6,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    height: 24,
    backgroundColor: '#6366F1',
    borderRadius: 4,
    minWidth: 2,
  },
  barCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    minWidth: 30,
  },
  toneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toneItem: {
    alignItems: 'center',
  },
  toneEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  toneLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  toneCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  tonePercentage: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  emotionBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emotionName: {
    fontSize: 14,
    color: '#000000ff',
  },
  emotionCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6366F1',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  keywordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  keywordRank: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    width: 40,
  },
  keywordWord: {
    flex: 1,
    fontSize: 14,
    color: '#ffffffff',
  },
  keywordCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366F1',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});