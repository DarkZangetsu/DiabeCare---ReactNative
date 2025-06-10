import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useGlycemia } from '../hooks/useGlycemia';

export const AddGlycemiaScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { addReading } = useGlycemia();
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );

  const handleSave = async () => {
    if (!value || isNaN(Number(value))) {
      Alert.alert('Erreur', 'Veuillez entrer une valeur valide');
      return;
    }

    const numericValue = Number(value);
    if (numericValue < 20 || numericValue > 600) {
      Alert.alert('Erreur', 'La valeur doit être entre 20 et 600 mg/dL');
      return;
    }

    try {
      setLoading(true);
      await addReading({
        value: numericValue,
        date: selectedDate,
        time: selectedTime,
        notes: notes.trim() || undefined,
      });
      
      Alert.alert(
        'Succès',
        'Votre mesure de glycémie a été enregistrée',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer la mesure');
    } finally {
      setLoading(false);
    }
  };

  const getGlycemiaStatus = (val: number) => {
    if (val < 70) return { status: 'Hypoglycémie', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (val <= 140) return { status: 'Normal', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (val <= 200) return { status: 'Élevé', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { status: 'Très élevé', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const currentValue = Number(value);
  const status = !isNaN(currentValue) && currentValue > 0 ? getGlycemiaStatus(currentValue) : null;

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
          <Text className="text-2xl font-bold text-gray-900">Ajouter glycémie</Text>
        </View>

        {/* Glycemia Value Input */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Glycémie</Text>
          
          <View className="mb-4">
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 text-4xl font-bold text-center text-gray-900 py-4"
                placeholder="150"
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text className="text-xl text-gray-600 ml-2">mg/dL</Text>
            </View>
            
            {status && (
              <View className={`mt-4 p-3 rounded-lg ${status.bgColor}`}>
                <Text className={`text-center font-medium ${status.color}`}>
                  {status.status}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Date and Time */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Date</Text>
          
          <View className="space-y-3">
            <TouchableOpacity className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                <Text className="ml-3 text-gray-900">
                  {selectedDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
              <Text className="text-primary-600 font-medium">Aujourd'hui</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={20} color="#6b7280" />
                <Text className="ml-3 text-gray-900">{selectedTime}</Text>
              </View>
              <Text className="text-primary-600 font-medium">Maintenant</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Notes */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Notes (optionnel)</Text>
          <TextInput
            className="border border-gray-200 rounded-lg p-3 text-gray-900 min-h-[100px]"
            placeholder="Ajoutez des notes sur votre mesure..."
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </Card>

        {/* Quick Notes */}
        <Card>
          <Text className="text-lg font-semibold text-gray-900 mb-4">Notes rapides</Text>
          <View className="flex-row flex-wrap gap-2">
            {[
              'Avant repas',
              'Après repas',
              'Au réveil',
              'Avant coucher',
              'Exercice',
              'Stress',
            ].map((note) => (
              <TouchableOpacity
                key={note}
                onPress={() => setNotes(prev => prev ? `${prev}, ${note}` : note)}
                className="bg-gray-100 px-3 py-2 rounded-full"
              >
                <Text className="text-gray-700 text-sm">{note}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Save Button */}
        <Button
          title="Enregistrer"
          onPress={handleSave}
          loading={loading}
          disabled={!value || isNaN(Number(value))}
          className="w-full mt-6"
        />
      </View>
    </ScrollView>
  );
};
