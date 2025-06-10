import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useGlycemia } from '../hooks/useGlycemia';
import { GlycemiaUnit } from '../types';
import { useToast } from '../contexts/ToastContext';
import {
  convertToMg,
  convertFromMg,
  getGlycemiaStatus,
  validateGlycemiaValue,
  formatGlycemiaValue,
  getGlycemiaWarning
} from '../utils/glycemiaUtils';

export const SimpleAddGlycemiaScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { addReading } = useGlycemia();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<GlycemiaUnit>('mg/dL');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickNote = (quickNote: string) => {
    const currentNotes = notes.trim();
    const newNotes = currentNotes
      ? `${currentNotes}, ${quickNote}`
      : quickNote;

    setNotes(newNotes);
    showInfo(`Note ajoutée: ${quickNote}`);
  };
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );

  const handleSave = async () => {
    const numericValue = Number(value);
    const validation = validateGlycemiaValue(numericValue, unit);

    if (!validation.isValid) {
      showError(validation.message);
      return;
    }

    // Vérification des valeurs extrêmes avec avertissement
    const warningMessage = getGlycemiaWarning(numericValue, unit);
    if (warningMessage) {
      showWarning(warningMessage);
    }

    try {
      setLoading(true);
      showInfo('Enregistrement en cours...');

      // Convert to mg/dL for storage
      const valueInMg = convertToMg(Number(value), unit);

      await addReading({
        value: valueInMg,
        unit: unit,
        date: selectedDate,
        time: selectedTime,
        notes: notes.trim() || undefined,
      });

      showSuccess('Mesure de glycémie enregistrée avec succès !', {
        label: 'Voir l\'historique',
        onPress: () => {
          navigation.navigate('GlycemiaHistory');
        }
      });

      // Retour automatique après un délai
      setTimeout(() => {
        navigation.goBack();
      }, 2000);

    } catch (error) {
      showError('Impossible d\'enregistrer la mesure. Veuillez réessayer.');
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
            maxLength={200}
          />
        </Card>

        {/* Quick Notes */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Notes rapides</Text>
          <View style={styles.quickNotesContainer}>
            {[
              { label: 'Avant repas', icon: 'restaurant-outline' },
              { label: 'Après repas', icon: 'checkmark-circle-outline' },
              { label: 'Au réveil', icon: 'sunny-outline' },
              { label: 'Avant coucher', icon: 'moon-outline' },
              { label: 'Après sport', icon: 'fitness-outline' },
              { label: 'Stress', icon: 'alert-circle-outline' },
            ].map((note) => (
              <TouchableOpacity
                key={note.label}
                onPress={() => handleQuickNote(note.label)}
                style={[
                  styles.quickNoteButton,
                  notes.includes(note.label) && styles.quickNoteButtonActive
                ]}
              >
                <Ionicons
                  name={note.icon as any}
                  size={16}
                  color={notes.includes(note.label) ? '#ffffff' : '#6b7280'}
                />
                <Text style={[
                  styles.quickNoteText,
                  notes.includes(note.label) && styles.quickNoteTextActive
                ]}>
                  {note.label}
                </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  quickNoteButtonActive: {
    backgroundColor: '#3b82f6',
  },
  quickNoteText: {
    color: '#374151',
    fontSize: 14,
  },
  quickNoteTextActive: {
    color: '#ffffff',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addNoteText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  notesDisplay: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  notesText: {
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  editNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
  },
  editNoteText: {
    color: '#6b7280',
    fontSize: 12,
  },
  emptyNotesContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  emptyNotesText: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
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
