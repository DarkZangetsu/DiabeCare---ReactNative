import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const DiabetesInfoScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 space-y-4">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4 p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Qu'est-ce que le diabète ?</Text>
        </View>

        {/* Main Content */}
        <Card>
          <View className="mb-6">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="information-circle" size={32} color="#3b82f6" />
            </View>
            
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Comprendre le diabète
            </Text>
            
            <Text className="text-gray-700 leading-6 mb-4">
              Le diabète est une maladie chronique caractérisée par un niveau élevé de glucose (sucre) dans le sang. 
              Cela est souvent dû à un manque d'insuline ou à une mauvaise utilisation de celle-ci par l'organisme.
            </Text>
            
            <Text className="text-gray-700 leading-6 mb-4">
              L'insuline est une hormone produite par le pancréas qui permet aux cellules d'utiliser le glucose 
              comme source d'énergie. Quand ce processus ne fonctionne pas correctement, le glucose s'accumule 
              dans le sang.
            </Text>
          </View>
        </Card>

        {/* Types of Diabetes */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Types de diabète</Text>
          
          <View className="space-y-4">
            <View className="border-l-4 border-blue-500 pl-4">
              <Text className="font-semibold text-gray-900 mb-1">Diabète de type 1</Text>
              <Text className="text-gray-700 text-sm">
                Le pancréas ne produit pas ou très peu d'insuline. Généralement diagnostiqué chez les enfants et jeunes adultes.
              </Text>
            </View>
            
            <View className="border-l-4 border-orange-500 pl-4">
              <Text className="font-semibold text-gray-900 mb-1">Diabète de type 2</Text>
              <Text className="text-gray-700 text-sm">
                Le corps ne produit pas assez d'insuline ou n'utilise pas efficacement l'insuline produite. 
                Le plus fréquent (90% des cas).
              </Text>
            </View>
            
            <View className="border-l-4 border-pink-500 pl-4">
              <Text className="font-semibold text-gray-900 mb-1">Diabète gestationnel</Text>
              <Text className="text-gray-700 text-sm">
                Développé pendant la grossesse, disparaît généralement après l'accouchement.
              </Text>
            </View>
          </View>
        </Card>

        {/* Symptoms */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Symptômes principaux</Text>
          
          <View className="space-y-3">
            {[
              { icon: 'water', text: 'Soif excessive', color: '#3b82f6' },
              { icon: 'restaurant', text: 'Faim constante', color: '#f59e0b' },
              { icon: 'body', text: 'Perte de poids inexpliquée', color: '#ef4444' },
              { icon: 'eye', text: 'Vision floue', color: '#8b5cf6' },
              { icon: 'battery-dead', text: 'Fatigue persistante', color: '#6b7280' },
              { icon: 'medical', text: 'Cicatrisation lente', color: '#22c55e' },
            ].map((symptom, index) => (
              <View key={index} className="flex-row items-center">
                <View 
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${symptom.color}20` }}
                >
                  <Ionicons name={symptom.icon as any} size={16} color={symptom.color} />
                </View>
                <Text className="text-gray-700">{symptom.text}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Management */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Gestion du diabète</Text>
          
          <Text className="text-gray-700 leading-6 mb-4">
            Bien que le diabète soit une maladie chronique, il peut être géré efficacement avec :
          </Text>
          
          <View className="space-y-3">
            {[
              'Surveillance régulière de la glycémie',
              'Alimentation équilibrée et contrôlée',
              'Activité physique régulière',
              'Prise de médicaments selon prescription',
              'Suivi médical régulier',
              'Gestion du stress',
            ].map((item, index) => (
              <View key={index} className="flex-row items-start">
                <View className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
                <Text className="text-gray-700 flex-1">{item}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Call to Action */}
        <Card className="bg-blue-50 border-blue-200">
          <View className="items-center text-center">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="heart" size={24} color="#3b82f6" />
            </View>
            <Text className="font-semibold text-blue-900 mb-2">
              Prenez soin de votre santé
            </Text>
            <Text className="text-blue-800 text-sm text-center mb-4">
              Utilisez DiabeCare pour suivre votre glycémie et gérer votre diabète au quotidien.
            </Text>
            <Button
              title="Commencer le suivi"
              onPress={() => navigation.navigate('Glycémie')}
              className="w-full"
            />
          </View>
        </Card>

        {/* Emergency Info */}
        <Card className="bg-red-50 border-red-200">
          <View className="flex-row items-start">
            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="warning" size={20} color="#ef4444" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-red-900 mb-2">Urgence médicale</Text>
              <Text className="text-red-800 text-sm">
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
