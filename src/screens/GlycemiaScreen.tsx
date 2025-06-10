import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useGlycemia } from '../hooks/useGlycemia';

const screenWidth = Dimensions.get('window').width;

export const GlycemiaScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { readings, loading, getLastSevenDays, getAverageGlycemia, getLatestReading } = useGlycemia();

  const lastSevenDays = getLastSevenDays();
  const averageGlycemia = getAverageGlycemia();
  const latestReading = getLatestReading();

  // Prepare chart data
  const chartData = {
    labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
    datasets: [
      {
        data: lastSevenDays.length > 0 
          ? lastSevenDays.slice(-7).map(reading => reading.value)
          : [120, 110, 150, 135, 140, 125, 130], // Sample data
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3b82f6',
    },
  };

  const getGlycemiaStatus = (value: number) => {
    if (value < 70) return { status: 'Hypoglycémie', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (value <= 140) return { status: 'Normal', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (value <= 200) return { status: 'Élevé', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { status: 'Très élevé', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600">Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 space-y-4">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Carnet de glycémie</Text>
          <TouchableOpacity 
            className="p-2"
            onPress={() => navigation.navigate('AddGlycemia')}
          >
            <Ionicons name="add-circle" size={32} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Latest Reading Card */}
        {latestReading && (
          <Card className="mb-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-semibold text-gray-900">
                  {latestReading.value} mg/dL
                </Text>
                <Text className="text-sm text-gray-600">
                  {new Date(latestReading.date).toLocaleDateString('fr-FR')} à {latestReading.time}
                </Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${getGlycemiaStatus(latestReading.value).bgColor}`}>
                <Text className={`text-sm font-medium ${getGlycemiaStatus(latestReading.value).color}`}>
                  {getGlycemiaStatus(latestReading.value).status}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Chart Card */}
        <Card>
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-2">7 jours</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
          
          {/* Stats */}
          <View className="flex-row justify-between pt-4 border-t border-gray-100">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary-600">{averageGlycemia}</Text>
              <Text className="text-sm text-gray-600">Moyenne</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">{readings.length}</Text>
              <Text className="text-sm text-gray-600">Mesures</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</Text>
          <View className="space-y-3">
            <Button
              title="Ajouter glycémie"
              onPress={() => navigation.navigate('AddGlycemia')}
              className="w-full"
            />
            <Button
              title="Voir l'historique"
              variant="outline"
              onPress={() => {/* Navigate to history */}}
              className="w-full"
            />
          </View>
        </Card>

        {/* Recent Readings */}
        {readings.length > 0 && (
          <Card>
            <Text className="text-lg font-semibold text-gray-900 mb-4">Mesures récentes</Text>
            <View className="space-y-3">
              {readings.slice(0, 5).map((reading) => {
                const status = getGlycemiaStatus(reading.value);
                return (
                  <View key={reading.id} className="flex-row justify-between items-center py-2">
                    <View>
                      <Text className="font-semibold text-gray-900">{reading.value} mg/dL</Text>
                      <Text className="text-sm text-gray-600">
                        {new Date(reading.date).toLocaleDateString('fr-FR')} à {reading.time}
                      </Text>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${status.bgColor}`}>
                      <Text className={`text-xs font-medium ${status.color}`}>
                        {status.status}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};
