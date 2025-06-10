import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { GlycemiaUnit } from '../types';
import { getAvailableExportFormats, getStorageLocationOptions } from '../utils/exportUtils';
import { checkStoragePermissions } from '../utils/storageUtils';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  onExport: (options: {
    format: 'csv' | 'json';
    storageLocation: 'documents' | 'downloads' | 'diabecare' | 'choose';
    unit: GlycemiaUnit;
    includeNotes: boolean;
    includeStatus: boolean;
  }) => void;
  unit: GlycemiaUnit;
  readingsCount: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  onClose,
  onExport,
  unit,
  readingsCount,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json'>('csv');
  const [selectedLocation, setSelectedLocation] = useState<'documents' | 'downloads' | 'diabecare' | 'choose'>('diabecare');
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeStatus, setIncludeStatus] = useState(true);
  const [hasStoragePermission, setHasStoragePermission] = useState(false);

  const exportFormats = getAvailableExportFormats();
  const storageLocations = getStorageLocationOptions();

  useEffect(() => {
    const checkPermissions = async () => {
      const hasPermission = await checkStoragePermissions();
      setHasStoragePermission(hasPermission);
      
      // Si pas de permissions, utiliser les documents de l'app par défaut
      if (!hasPermission && selectedLocation !== 'documents' && selectedLocation !== 'choose') {
        setSelectedLocation('documents');
      }
    };

    if (visible) {
      checkPermissions();
    }
  }, [visible]);

  const handleExport = () => {
    onExport({
      format: selectedFormat,
      storageLocation: selectedLocation,
      unit,
      includeNotes,
      includeStatus,
    });
    onClose();
  };

  const getLocationDescription = (location: string) => {
    const locationOption = storageLocations.find(loc => loc.key === location);
    return locationOption?.description || '';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Exporter les données</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Info */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <Text style={styles.infoText}>
              {readingsCount} mesures seront exportées en unité {unit}
            </Text>
          </View>

          {/* Format Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Format d'export</Text>
            <View style={styles.optionsContainer}>
              {exportFormats.map((format) => (
                <TouchableOpacity
                  key={format.key}
                  style={[
                    styles.optionCard,
                    selectedFormat === format.key && styles.optionCardSelected
                  ]}
                  onPress={() => setSelectedFormat(format.key as 'csv' | 'json')}
                >
                  <View style={styles.optionHeader}>
                    <Ionicons 
                      name={format.icon as any} 
                      size={24} 
                      color={selectedFormat === format.key ? '#3b82f6' : '#6b7280'} 
                    />
                    <Text style={[
                      styles.optionTitle,
                      selectedFormat === format.key && styles.optionTitleSelected
                    ]}>
                      {format.label}
                    </Text>
                  </View>
                  <Text style={styles.optionDescription}>{format.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Storage Location Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emplacement de sauvegarde</Text>
            {!hasStoragePermission && (
              <View style={styles.warningCard}>
                <Ionicons name="warning" size={16} color="#f59e0b" />
                <Text style={styles.warningText}>
                  Permissions de stockage limitées. Certains emplacements peuvent ne pas être disponibles.
                </Text>
              </View>
            )}
            <View style={styles.optionsContainer}>
              {storageLocations.map((location) => {
                const isAvailable = hasStoragePermission || location.key === 'documents' || location.key === 'choose';
                return (
                  <TouchableOpacity
                    key={location.key}
                    style={[
                      styles.optionCard,
                      selectedLocation === location.key && styles.optionCardSelected,
                      !isAvailable && styles.optionCardDisabled
                    ]}
                    onPress={() => isAvailable && setSelectedLocation(location.key as any)}
                    disabled={!isAvailable}
                  >
                    <View style={styles.optionHeader}>
                      <Ionicons 
                        name={location.icon as any} 
                        size={24} 
                        color={
                          !isAvailable ? '#9ca3af' :
                          selectedLocation === location.key ? '#3b82f6' : '#6b7280'
                        } 
                      />
                      <Text style={[
                        styles.optionTitle,
                        selectedLocation === location.key && styles.optionTitleSelected,
                        !isAvailable && styles.optionTitleDisabled
                      ]}>
                        {location.label}
                        {location.recommended && (
                          <Text style={styles.recommendedBadge}> Recommandé</Text>
                        )}
                      </Text>
                    </View>
                    <Text style={[
                      styles.optionDescription,
                      !isAvailable && styles.optionDescriptionDisabled
                    ]}>
                      {location.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Content Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contenu à inclure</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={styles.toggleOption}
                onPress={() => setIncludeStatus(!includeStatus)}
              >
                <View style={styles.toggleLeft}>
                  <Ionicons name="analytics-outline" size={20} color="#6b7280" />
                  <Text style={styles.toggleLabel}>Statut glycémique</Text>
                </View>
                <View style={[styles.toggle, includeStatus && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, includeStatus && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleOption}
                onPress={() => setIncludeNotes(!includeNotes)}
              >
                <View style={styles.toggleLeft}>
                  <Ionicons name="document-text-outline" size={20} color="#6b7280" />
                  <Text style={styles.toggleLabel}>Notes personnelles</Text>
                </View>
                <View style={[styles.toggle, includeNotes && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, includeNotes && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Annuler"
            variant="outline"
            onPress={onClose}
            style={styles.cancelButton}
          />
          <Button
            title="Exporter"
            onPress={handleExport}
            style={styles.exportButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  optionCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#f9fafb',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  optionTitleSelected: {
    color: '#3b82f6',
  },
  optionTitleDisabled: {
    color: '#9ca3af',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 32,
  },
  optionDescriptionDisabled: {
    color: '#9ca3af',
  },
  recommendedBadge: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#92400e',
  },
  toggleContainer: {
    gap: 12,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#111827',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#3b82f6',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  exportButton: {
    flex: 1,
  },
});
