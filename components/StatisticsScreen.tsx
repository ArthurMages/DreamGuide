import { useAppTheme } from '@/hooks/useAppTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { ProgressBar, Text, useTheme } from 'react-native-paper';
import { ThemedCard } from './ThemedCard';

const { width } = Dimensions.get('window');

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

interface Statistics {
  total: number;
  lucidCount: number;
  lucidPercentage: number;
  avgIntensity: number;
  avgClarity: number;
  dreamTypes: { [key: string]: number };
  emotions: {
    before: { [key: string]: number };
    after: { [key: string]: number };
  };
  keywords: { [key: string]: number };
  sleepQuality: { [key: string]: number };
  toneDistribution: { positive: number; neutral: number; negative: number };
}const DREAM_TYPE_LABELS: { [key: string]: string } = {
  ordinary: '💭 Ordinaire',
  lucid: '✨ Lucide',
  nightmare: '😱 Cauchemar',
  premonitory: '🔮 Prémonitoire',
  fantasy: '🌈 Fantastique',
};

export default function StatisticsScreen() {
  const theme = useAppTheme();
  const paperTheme = useTheme();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [stats, setStats] = useState<Statistics>({
    total: 0,
    lucidCount: 0,
    lucidPercentage: 0,
    avgIntensity: 0,
    avgClarity: 0,
    dreamTypes: {},
    emotions: {
      before: {},
      after: {}
    },
    keywords: {},
    sleepQuality: {},
    toneDistribution: { positive: 0, neutral: 0, negative: 0 }
  });

  useFocusEffect(
    useCallback(() => {
      const loadDreams = async () => {
        try {
          const dreamsString = await AsyncStorage.getItem('dreams');
          if (dreamsString) {
            const loadedDreams: Dream[] = JSON.parse(dreamsString);
            setDreams(loadedDreams);
            calculateStats(loadedDreams);
          }
        } catch (error) {
          console.error('Error loading dreams:', error);
        }
      };
      loadDreams();
    }, [])
  );

  const calculateStats = (dreams: Dream[]) => {
    const newStats: Statistics = {
      total: dreams.length,
      lucidCount: 0,
      lucidPercentage: 0,
      avgIntensity: 0,
      avgClarity: 0,
      dreamTypes: {},
      emotions: {
        before: {},
        after: {}
      },
      keywords: {},
      sleepQuality: {},
      toneDistribution: { positive: 0, neutral: 0, negative: 0 }
    };

    let totalIntensity = 0;
    let totalClarity = 0;
    let intensityCount = 0;
    let clarityCount = 0;

    dreams.forEach(dream => {
      // Count lucid dreams
      if (dream.isLucidDream) {
        newStats.lucidCount++;
      }

      // Dream types
      if (dream.dreamType) {
        newStats.dreamTypes[dream.dreamType] = (newStats.dreamTypes[dream.dreamType] || 0) + 1;
      }

      // Emotions before
      dream.emotionBefore?.forEach(emotion => {
        newStats.emotions.before[emotion] = (newStats.emotions.before[emotion] || 0) + 1;
      });

      // Emotions after
      dream.emotionAfter?.forEach(emotion => {
        newStats.emotions.after[emotion] = (newStats.emotions.after[emotion] || 0) + 1;
      });

      // Keywords
      dream.keywords?.forEach(keyword => {
        newStats.keywords[keyword] = (newStats.keywords[keyword] || 0) + 1;
      });

      // Sleep quality
      if (dream.sleepQuality) {
        newStats.sleepQuality[dream.sleepQuality] = (newStats.sleepQuality[dream.sleepQuality] || 0) + 1;
      }

      // Overall tone
      if (dream.overallTone) {
        if (dream.overallTone === 'positive') newStats.toneDistribution.positive++;
        else if (dream.overallTone === 'negative') newStats.toneDistribution.negative++;
        else newStats.toneDistribution.neutral++;
      }

      // Intensity and clarity averages
      if (dream.emotionalIntensity !== undefined) {
        totalIntensity += dream.emotionalIntensity;
        intensityCount++;
      }
      if (dream.clarity !== undefined) {
        totalClarity += dream.clarity;
        clarityCount++;
      }
    });

    // Calculate percentages and averages
    newStats.lucidPercentage = dreams.length > 0 ? (newStats.lucidCount / dreams.length) * 100 : 0;
    newStats.avgIntensity = intensityCount > 0 ? totalIntensity / intensityCount : 0;
    newStats.avgClarity = clarityCount > 0 ? totalClarity / clarityCount : 0;

    setStats(newStats);
  };

  const renderDreamTypeStats = () => {
    const total = dreams.length;
    return Object.entries(stats.dreamTypes).map(([type, count]) => (
      <View key={type} style={styles.statRow}>
        <Text style={styles.text}>{DREAM_TYPE_LABELS[type] || type}: {count}</Text>
        <View style={styles.progressBarContainer}>
          <ProgressBar
            progress={total > 0 ? count / total : 0}
            color={theme.accent}
            style={styles.progressBar}
          />
        </View>
      </View>
    ));
  };

  const renderEmotionStats = (emotions: { [key: string]: number }, title: string) => {
    const total = Object.values(emotions).reduce((acc, val) => acc + val, 0);
    return (
      <ThemedCard style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.cardTitle, { color: '#000000' }]}>{title}</Text>
        {Object.entries(emotions)
          .sort(([, a], [, b]) => b - a)
          .map(([emotion, count]) => (
            <View key={emotion} style={styles.statRow}>
              <Text style={{ color: '#000000' }}>{emotion}: {count}</Text>
              <View style={styles.progressBarContainer}>
                <ProgressBar
                  progress={total > 0 ? count / total : 0}
                  color={theme.accent}
                  style={styles.progressBar}
                />
              </View>
            </View>
          ))}
      </ThemedCard>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedCard style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.cardTitle, { color: '#000000' }]}>Statistiques générales</Text>
        <Text style={{ color: '#000000' }}>Total de rêves: {stats.total}</Text>
        <Text style={{ color: '#000000' }}>Rêves lucides: {stats.lucidCount} ({stats.lucidPercentage.toFixed(1)}%)</Text>
        <Text style={{ color: '#000000' }}>Intensité moyenne: {stats.avgIntensity.toFixed(1)}/5</Text>
        <Text style={{ color: '#000000' }}>Clarté moyenne: {stats.avgClarity.toFixed(1)}/5</Text>
      </ThemedCard>

      <ThemedCard style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.cardTitle, { color: '#000000' }]}>Types de rêves</Text>
        {renderDreamTypeStats()}
      </ThemedCard>

      {renderEmotionStats(stats.emotions.before, 'Émotions avant le rêve')}
      {renderEmotionStats(stats.emotions.after, 'Émotions après le rêve')}

      <ThemedCard style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.cardTitle, { color: '#000000' }]}>Qualité du sommeil</Text>
        {Object.entries(stats.sleepQuality).map(([quality, count]) => (
          <View key={quality} style={styles.statRow}>
            <Text style={styles.text}>{quality}: {count}</Text>
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={stats.total > 0 ? count / stats.total : 0}
                color={theme.accent}
                style={styles.progressBar}
              />
            </View>
          </View>
        ))}
      </ThemedCard>

      <ThemedCard style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.cardTitle, { color: '#000000' }]}>Distribution des tonalités</Text>
        <View style={styles.statRow}>
          <Text style={{ color: '#000000' }}>Positive: {stats.toneDistribution.positive}</Text>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={stats.total > 0 ? stats.toneDistribution.positive / stats.total : 0}
              color={theme.accent}
              style={styles.progressBar}
            />
          </View>
        </View>
        <View style={styles.statRow}>
          <Text style={{ color: '#000000' }}>Neutre: {stats.toneDistribution.neutral}</Text>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={stats.total > 0 ? stats.toneDistribution.neutral / stats.total : 0}
              color={theme.accent}
              style={styles.progressBar}
            />
          </View>
        </View>
        <View style={styles.statRow}>
          <Text style={{ color: '#000000' }}>Négative: {stats.toneDistribution.negative}</Text>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={stats.total > 0 ? stats.toneDistribution.negative / stats.total : 0}
              color={theme.accent}
              style={styles.progressBar}
            />
          </View>
        </View>
      </ThemedCard>

      <ThemedCard style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
        <Text style={[styles.cardTitle, { color: '#000000' }]}>Mots-clés fréquents</Text>
        {Object.entries(stats.keywords)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([keyword, count]) => (
            <View key={keyword} style={styles.statRow}>
              <Text style={{ color: '#000000' }}>{keyword}: {count}</Text>
              <View style={styles.progressBarContainer}>
                <ProgressBar
                  progress={stats.total > 0 ? count / stats.total : 0}
                  color={theme.accent}
                  style={styles.progressBar}
                />
              </View>
            </View>
          ))}
      </ThemedCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  text: {
    color: '#000000',
  },
  statRow: {
    marginVertical: 4,
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});