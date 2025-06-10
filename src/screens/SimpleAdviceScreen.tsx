import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Advice } from '../types';
import { resetAppData, initializeAppData, clearGlycemiaData, clearRemindersData } from '../utils/initializeData';

export const SimpleAdviceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [debugTaps, setDebugTaps] = useState(0);

  const handleDebugTap = () => {
    const newTaps = debugTaps + 1;
    setDebugTaps(newTaps);

    if (newTaps >= 5) {
      Alert.alert(
        'Mode Debug',
        'Que voulez-vous faire ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Vider glycémie',
            onPress: async () => {
              try {
                await clearGlycemiaData();
                Alert.alert('Succès', 'Les données de glycémie ont été supprimées');
                setDebugTaps(0);
              } catch (error) {
                Alert.alert('Erreur', 'Impossible de vider les données');
              }
            }
          },
          {
            text: 'Vider rappels',
            onPress: async () => {
              try {
                await clearRemindersData();
                Alert.alert('Succès', 'Les rappels ont été supprimés');
                setDebugTaps(0);
              } catch (error) {
                Alert.alert('Erreur', 'Impossible de vider les rappels');
              }
            }
          },
          {
            text: 'Tout réinitialiser',
            style: 'destructive',
            onPress: async () => {
              try {
                await resetAppData();
                await initializeAppData();
                Alert.alert('Succès', 'Toutes les données ont été réinitialisées');
                setDebugTaps(0);
              } catch (error) {
                Alert.alert('Erreur', 'Impossible de réinitialiser les données');
              }
            }
          }
        ]
      );
    }
  };
  const adviceData: Advice[] = [
    {
      id: '1',
      title: 'Qu\'est-ce que le diabète ?',
      content: 'Le diabète est une maladie chronique caractérisée par un niveau élevé de glucose (sucre) dans le sang...',
      category: 'general',
      readTime: 5,
    },
    {
      id: '2',
      title: 'Alimentation équilibrée',
      content: 'Une alimentation équilibrée est essentielle pour gérer votre diabète...',
      category: 'nutrition',
      readTime: 8,
    },
    {
      id: '3',
      title: 'L\'importance de l\'exercice',
      content: 'L\'activité physique régulière aide à contrôler la glycémie...',
      category: 'exercise',
      readTime: 6,
    },
    {
      id: '4',
      title: 'Gestion des médicaments',
      content: 'Prendre vos médicaments selon les prescriptions est crucial...',
      category: 'medication',
      readTime: 4,
    },
  ];

  const getCategoryIcon = (category: Advice['category']) => {
    switch (category) {
      case 'nutrition':
        return 'restaurant';
      case 'exercise':
        return 'fitness';
      case 'medication':
        return 'medical';
      case 'general':
        return 'information-circle';
      default:
        return 'book';
    }
  };

  const getCategoryColor = (category: Advice['category']) => {
    switch (category) {
      case 'nutrition':
        return '#f59e0b';
      case 'exercise':
        return '#22c55e';
      case 'medication':
        return '#ef4444';
      case 'general':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getCategoryLabel = (category: Advice['category']) => {
    switch (category) {
      case 'nutrition':
        return 'Nutrition';
      case 'exercise':
        return 'Exercice';
      case 'medication':
        return 'Médicaments';
      case 'general':
        return 'Général';
      default:
        return 'Conseil';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Conseils"
        rightComponent={
          <TouchableOpacity onPress={handleDebugTap} style={styles.debugButton}>
            <Ionicons name="settings-outline" size={24} color="#6b7280" />
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>

        {/* Featured Article */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('DiabetesInfo')}
          activeOpacity={0.7}
        >
          <Card style={styles.featuredCard}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredText}>
                <Text style={styles.featuredTitle}>
                  Qu'est-ce que le diabète ?
                </Text>
                <Text style={styles.featuredDescription}>
                  Le diabète est une maladie chronique caractérisée par un niveau élevé de glucose (sucre) dans le sang. Cela est souvent dû à un manque d'insuline ou à une mauvaise utilisation de celle-ci par l'organisme.
                </Text>
                <View style={styles.featuredFooter}>
                  <Text style={styles.featuredReadTime}>5 min de lecture</Text>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>En savoir plus</Text>
                  </View>
                </View>
              </View>
              <View style={styles.featuredIcon}>
                <View style={styles.featuredIconContainer}>
                  <Ionicons name="information-circle" size={32} color="white" />
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Categories */}
        <View>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <View style={styles.categoriesContainer}>
            {[
              { category: 'nutrition', label: 'Nutrition', icon: 'restaurant', color: '#f59e0b' },
              { category: 'exercise', label: 'Exercice', icon: 'fitness', color: '#22c55e' },
              { category: 'medication', label: 'Médicaments', icon: 'medical', color: '#ef4444' },
              { category: 'general', label: 'Général', icon: 'information-circle', color: '#3b82f6' },
            ].map((item) => (
              <TouchableOpacity
                key={item.category}
                style={styles.categoryCard}
                activeOpacity={0.7}
              >
                <View style={styles.categoryContent}>
                  <View 
                    style={[styles.categoryIcon, { backgroundColor: `${item.color}20` }]}
                  >
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text style={styles.categoryLabel}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Articles List */}
        <View>
          <Text style={styles.sectionTitle}>Articles recommandés</Text>
          <View style={styles.articlesList}>
            {adviceData.map((advice) => (
              <TouchableOpacity
                key={advice.id}
                onPress={() => navigation.navigate('AdviceDetail', { advice })}
                activeOpacity={0.7}
              >
                <Card>
                  <View style={styles.articleContent}>
                    <View 
                      style={[styles.articleIcon, { backgroundColor: `${getCategoryColor(advice.category)}20` }]}
                    >
                      <Ionicons 
                        name={getCategoryIcon(advice.category) as any} 
                        size={20} 
                        color={getCategoryColor(advice.category)} 
                      />
                    </View>
                    
                    <View style={styles.articleText}>
                      <Text style={styles.articleTitle}>
                        {advice.title}
                      </Text>
                      <Text style={styles.articleDescription} numberOfLines={2}>
                        {advice.content}
                      </Text>
                      <View style={styles.articleFooter}>
                        <View 
                          style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(advice.category)}20` }]}
                        >
                          <Text 
                            style={[styles.categoryBadgeText, { color: getCategoryColor(advice.category) }]}
                          >
                            {getCategoryLabel(advice.category)}
                          </Text>
                        </View>
                        <Text style={styles.readTime}>
                          {advice.readTime} min de lecture
                        </Text>
                      </View>
                    </View>
                    
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Tips */}
        <Card style={styles.tipCard}>
          <View style={styles.tipContent}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb" size={20} color="#22c55e" />
            </View>
            <View style={styles.tipText}>
              <Text style={styles.tipTitle}>Conseil du jour</Text>
              <Text style={styles.tipDescription}>
                Buvez beaucoup d'eau tout au long de la journée. L'hydratation aide à maintenir une glycémie stable.
              </Text>
            </View>
          </View>
        </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  debugButton: {
    padding: 4,
  },
  featuredCard: {
    backgroundColor: '#3b82f6',
    borderWidth: 0,
    marginBottom: 16,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredText: {
    flex: 1,
  },
  featuredTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  featuredDescription: {
    color: '#dbeafe',
    fontSize: 14,
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredReadTime: {
    color: '#bfdbfe',
    fontSize: 14,
    marginRight: 16,
  },
  featuredBadge: {
    backgroundColor: '#60a5fa',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  featuredBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  featuredIcon: {
    marginLeft: 16,
  },
  featuredIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#60a5fa',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  articlesList: {
    gap: 12,
    marginBottom: 24,
  },
  articleContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  articleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  articleText: {
    flex: 1,
  },
  articleTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  articleDescription: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 8,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  readTime: {
    color: '#9ca3af',
    fontSize: 12,
  },
  tipCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipText: {
    flex: 1,
  },
  tipTitle: {
    fontWeight: '600',
    color: '#14532d',
    marginBottom: 8,
  },
  tipDescription: {
    color: '#166534',
    fontSize: 14,
  },
});
