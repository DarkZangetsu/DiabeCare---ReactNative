import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const SimpleDiabetesInfoScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
          <Text style={styles.title}>Qu'est-ce que le diabète ?</Text>
        </View>

        {/* Main Content */}
        <Card>
          <View style={styles.mainContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle" size={32} color="#3b82f6" />
            </View>
            
            <Text style={styles.sectionTitle}>
              Comprendre le diabète
            </Text>
            
            <Text style={styles.paragraph}>
              Le diabète est une maladie chronique caractérisée par un niveau élevé de glucose (sucre) dans le sang. 
              Cela est souvent dû à un manque d'insuline ou à une mauvaise utilisation de celle-ci par l'organisme.
            </Text>
            
            <Text style={styles.paragraph}>
              L'insuline est une hormone produite par le pancréas qui permet aux cellules d'utiliser le glucose 
              comme source d'énergie. Quand ce processus ne fonctionne pas correctement, le glucose s'accumule 
              dans le sang.
            </Text>
          </View>
        </Card>

        {/* Types of Diabetes */}
        <Card>
          <Text style={styles.sectionTitle}>Types de diabète</Text>
          
          <View style={styles.typesList}>
            <View style={[styles.typeItem, { borderLeftColor: '#3b82f6' }]}>
              <Text style={styles.typeTitle}>Diabète de type 1</Text>
              <Text style={styles.typeDescription}>
                Le pancréas ne produit pas ou très peu d'insuline. Généralement diagnostiqué chez les enfants et jeunes adultes.
              </Text>
            </View>
            
            <View style={[styles.typeItem, { borderLeftColor: '#ea580c' }]}>
              <Text style={styles.typeTitle}>Diabète de type 2</Text>
              <Text style={styles.typeDescription}>
                Le corps ne produit pas assez d'insuline ou n'utilise pas efficacement l'insuline produite. 
                Le plus fréquent (90% des cas).
              </Text>
            </View>
            
            <View style={[styles.typeItem, { borderLeftColor: '#ec4899' }]}>
              <Text style={styles.typeTitle}>Diabète gestationnel</Text>
              <Text style={styles.typeDescription}>
                Développé pendant la grossesse, disparaît généralement après l'accouchement.
              </Text>
            </View>
          </View>
        </Card>

        {/* Symptoms */}
        <Card>
          <Text style={styles.sectionTitle}>Symptômes principaux</Text>
          
          <View style={styles.symptomsList}>
            {[
              { icon: 'water', text: 'Soif excessive', color: '#3b82f6' },
              { icon: 'restaurant', text: 'Faim constante', color: '#f59e0b' },
              { icon: 'body', text: 'Perte de poids inexpliquée', color: '#ef4444' },
              { icon: 'eye', text: 'Vision floue', color: '#8b5cf6' },
              { icon: 'battery-dead', text: 'Fatigue persistante', color: '#6b7280' },
              { icon: 'medical', text: 'Cicatrisation lente', color: '#22c55e' },
            ].map((symptom, index) => (
              <View key={index} style={styles.symptomItem}>
                <View 
                  style={[styles.symptomIcon, { backgroundColor: `${symptom.color}20` }]}
                >
                  <Ionicons name={symptom.icon as any} size={16} color={symptom.color} />
                </View>
                <Text style={styles.symptomText}>{symptom.text}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Management */}
        <Card>
          <Text style={styles.sectionTitle}>Gestion du diabète</Text>
          
          <Text style={styles.paragraph}>
            Bien que le diabète soit une maladie chronique, il peut être géré efficacement avec :
          </Text>
          
          <View style={styles.managementList}>
            {[
              'Surveillance régulière de la glycémie',
              'Alimentation équilibrée et contrôlée',
              'Activité physique régulière',
              'Prise de médicaments selon prescription',
              'Suivi médical régulier',
              'Gestion du stress',
            ].map((item, index) => (
              <View key={index} style={styles.managementItem}>
                <View style={styles.bullet} />
                <Text style={styles.managementText}>{item}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Call to Action */}
        <Card style={styles.ctaCard}>
          <View style={styles.ctaContent}>
            <View style={styles.ctaIcon}>
              <Ionicons name="heart" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.ctaTitle}>
              Prenez soin de votre santé
            </Text>
            <Text style={styles.ctaDescription}>
              Utilisez DiabeCare pour suivre votre glycémie et gérer votre diabète au quotidien.
            </Text>
            <Button
              title="Commencer le suivi"
              onPress={() => navigation.navigate('Glycémie', { screen: 'AddGlycemia' })}
              style={styles.ctaButton}
            />
          </View>
        </Card>

        {/* Emergency Info */}
        <Card style={styles.emergencyCard}>
          <View style={styles.emergencyContent}>
            <View style={styles.emergencyIcon}>
              <Ionicons name="warning" size={20} color="#ef4444" />
            </View>
            <View style={styles.emergencyText}>
              <Text style={styles.emergencyTitle}>Urgence médicale</Text>
              <Text style={styles.emergencyDescription}>
                En cas de symptômes graves (malaise, confusion, perte de conscience), 
                contactez immédiatement les services d'urgence.
              </Text>
            </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  mainContent: {
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#dbeafe',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  paragraph: {
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  typesList: {
    gap: 16,
  },
  typeItem: {
    borderLeftWidth: 4,
    paddingLeft: 16,
  },
  typeTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  typeDescription: {
    color: '#374151',
    fontSize: 14,
  },
  symptomsList: {
    gap: 12,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symptomIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  symptomText: {
    color: '#374151',
  },
  managementList: {
    gap: 12,
  },
  managementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    marginTop: 8,
    marginRight: 12,
  },
  managementText: {
    color: '#374151',
    flex: 1,
  },
  ctaCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#dbeafe',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ctaTitle: {
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  ctaDescription: {
    color: '#1e3a8a',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaButton: {
    width: '100%',
  },
  emergencyCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emergencyIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fee2e2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    fontWeight: '600',
    color: '#7f1d1d',
    marginBottom: 8,
  },
  emergencyDescription: {
    color: '#991b1b',
    fontSize: 14,
  },
});
