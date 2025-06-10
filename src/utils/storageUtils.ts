import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Platform, Alert, PermissionsAndroid } from 'react-native';

export interface StorageLocation {
  id: string;
  name: string;
  path: string;
  description: string;
  available: boolean;
}

export interface SaveOptions {
  filename: string;
  content: string;
  mimeType: string;
  location: 'documents' | 'downloads' | 'diabecare' | 'choose';
}

// Obtenir les emplacements de stockage disponibles
export const getAvailableStorageLocations = async (): Promise<StorageLocation[]> => {
  const locations: StorageLocation[] = [];

  // Documents de l'application (toujours disponible)
  locations.push({
    id: 'documents',
    name: 'Documents de l\'app',
    path: FileSystem.documentDirectory || '',
    description: 'Dossier privé de l\'application',
    available: true,
  });

  // Dossier DiabeCare dédié (dans les documents de l'app)
  locations.push({
    id: 'diabecare',
    name: 'Dossier DiabeCare',
    path: `${FileSystem.documentDirectory}DiabeCare/`,
    description: 'Dossier dédié dans les documents de l\'app',
    available: true,
  });

  // Option pour choisir l'emplacement
  locations.push({
    id: 'choose',
    name: 'Choisir l\'emplacement',
    path: '',
    description: 'Utiliser le sélecteur de fichiers système',
    available: await Sharing.isAvailableAsync(),
  });

  return locations.filter(loc => loc.available);
};

// Créer le dossier DiabeCare s'il n'existe pas
export const ensureDiabeCareFolder = async (): Promise<string> => {
  try {
    // Utiliser le dossier documents de l'application qui est toujours accessible
    const documentsDir = FileSystem.documentDirectory;
    if (!documentsDir) {
      throw new Error('Dossier documents non disponible');
    }

    // Créer un sous-dossier DiabeCare dans les documents de l'app
    const diabeCarePath = `${documentsDir}DiabeCare/`;

    // Vérifier si le dossier existe
    const folderInfo = await FileSystem.getInfoAsync(diabeCarePath);

    if (!folderInfo.exists) {
      // Créer le dossier
      await FileSystem.makeDirectoryAsync(diabeCarePath, { intermediates: true });
      console.log('Dossier DiabeCare créé:', diabeCarePath);
    }

    return diabeCarePath;
  } catch (error) {
    console.error('Erreur lors de la création du dossier DiabeCare:', error);
    // Fallback vers le dossier documents principal
    return FileSystem.documentDirectory || '';
  }
};

// Sauvegarder un fichier dans l'emplacement spécifié
export const saveFileToStorage = async (options: SaveOptions): Promise<{ success: boolean; path?: string; error?: string }> => {
  try {
    let finalPath: string;
    let useSharing = false;

    switch (options.location) {
      case 'documents':
        finalPath = `${FileSystem.documentDirectory}${options.filename}`;
        break;

      case 'downloads':
        // Pour éviter les problèmes de permissions, utiliser le dossier documents avec partage
        finalPath = `${FileSystem.documentDirectory}${options.filename}`;
        useSharing = true;
        break;

      case 'diabecare':
        const diabeCarePath = await ensureDiabeCareFolder();
        finalPath = `${diabeCarePath}${options.filename}`;
        break;

      case 'choose':
        finalPath = `${FileSystem.documentDirectory}${options.filename}`;
        useSharing = true;
        break;

      default:
        finalPath = `${FileSystem.documentDirectory}${options.filename}`;
        useSharing = true;
    }

    // Écrire le fichier
    await FileSystem.writeAsStringAsync(finalPath, options.content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Si on doit utiliser le partage système
    if (useSharing && await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(finalPath, {
        mimeType: options.mimeType,
        dialogTitle: 'Sauvegarder le fichier',
      });
    }

    return { success: true, path: finalPath };

  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
};

// Demander les permissions de stockage Android
const requestAndroidStoragePermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    // Pour Android 11+ (API 30+), on a besoin de MANAGE_EXTERNAL_STORAGE
    // Pour les versions antérieures, WRITE_EXTERNAL_STORAGE suffit
    const permissions = [
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ];

    // Vérifier si les permissions sont déjà accordées
    const granted = await PermissionsAndroid.requestMultiple(permissions);

    const writeGranted = granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;
    const readGranted = granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;

    return writeGranted && readGranted;
  } catch (error) {
    console.error('Erreur lors de la demande de permissions:', error);
    return false;
  }
};

// Vérifier les permissions de stockage
export const checkStoragePermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      // Essayer d'abord avec les permissions Android natives
      const hasAndroidPermissions = await requestAndroidStoragePermissions();

      if (!hasAndroidPermissions) {
        // Fallback vers MediaLibrary si les permissions natives échouent
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status !== 'granted') {
          const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
          return newStatus === 'granted';
        }
        return true;
      }

      return hasAndroidPermissions;
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return false;
    }
  }
  return true; // iOS n'a pas besoin de permissions spéciales pour les documents
};

// Obtenir des informations sur l'espace de stockage
export const getStorageInfo = async (): Promise<{ totalSpace?: number; freeSpace?: number }> => {
  try {
    // Les informations d'espace de stockage ne sont pas disponibles via expo-file-system
    return {
      totalSpace: undefined, // Non disponible via expo-file-system
      freeSpace: undefined,  // Non disponible via expo-file-system
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des infos de stockage:', error);
    return {};
  }
};

// Lister les fichiers DiabeCare existants
export const listDiabeCareFiles = async (): Promise<string[]> => {
  try {
    const diabeCarePath = await ensureDiabeCareFolder();
    const files = await FileSystem.readDirectoryAsync(diabeCarePath);
    
    // Filtrer seulement les fichiers DiabeCare
    return files.filter(file => 
      file.startsWith('glycemie_') && 
      (file.endsWith('.csv') || file.endsWith('.json'))
    );
  } catch (error) {
    console.error('Erreur lors de la lecture du dossier DiabeCare:', error);
    return [];
  }
};

// Supprimer un fichier d'export
export const deleteExportFile = async (filename: string, location: string = 'diabecare'): Promise<boolean> => {
  try {
    let filePath: string;
    
    switch (location) {
      case 'diabecare':
        const diabeCarePath = await ensureDiabeCareFolder();
        filePath = `${diabeCarePath}${filename}`;
        break;
      case 'documents':
        filePath = `${FileSystem.documentDirectory}${filename}`;
        break;
      default:
        return false;
    }

    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    return false;
  }
};

// Obtenir la taille d'un fichier
export const getFileSize = async (filename: string, location: string = 'diabecare'): Promise<number> => {
  try {
    let filePath: string;
    
    switch (location) {
      case 'diabecare':
        const diabeCarePath = await ensureDiabeCareFolder();
        filePath = `${diabeCarePath}${filename}`;
        break;
      case 'documents':
        filePath = `${FileSystem.documentDirectory}${filename}`;
        break;
      default:
        return 0;
    }

    const fileInfo = await FileSystem.getInfoAsync(filePath);
    return fileInfo.exists && fileInfo.size ? fileInfo.size : 0;
  } catch (error) {
    console.error('Erreur lors de la récupération de la taille du fichier:', error);
    return 0;
  }
};
