import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useGlycemia } from '../hooks/useGlycemia';
import { GlycemiaUnit } from '../types';
import {
  convertToMg,
  convertFromMg,
  getGlycemiaStatus,
  validateGlycemiaValue,
  formatGlycemiaValue
} from '../utils/glycemiaUtils';

export const SimpleAddGlycemiaScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { addReading } = useGlycemia();
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<GlycemiaUnit>('mg/dL');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );

  const handleSave = async () => {
    const numericValue = Number(value);
    const validation = validateGlycemiaValue(numericValue, unit);

    if (!validation.isValid) {
      Alert.alert('Erreur', validation.message);
      return;
    }

    try {
      setLoading(true);

      // Convert to mg/dL for storage
      const valueInMg = convertToMg(numericValue, unit);

      await addReading({
        value: valueInMg,
        unit: unit,
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

  const currentValue = Number(value);
  const currentValueInMg = !isNaN(currentValue) && currentValue > 0 ? convertToMg(currentValue, unit) : 0;
  const status = currentValueInMg > 0 ? getGlycemiaStatus(currentValueInMg) : null;

  const toggleUnit = () => {
    if (!value || isNaN(Number(value))) {
      setUnit(unit === 'mg/dL' ? 'mmol/L' : 'mg/dL');
      return;
    }

    const numericValue = Number(value);
    const newUnit = unit === 'mg/dL' ? 'mmol/L' : 'mg/dL';

    // Convert the current value to the new unit
    const convertedValue = unit === 'mg/dL'
      ? convertFromMg(numericValue, 'mmol/L')
      : convertFromMg(convertToMg(numericValue, 'mmol/L'), 'mg/dL');

    setValue(newUnit === 'mmol/L' ? convertedValue.toFixed(1) : Math.round(convertedValue).toString());
    setUnit(newUnit);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Ajouter glycémie"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>

        {/* Glycemia Value Input */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Glycémie</Text>

          {/* Unit Selection */}
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'mg/dL' && styles.unitButtonActive]}
              onPress={() => unit !== 'mg/dL' && toggleUnit()}
            >
              <Text style={[styles.unitButtonText, unit === 'mg/dL' && styles.unitButtonTextActive]}>
                mg/dL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'mmol/L' && styles.unitButtonActive]}
              onPress={() => unit !== 'mmol/L' && toggleUnit()}
            >
              <Text style={[styles.unitButtonText, unit === 'mmol/L' && styles.unitButtonTextActive]}>
                mmol/L
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.valueInputRow}>
              <TextInput
                style={styles.valueInput}
                placeholder={unit === 'mg/dL' ? '150' : '8.3'}
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
                maxLength={unit === 'mg/dL' ? 3 : 4}
              />
              <TouchableOpacity onPress={toggleUnit} style={styles.unitTouchable}>
                <Text style={styles.unit}>{unit}</Text>
                <Ionicons name="swap-horizontal" size={16} color="#6b7280" style={styles.swapIcon} />
              </TouchableOpacity>
            </View>

            {status && (
              <View style={[styles.statusContainer, { backgroundColor: status.bgColor }]}>
                <Text style={[styles.statusText, { color: status.color }]}>
                  {status.status}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Date and Time */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Date</Text>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity style={styles.dateTimeItem}>
              <View style={styles.dateTimeRow}>
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                <Text style={styles.dateTimeText}>
                  {selectedDate.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
              <Text style={styles.dateTimeLabel}>Aujourd'hui</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dateTimeItem}>
              <View style={styles.dateTimeRow}>
                <Ionicons name="time-outline" size={20} color="#6b7280" />
                <Text style={styles.dateTimeText}>{selectedTime}</Text>
              </View>
              <Text style={styles.dateTimeLabel}>Maintenant</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Notes */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Notes (optionnel)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Ajoutez des notes sur votre mesure..."
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </Card>

        {/* Quick Notes */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Notes rapides</Text>
          <View style={styles.quickNotesContainer}>
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
                style={styles.quickNoteButton}
              >
                <Text style={styles.quickNoteText}>{note}</Text>
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
          style={styles.saveButton}
        />
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
  cardSpacing: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  valueInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
    paddingVertical: 16,
  },
  unit: {
    fontSize: 20,
    color: '#6b7280',
    marginLeft: 8,
  },
  statusContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  statusText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  dateTimeContainer: {
    gap: 12,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    marginLeft: 12,
    color: '#111827',
  },
  dateTimeLabel: {
    color: '#2563eb',
    fontWeight: '500',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    color: '#111827',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  quickNotesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickNoteButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickNoteText: {
    color: '#374151',
    fontSize: 14,
  },
  saveButton: {
    width: '100%',
    marginTop: 24,
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#3b82f6',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  unitButtonTextActive: {
    color: 'white',
  },
  unitTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  swapIcon: {
    marginLeft: 4,
  },
});
