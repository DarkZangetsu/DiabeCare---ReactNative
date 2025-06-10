import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ExportModal } from '../components/ExportModal';
import { ExportSuccessModal } from '../components/ExportSuccessModal';
import { useGlycemia } from '../hooks/useGlycemia';
import { GlycemiaReading, GlycemiaUnit } from '../types';
import { convertGlycemia, getGlycemiaStatus } from '../utils/glycemiaUtils';
import { exportGlycemiaData, ExportOptions } from '../utils/exportUtils';

type FilterPeriod = 'day' | 'week' | 'month' | 'year' | 'all';
type DateRange = {
  start: Date;
  end: Date;
};

export const GlycemiaHistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { readings, loading } = useGlycemia();
  const [unit, setUnit] = useState<GlycemiaUnit>('mg/dL');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [filteredReadings, setFilteredReadings] = useState<GlycemiaReading[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [exportResult, setExportResult] = useState<{
    path: string;
    fileName: string;
    format: string;
    location: string;
  } | null>(null);

  // Filtrer les lectures selon la période sélectionnée
  useEffect(() => {
    let filtered = [...readings];
    const now = new Date();
    
    switch (filterPeriod) {
      case 'day':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filtered = readings.filter(reading => {
          const readingDate = new Date(reading.date);
          return readingDate >= today;
        });
        break;
        
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = readings.filter(reading => {
          const readingDate = new Date(reading.date);
          return readingDate >= weekAgo;
        });
        break;
        
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filtered = readings.filter(reading => {
          const readingDate = new Date(reading.date);
          return readingDate >= monthAgo;
        });
        break;
        
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        filtered = readings.filter(reading => {
          const readingDate = new Date(reading.date);
          return readingDate >= yearAgo;
        });
        break;
        
      case 'all':
      default:
        filtered = readings;
        break;
    }
    
    // Trier par date décroissante (plus récent en premier)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredReadings(filtered);
  }, [readings, filterPeriod]);

  // Basculer entre les unités
  const toggleUnit = () => {
    setUnit(unit === 'mg/dL' ? 'mmol/L' : 'mg/dL');
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Formater l'heure pour l'affichage
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Ouvrir le modal d'export
  const openExportModal = () => {
    if (filteredReadings.length === 0) {
      Alert.alert('Aucune donnée', 'Il n\'y a aucune mesure à exporter pour cette période.');
      return;
    }
    setShowExportModal(true);
  };

  // Exporter les données avec les options choisies
  const handleExport = async (options: {
    format: 'csv' | 'json';
    storageLocation: 'documents' | 'downloads' | 'diabecare' | 'choose';
    unit: GlycemiaUnit;
    includeNotes: boolean;
    includeStatus: boolean;
  }) => {
    try {
      const exportOptions: ExportOptions = {
        format: options.format,
        unit: options.unit,
        includeNotes: options.includeNotes,
        includeStatus: options.includeStatus,
        storageLocation: options.storageLocation,
      };

      const result = await exportGlycemiaData(filteredReadings, exportOptions);

      if (result.success && result.path) {
        // Extraire le nom du fichier du chemin
        const fileName = result.path.split('/').pop() || 'fichier_export';

        setExportResult({
          path: result.path,
          fileName,
          format: options.format,
          location: options.storageLocation,
        });
        setShowSuccessModal(true);
      } else {
        Alert.alert('Erreur d\'export', result.error || 'Impossible d\'exporter les données');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les données');
    }
  };

  // Calculer les statistiques
  const getStatistics = () => {
    if (filteredReadings.length === 0) return null;
    
    const values = filteredReadings.map(r => r.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    return {
      count: filteredReadings.length,
      min: unit === 'mg/dL' ? min : convertGlycemia(min, 'mg/dL', 'mmol/L'),
      max: unit === 'mg/dL' ? max : convertGlycemia(max, 'mg/dL', 'mmol/L'),
      avg: unit === 'mg/dL' ? avg : convertGlycemia(avg, 'mg/dL', 'mmol/L'),
    };
  };

  const statistics = getStatistics();

  const renderReading = ({ item }: { item: GlycemiaReading }) => {
    const displayValue = unit === 'mg/dL' ? item.value : convertGlycemia(item.value, 'mg/dL', 'mmol/L');
    const status = getGlycemiaStatus(item.value, 'mg/dL');
    
    return (
      <Card style={styles.readingCard}>
        <View style={styles.readingHeader}>
          <View style={styles.readingDate}>
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            <Text style={styles.timeText}>{formatTime(item.date)}</Text>
          </View>
          <View style={[styles.valueContainer, { backgroundColor: status.bgColor }]}>
            <Text style={[styles.valueText, { color: status.color }]}>
              {displayValue.toFixed(unit === 'mg/dL' ? 0 : 1)} {unit}
            </Text>
          </View>
        </View>
        
        <View style={styles.readingDetails}>
          <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.status}
            </Text>
          </View>
          
          {item.notes && (
            <View style={styles.notesContainer}>
              <Ionicons name="document-text-outline" size={14} color="#6b7280" />
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Historique glycémie"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={openExportModal} style={styles.exportButton}>
            <Ionicons name="download-outline" size={24} color="#3b82f6" />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.content}>
        {/* Unit Toggle */}
        <Card style={styles.cardSpacing}>
          <View style={styles.unitToggleContainer}>
            <Text style={styles.sectionTitle}>Unité d'affichage</Text>
            <TouchableOpacity onPress={toggleUnit} style={styles.unitToggle}>
              <Text style={styles.unitText}>{unit}</Text>
              <Ionicons name="swap-horizontal" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Filter Buttons */}
        <Card style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Période</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <View style={styles.filterContainer}>
              {[
                { key: 'day', label: 'Aujourd\'hui' },
                { key: 'week', label: '7 jours' },
                { key: 'month', label: '1 mois' },
                { key: 'year', label: '1 an' },
                { key: 'all', label: 'Tout' },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterButton,
                    filterPeriod === filter.key && styles.filterButtonActive
                  ]}
                  onPress={() => setFilterPeriod(filter.key as FilterPeriod)}
                >
                  <Text style={[
                    styles.filterText,
                    filterPeriod === filter.key && styles.filterTextActive
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Card>

        {/* Statistics */}
        {statistics && (
          <Card style={styles.cardSpacing}>
            <Text style={styles.sectionTitle}>Statistiques</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{statistics.count}</Text>
                <Text style={styles.statLabel}>Mesures</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValueMin}>
                  {statistics.min.toFixed(unit === 'mg/dL' ? 0 : 1)}
                </Text>
                <Text style={styles.statLabel}>Min</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValueAvg}>
                  {statistics.avg.toFixed(unit === 'mg/dL' ? 0 : 1)}
                </Text>
                <Text style={styles.statLabel}>Moyenne</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValueMax}>
                  {statistics.max.toFixed(unit === 'mg/dL' ? 0 : 1)}
                </Text>
                <Text style={styles.statLabel}>Max</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Readings List */}
        {loading ? (
          <Card>
            <Text style={styles.loadingText}>Chargement...</Text>
          </Card>
        ) : filteredReadings.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Ionicons name="analytics-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyStateTitle}>Aucune mesure trouvée</Text>
              <Text style={styles.emptyStateText}>
                {filterPeriod === 'all' 
                  ? 'Commencez par ajouter votre première mesure de glycémie'
                  : 'Aucune mesure pour cette période'
                }
              </Text>
            </View>
          </Card>
        ) : (
          <FlatList
            data={filteredReadings}
            renderItem={renderReading}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {/* Export Modal */}
        <ExportModal
          visible={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          unit={unit}
          readingsCount={filteredReadings.length}
        />

        {/* Export Success Modal */}
        {exportResult && (
          <ExportSuccessModal
            visible={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              setExportResult(null);
            }}
            filePath={exportResult.path}
            fileName={exportResult.fileName}
            recordsCount={filteredReadings.length}
            format={exportResult.format}
            location={exportResult.location}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardSpacing: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  exportButton: {
    padding: 4,
  },
  unitToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterScroll: {
    marginHorizontal: -16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterTextActive: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statValueMin: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 4,
  },
  statValueAvg: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 4,
  },
  statValueMax: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  readingCard: {
    marginBottom: 12,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  readingDate: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  valueContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  readingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  notesText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
});
