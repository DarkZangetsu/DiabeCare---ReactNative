import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useReminders } from '../hooks/useReminders';
import { Reminder } from '../types';

export const AddReminderScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { addReminder } = useReminders();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('08:00');
  const [type, setType] = useState<Reminder['type']>('measurement');
  const [loading, setLoading] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState('');

  const reminderTypes = [
    { key: 'measurement', label: 'Mesure glycémie', icon: 'analytics', color: '#3b82f6' },
    { key: 'medication', label: 'Médicament', icon: 'medical', color: '#ef4444' },
    { key: 'meal', label: 'Repas', icon: 'restaurant', color: '#f59e0b' },
    { key: 'exercise', label: 'Exercice', icon: 'fitness', color: '#22c55e' },
  ];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  // Fonction pour valider le format d'heure (HH:MM)
  const validateTimeFormat = (timeStr: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeStr);
  };

  // Fonction pour formater l'heure (ajouter le 0 si nécessaire)
  const formatTime = (timeStr: string): string => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length !== 2) return timeStr;

    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Fonction pour gérer la saisie d'heure personnalisée
  const handleCustomTimeChange = (text: string) => {
    // Permettre seulement les chiffres et ":"
    const cleanText = text.replace(/[^0-9:]/g, '');

    // Auto-formater pendant la saisie
    let formattedText = cleanText;
    if (cleanText.length === 2 && !cleanText.includes(':')) {
      formattedText = cleanText + ':';
    }

    // Limiter à 5 caractères (HH:MM)
    if (formattedText.length <= 5) {
      setCustomTime(formattedText);
    }
  };

  // Fonction pour appliquer l'heure personnalisée
  const applyCustomTime = () => {
    if (validateTimeFormat(customTime)) {
      const formattedTime = formatTime(customTime);
      setTime(formattedTime);
      setShowCustomTime(false);
      setCustomTime('');
    } else {
      Alert.alert('Format invalide', 'Veuillez entrer une heure au format HH:MM (ex: 08:25)');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour le rappel');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une description');
      return;
    }

    try {
      setLoading(true);
      await addReminder({
        title: title.trim(),
        description: description.trim(),
        time,
        type,
        isActive: true,
      });
      
      Alert.alert(
        'Succès',
        'Votre rappel a été créé',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le rappel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Nouveau rappel"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>

        {/* Type Selection */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Type de rappel</Text>
          <View style={styles.typeGrid}>
            {reminderTypes.map((reminderType) => (
              <TouchableOpacity
                key={reminderType.key}
                style={[
                  styles.typeCard,
                  type === reminderType.key && styles.typeCardActive
                ]}
                onPress={() => setType(reminderType.key as Reminder['type'])}
              >
                <View style={[styles.typeIcon, { backgroundColor: `${reminderType.color}20` }]}>
                  <Ionicons
                    name={reminderType.icon as any}
                    size={24}
                    color={reminderType.color}
                  />
                </View>
                <Text style={[
                  styles.typeLabel,
                  type === reminderType.key && styles.typeLabelActive
                ]}>
                  {reminderType.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Title */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Titre</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Mesure de glycémie"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </Card>

        {/* Description */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Ex: Mesurer votre glycémie avant le petit-déjeuner"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={200}
          />
        </Card>

        {/* Time Selection */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Heure</Text>

          {/* Current selected time display */}
          <View style={styles.selectedTimeContainer}>
            <Text style={styles.selectedTimeLabel}>Heure sélectionnée :</Text>
            <Text style={styles.selectedTimeValue}>{time}</Text>
          </View>

          {/* Suggested time slots */}
          <Text style={styles.subSectionTitle}>Heures suggérées</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
            <View style={styles.timeContainer}>
              {timeSlots.map((timeSlot) => (
                <TouchableOpacity
                  key={timeSlot}
                  style={[
                    styles.timeSlot,
                    time === timeSlot && styles.timeSlotActive
                  ]}
                  onPress={() => {
                    setTime(timeSlot);
                    setShowCustomTime(false);
                  }}
                >
                  <Text style={[
                    styles.timeText,
                    time === timeSlot && styles.timeTextActive
                  ]}>
                    {timeSlot}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Custom time button */}
              <TouchableOpacity
                style={[
                  styles.timeSlot,
                  styles.customTimeSlot,
                  showCustomTime && styles.timeSlotActive
                ]}
                onPress={() => setShowCustomTime(!showCustomTime)}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={showCustomTime ? 'white' : '#6b7280'}
                />
                <Text style={[
                  styles.timeText,
                  styles.customTimeText,
                  showCustomTime && styles.timeTextActive
                ]}>
                  Autre
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Custom time input */}
          {showCustomTime && (
            <View style={styles.customTimeInputContainer}>
              <Text style={styles.subSectionTitle}>Heure personnalisée</Text>
              <View style={styles.customTimeRow}>
                <TextInput
                  style={styles.customTimeInput}
                  placeholder="08:25"
                  value={customTime}
                  onChangeText={handleCustomTimeChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
                <TouchableOpacity
                  style={styles.applyTimeButton}
                  onPress={applyCustomTime}
                  disabled={!customTime.trim()}
                >
                  <Text style={[
                    styles.applyTimeText,
                    !customTime.trim() && styles.applyTimeTextDisabled
                  ]}>
                    Appliquer
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.timeFormatHint}>Format : HH:MM (ex: 08:25, 14:30)</Text>
            </View>
          )}
        </Card>

        {/* Quick Templates */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Modèles rapides</Text>
          <View style={styles.templatesContainer}>
            {[
              { title: 'Glycémie matin', desc: 'Mesurer votre glycémie avant le petit-déjeuner', type: 'measurement', time: '07:30' },
              { title: 'Médicament matin', desc: 'Prendre votre traitement du matin', type: 'medication', time: '08:00' },
              { title: 'Glycémie midi', desc: 'Mesurer votre glycémie avant le déjeuner', type: 'measurement', time: '11:45' },
              { title: 'Glycémie soir', desc: 'Mesurer votre glycémie avant le dîner', type: 'measurement', time: '18:30' },
              { title: 'Exercice', desc: 'Marche de 30 minutes', type: 'exercise', time: '17:15' },
              { title: 'Médicament soir', desc: 'Prendre votre traitement du soir', type: 'medication', time: '20:30' },
            ].map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.templateButton}
                onPress={() => {
                  setTitle(template.title);
                  setDescription(template.desc);
                  setType(template.type as Reminder['type']);
                  setTime(template.time);
                  setShowCustomTime(false); // Fermer la saisie personnalisée
                }}
              >
                <Text style={styles.templateText}>{template.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Save Button */}
        <Button
          title="Créer le rappel"
          onPress={handleSave}
          loading={loading}
          disabled={!title.trim() || !description.trim()}
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
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 12,
    marginTop: 8,
  },
  selectedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedTimeLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  selectedTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  typeCardActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  typeLabelActive: {
    color: '#3b82f6',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  timeScroll: {
    marginHorizontal: -16,
  },
  timeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  timeSlotActive: {
    backgroundColor: '#3b82f6',
  },
  customTimeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  timeTextActive: {
    color: 'white',
  },
  customTimeText: {
    fontSize: 12,
  },
  customTimeInputContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  customTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  customTimeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
    textAlign: 'center',
  },
  applyTimeButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyTimeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  applyTimeTextDisabled: {
    color: '#9ca3af',
  },
  timeFormatHint: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  templatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  templateText: {
    fontSize: 14,
    color: '#374151',
  },
  saveButton: {
    width: '100%',
    marginTop: 24,
  },
});
