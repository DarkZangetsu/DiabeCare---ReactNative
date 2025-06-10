import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { InputDialog } from '../components/InputDialog';
import { GlycemiaChart } from '../components/GlycemiaChart';
import { useGlycemia } from '../hooks/useGlycemia';
import { getGlycemiaStatus } from '../utils/glycemiaUtils';
import { useToast } from '../contexts/ToastContext';
import { useDialog } from '../hooks/useDialog';

// Removed screenWidth as it's now handled in GlycemiaChart component

export const SimpleGlycemiaScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { readings, loading, getLatestReading, loadReadings, removeReading } = useGlycemia();
  const { showSuccess, showError, showInfo } = useToast();
  const { confirmDialog, inputDialog, confirmDelete } = useDialog();

  // Refresh data when screen comes into focus (but only once per focus)
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const refreshData = async () => {
        if (isActive) {
          await loadReadings();
        }
      };

      refreshData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const latestReading = getLatestReading();

  // Use the utility function for consistent status calculation

  const handleDeleteReading = (id: string, value: number) => {
    confirmDelete(
      `${value} mg/dL`,
      async () => {
        try {
          await removeReading(id);
          showSuccess('Mesure supprimée avec succès', {
            label: 'Annuler',
            onPress: () => {
              // Ici on pourrait implémenter un système d'undo
              showInfo('Fonction d\'annulation à venir');
            }
          });
        } catch (error) {
          showError('Impossible de supprimer la mesure');
        }
      }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Show empty state if no readings
  if (readings.length === 0) {
    return (
      <View style={styles.container}>
        <Header
          title="Carnet de glycémie"
          rightComponent={
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddGlycemia')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="add-circle" size={28} color="#3b82f6" />
            </TouchableOpacity>
          }
        />
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.content}>

          {/* Empty State */}
          <Card style={styles.emptyStateCard}>
            <View style={styles.emptyStateContent}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="analytics-outline" size={64} color="#9ca3af" />
              </View>
              <Text style={styles.emptyStateTitle}>Commencez votre suivi</Text>
              <Text style={styles.emptyStateDescription}>
                Ajoutez votre première mesure de glycémie pour commencer à suivre votre santé.
              </Text>
              <Button
                title="Ajouter ma première mesure"
                onPress={() => navigation.navigate('AddGlycemia')}
                style={styles.emptyStateButton}
              />
            </View>
          </Card>

          {/* Info Card */}
          <Card style={styles.infoCard}>
            <View style={styles.infoContent}>
              <View style={styles.infoIcon}>
                <Ionicons name="information-circle" size={24} color="#3b82f6" />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Pourquoi suivre sa glycémie ?</Text>
                <Text style={styles.infoDescription}>
                  Le suivi régulier de votre glycémie vous aide à mieux gérer votre diabète et à prendre des décisions éclairées sur votre santé.
                </Text>
              </View>
            </View>
          </Card>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Carnet de glycémie"
        rightComponent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddGlycemia')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="add-circle" size={28} color="#3b82f6" />
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>

        {/* Latest Reading Card */}
        {latestReading && (
          <Card style={styles.latestCard}>
            <View style={styles.latestReading}>
              <View>
                <Text style={styles.latestValue}>
                  {latestReading.value} mg/dL
                </Text>
                <Text style={styles.latestDate}>
                  {new Date(latestReading.date).toLocaleDateString('fr-FR')} à {latestReading.time}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getGlycemiaStatus(latestReading.value).bgColor }]}>
                <Text style={[styles.statusText, { color: getGlycemiaStatus(latestReading.value).color }]}>
                  {getGlycemiaStatus(latestReading.value).status}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Chart Card */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.chartTitle}>Évolution sur 7 jours</Text>
          <GlycemiaChart readings={readings} days={7} />
        </Card>

        {/* Quick Actions */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Ajouter glycémie"
              onPress={() => navigation.navigate('AddGlycemia')}
              style={styles.fullWidthButton}
            />
            <Button
              title="Voir l'historique"
              variant="outline"
              onPress={() => navigation.navigate('GlycemiaHistory')}
              style={[styles.fullWidthButton, styles.marginTop]}
            />
          </View>
        </Card>

        {/* Recent Readings */}
        {readings.length > 0 && (
          <Card style={styles.cardSpacing}>
            <Text style={styles.sectionTitle}>Mesures récentes</Text>
            <View style={styles.readingsList}>
              {readings.slice(0, 5).map((reading) => {
                const status = getGlycemiaStatus(reading.value);
                return (
                  <View key={reading.id} style={styles.readingItem}>
                    <View style={styles.readingInfo}>
                      <Text style={styles.readingValue}>{reading.value} mg/dL</Text>
                      <Text style={styles.readingDate}>
                        {new Date(reading.date).toLocaleDateString('fr-FR')} à {reading.time}
                      </Text>
                    </View>
                    <View style={styles.readingActions}>
                      <View style={[styles.statusBadgeSmall, { backgroundColor: status.bgColor }]}>
                        <Text style={[styles.statusTextSmall, { color: status.color }]}>
                          {status.status}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteReading(reading.id, reading.value)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        )}
        </View>
      </ScrollView>

      {/* Dialogs */}
      <ConfirmDialog
        visible={confirmDialog.visible}
        title={confirmDialog.config.title}
        message={confirmDialog.config.message}
        type={confirmDialog.config.type}
        confirmText={confirmDialog.config.confirmText}
        cancelText={confirmDialog.config.cancelText}
        icon={confirmDialog.config.icon}
        destructive={confirmDialog.config.destructive}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />

      <InputDialog
        visible={inputDialog.visible}
        title={inputDialog.config.title}
        message={inputDialog.config.message}
        placeholder={inputDialog.config.placeholder}
        defaultValue={inputDialog.config.defaultValue}
        inputType={inputDialog.config.inputType}
        maxLength={inputDialog.config.maxLength}
        confirmText={inputDialog.config.confirmText}
        cancelText={inputDialog.config.cancelText}
        icon={inputDialog.config.icon}
        validation={inputDialog.config.validation}
        onConfirm={inputDialog.onConfirm}
        onCancel={inputDialog.onCancel}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    color: '#6b7280',
  },
  addButton: {
    padding: 4,
  },
  latestCard: {
    marginBottom: 20,
  },
  latestReading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  latestValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  latestDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  fullWidthButton: {
    width: '100%',
  },
  marginTop: {
    marginTop: 12,
  },
  readingsList: {
    gap: 12,
  },
  readingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  readingInfo: {
    flex: 1,
  },
  readingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readingValue: {
    fontWeight: '600',
    color: '#111827',
  },
  readingDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusTextSmall: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
  },
  emptyStateCard: {
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateContent: {
    alignItems: 'center',
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 32,
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#1e3a8a',
    lineHeight: 20,
  },
});
