import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Advice } from '../types';

interface AdviceDetailScreenProps {
  navigation: any;
  route: {
    params: {
      advice: Advice;
    };
  };
}

export const SimpleAdviceDetailScreen: React.FC<AdviceDetailScreenProps> = ({ navigation, route }) => {
  const { advice } = route.params;

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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={2}>
            {advice.title}
          </Text>
        </View>

        {/* Article Info */}
        <Card>
          <View style={styles.articleInfo}>
            <View 
              style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(advice.category)}20` }]}
            >
              <Text 
                style={[styles.categoryText, { color: getCategoryColor(advice.category) }]}
              >
                {getCategoryLabel(advice.category)}
              </Text>
            </View>
            <Text style={styles.readTime}>
              {advice.readTime} min de lecture
            </Text>
          </View>
        </Card>

        {/* Content */}
        <Card>
          <Text style={styles.content}>
            {advice.content}
          </Text>
          
          {/* Extended content based on category */}
          {advice.category === 'general' && (
            <View style={styles.extendedContent}>
              <Text style={styles.paragraph}>
                Le diabète affecte la façon dont votre corps traite le glucose (sucre) dans le sang. 
                Il existe plusieurs types de diabète, mais tous nécessitent une gestion attentive.
              </Text>
              
              <Text style={styles.subheading}>Points clés à retenir :</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• Surveillez régulièrement votre glycémie</Text>
                <Text style={styles.bulletPoint}>• Suivez votre plan de traitement</Text>
                <Text style={styles.bulletPoint}>• Maintenez une alimentation équilibrée</Text>
                <Text style={styles.bulletPoint}>• Restez actif physiquement</Text>
                <Text style={styles.bulletPoint}>• Consultez régulièrement votre médecin</Text>
              </View>
            </View>
          )}

          {advice.category === 'nutrition' && (
            <View style={styles.extendedContent}>
              <Text style={styles.paragraph}>
                Une alimentation équilibrée est essentielle pour maintenir une glycémie stable. 
                Voici quelques conseils pratiques :
              </Text>
              
              <Text style={styles.subheading}>Conseils nutritionnels :</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• Privilégiez les glucides complexes</Text>
                <Text style={styles.bulletPoint}>• Consommez des fibres à chaque repas</Text>
                <Text style={styles.bulletPoint}>• Limitez les sucres ajoutés</Text>
                <Text style={styles.bulletPoint}>• Mangez à heures régulières</Text>
                <Text style={styles.bulletPoint}>• Contrôlez les portions</Text>
              </View>
            </View>
          )}

          {advice.category === 'exercise' && (
            <View style={styles.extendedContent}>
              <Text style={styles.paragraph}>
                L'exercice physique aide à contrôler la glycémie et améliore la sensibilité à l'insuline.
              </Text>
              
              <Text style={styles.subheading}>Recommandations d'exercice :</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• 150 minutes d'activité modérée par semaine</Text>
                <Text style={styles.bulletPoint}>• Exercices de résistance 2-3 fois par semaine</Text>
                <Text style={styles.bulletPoint}>• Surveillez votre glycémie avant et après</Text>
                <Text style={styles.bulletPoint}>• Commencez progressivement</Text>
                <Text style={styles.bulletPoint}>• Consultez votre médecin avant de commencer</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Call to Action */}
        <Card style={styles.ctaCard}>
          <View style={styles.ctaContent}>
            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            <Text style={styles.ctaText}>
              Appliquez ces conseils dans votre routine quotidienne pour mieux gérer votre diabète.
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  articleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  readTime: {
    color: '#6b7280',
    fontSize: 14,
  },
  paragraph: {
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  extendedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  bulletList: {
    gap: 8,
  },
  bulletPoint: {
    color: '#374151',
    lineHeight: 20,
  },
  ctaCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    color: '#166534',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});
