import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Advice } from '../types';

export const AdviceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 space-y-4">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-900">Conseils</Text>

        {/* Featured Article */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('DiabetesInfo')}
          activeOpacity={0.7}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0">
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-white font-bold text-lg mb-2">
                  Qu'est-ce que le diabète ?
                </Text>
                <Text className="text-blue-100 text-sm mb-3">
                  Le diabète est une maladie chronique caractérisée par un niveau élevé de glucose (sucre) dans le sang. Cela est souvent dû à un manque d'insuline ou à une mauvaise utilisation de celle-ci par l'organisme.
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-blue-200 text-sm mr-4">5 min de lecture</Text>
                  <View className="bg-blue-400 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-medium">En savoir plus</Text>
                  </View>
                </View>
              </View>
              <View className="ml-4">
                <View className="w-16 h-16 bg-blue-400 rounded-full items-center justify-center">
                  <Ionicons name="information-circle" size={32} color="white" />
                </View>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Categories */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Catégories</Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { category: 'nutrition', label: 'Nutrition', icon: 'restaurant', color: '#f59e0b' },
              { category: 'exercise', label: 'Exercice', icon: 'fitness', color: '#22c55e' },
              { category: 'medication', label: 'Médicaments', icon: 'medical', color: '#ef4444' },
              { category: 'general', label: 'Général', icon: 'information-circle', color: '#3b82f6' },
            ].map((item) => (
              <TouchableOpacity
                key={item.category}
                className="flex-1 min-w-[45%] bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                activeOpacity={0.7}
              >
                <View className="items-center">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text className="font-medium text-gray-900 text-center">{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Articles List */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Articles recommandés</Text>
          <View className="space-y-3">
            {adviceData.map((advice) => (
              <TouchableOpacity
                key={advice.id}
                onPress={() => navigation.navigate('AdviceDetail', { advice })}
                activeOpacity={0.7}
              >
                <Card>
                  <View className="flex-row items-start">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: `${getCategoryColor(advice.category)}20` }}
                    >
                      <Ionicons 
                        name={getCategoryIcon(advice.category) as any} 
                        size={20} 
                        color={getCategoryColor(advice.category)} 
                      />
                    </View>
                    
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900 mb-1">
                        {advice.title}
                      </Text>
                      <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                        {advice.content}
                      </Text>
                      <View className="flex-row items-center">
                        <View 
                          className="px-2 py-1 rounded-full mr-3"
                          style={{ backgroundColor: `${getCategoryColor(advice.category)}20` }}
                        >
                          <Text 
                            className="text-xs font-medium"
                            style={{ color: getCategoryColor(advice.category) }}
                          >
                            {getCategoryLabel(advice.category)}
                          </Text>
                        </View>
                        <Text className="text-gray-500 text-xs">
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
        <Card className="bg-green-50 border-green-200">
          <View className="flex-row items-start">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="bulb" size={20} color="#22c55e" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-green-900 mb-2">Conseil du jour</Text>
              <Text className="text-green-800 text-sm">
                Buvez beaucoup d'eau tout au long de la journée. L'hydratation aide à maintenir une glycémie stable.
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};
