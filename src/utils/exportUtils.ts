import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { GlycemiaReading, GlycemiaUnit } from '../types';
import { convertGlycemia, getGlycemiaStatus } from './glycemiaUtils';
import { saveFileToStorage, SaveOptions, getAvailableStorageLocations, StorageLocation } from './storageUtils';

export interface ExportOptions {
  format: 'csv' | 'json';
  unit: GlycemiaUnit;
  includeNotes: boolean;
  includeStatus: boolean;
  storageLocation: 'documents' | 'downloads' | 'diabecare' | 'choose';
}

// Formater la date pour l'export
const formatDateForExport = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Formater l'heure pour l'export
const formatTimeForExport = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Convertir les données en CSV
const convertToCSV = (readings: GlycemiaReading[], options: ExportOptions): string => {
  const headers = [
    'Date',
    'Heure',
    `Glycémie (${options.unit})`,
    ...(options.includeStatus ? ['Statut'] : []),
    ...(options.includeNotes ? ['Notes'] : []),
  ];

  const rows = readings.map(reading => {
    const displayValue = options.unit === 'mg/dL' 
      ? reading.value 
      : convertGlycemia(reading.value, 'mg/dL', 'mmol/L');
    
    const status = getGlycemiaStatus(reading.value, 'mg/dL');
    
    const row = [
      formatDateForExport(reading.date),
      formatTimeForExport(reading.date),
      options.unit === 'mg/dL' 
        ? displayValue.toString()
        : displayValue.toFixed(1),
      ...(options.includeStatus ? [status.status] : []),
      ...(options.includeNotes ? [reading.notes || ''] : []),
    ];

    // Échapper les guillemets et entourer les champs contenant des virgules
    return row.map(field => {
      const stringField = String(field);
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    }).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

// Convertir les données en JSON
const convertToJSON = (readings: GlycemiaReading[], options: ExportOptions): string => {
  const exportData = {
    exportDate: new Date().toISOString(),
    unit: options.unit,
    totalReadings: readings.length,
    readings: readings.map(reading => {
      const displayValue = options.unit === 'mg/dL' 
        ? reading.value 
        : convertGlycemia(reading.value, 'mg/dL', 'mmol/L');
      
      const status = getGlycemiaStatus(reading.value, 'mg/dL');
      
      const exportReading: any = {
        date: formatDateForExport(reading.date),
        time: formatTimeForExport(reading.date),
        value: options.unit === 'mg/dL' 
          ? displayValue 
          : Number(displayValue.toFixed(1)),
        unit: options.unit,
      };

      if (options.includeStatus) {
        exportReading.status = status.status;
        exportReading.statusCategory = status.category;
      }

      if (options.includeNotes && reading.notes) {
        exportReading.notes = reading.notes;
      }

      return exportReading;
    }),
  };

  return JSON.stringify(exportData, null, 2);
};

// Calculer les statistiques pour l'export
export const calculateExportStatistics = (readings: GlycemiaReading[], unit: GlycemiaUnit) => {
  if (readings.length === 0) return null;

  const values = readings.map(r => 
    unit === 'mg/dL' ? r.value : convertGlycemia(r.value, 'mg/dL', 'mmol/L')
  );

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Compter les statuts
  const statusCounts = readings.reduce((acc, reading) => {
    const status = getGlycemiaStatus(reading.value, 'mg/dL');
    acc[status.category] = (acc[status.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    count: readings.length,
    min: unit === 'mg/dL' ? Math.round(min) : Number(min.toFixed(1)),
    max: unit === 'mg/dL' ? Math.round(max) : Number(max.toFixed(1)),
    avg: unit === 'mg/dL' ? Math.round(avg) : Number(avg.toFixed(1)),
    unit,
    statusDistribution: statusCounts,
    period: {
      from: readings.length > 0 ? formatDateForExport(readings[readings.length - 1].date) : null,
      to: readings.length > 0 ? formatDateForExport(readings[0].date) : null,
    },
  };
};

// Fonction principale d'export avec choix de stockage
export const exportGlycemiaData = async (
  readings: GlycemiaReading[],
  options: ExportOptions,
  filename?: string
): Promise<{ success: boolean; path?: string; error?: string }> => {
  try {
    if (readings.length === 0) {
      throw new Error('Aucune donnée à exporter');
    }

    // Trier par date décroissante
    const sortedReadings = [...readings].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Générer le contenu selon le format
    let content: string;
    let fileExtension: string;
    let mimeType: string;

    if (options.format === 'csv') {
      content = convertToCSV(sortedReadings, options);
      fileExtension = 'csv';
      mimeType = 'text/csv';
    } else {
      content = convertToJSON(sortedReadings, options);
      fileExtension = 'json';
      mimeType = 'application/json';
    }

    // Générer le nom de fichier
    const timestamp = new Date().toISOString().split('T')[0];
    const defaultFilename = `glycemie_${timestamp}.${fileExtension}`;
    const finalFilename = filename || defaultFilename;

    // Préparer les options de sauvegarde
    const saveOptions: SaveOptions = {
      filename: finalFilename,
      content,
      mimeType,
      location: options.storageLocation,
    };

    // Sauvegarder le fichier
    const result = await saveFileToStorage(saveOptions);

    if (result.success) {
      return {
        success: true,
        path: result.path,
      };
    } else {
      throw new Error(result.error || 'Erreur lors de la sauvegarde');
    }
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Fonction pour obtenir les formats d'export disponibles
export const getAvailableExportFormats = () => [
  {
    key: 'csv',
    label: 'CSV (Excel)',
    description: 'Format compatible avec Excel et autres tableurs',
    icon: 'document-text-outline',
  },
  {
    key: 'json',
    label: 'JSON',
    description: 'Format structuré pour développeurs',
    icon: 'code-outline',
  },
];

// Fonction pour obtenir les emplacements de stockage avec descriptions
export const getStorageLocationOptions = () => [
  {
    key: 'diabecare',
    label: 'Dossier DiabeCare',
    description: 'Dossier dédié dans les documents de l\'app',
    icon: 'folder-outline',
    recommended: true,
  },
  {
    key: 'downloads',
    label: 'Partager vers Téléchargements',
    description: 'Utiliser le partage système vers Téléchargements',
    icon: 'download-outline',
    recommended: false,
  },
  {
    key: 'documents',
    label: 'Documents de l\'app',
    description: 'Dossier privé de l\'application',
    icon: 'document-outline',
    recommended: false,
  },
  {
    key: 'choose',
    label: 'Choisir l\'emplacement',
    description: 'Utiliser le sélecteur de fichiers système',
    icon: 'folder-open-outline',
    recommended: false,
  },
];

// Fonction pour valider les options d'export
export const validateExportOptions = (options: ExportOptions): string[] => {
  const errors: string[] = [];

  if (!['csv', 'json'].includes(options.format)) {
    errors.push('Format d\'export invalide');
  }

  if (!['mg/dL', 'mmol/L'].includes(options.unit)) {
    errors.push('Unité invalide');
  }

  return errors;
};
