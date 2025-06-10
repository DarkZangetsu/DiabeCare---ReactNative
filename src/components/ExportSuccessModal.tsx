import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import * as Sharing from 'expo-sharing';

interface ExportSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  filePath: string;
  fileName: string;
  recordsCount: number;
  format: string;
  location: string;
}

export const ExportSuccessModal: React.FC<ExportSuccessModalProps> = ({
  visible,
  onClose,
  filePath,
  fileName,
  recordsCount,
  format,
  location,
}) => {
  const getLocationDisplayName = (loc: string) => {
    switch (loc) {
      case 'diabecare': return 'Dossier DiabeCare';
      case 'downloads': return 'Téléchargements';
      case 'documents': return 'Documents de l\'app';
      case 'choose': return 'Emplacement choisi';
      default: return 'Emplacement inconnu';
    }
  };

  const handleShareAgain = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          dialogTitle: 'Partager le fichier d\'export',
        });
      } else {
        Alert.alert('Erreur', 'Le partage n\'est pas disponible sur cet appareil');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le fichier');
    }
  };

  const copyPathToClipboard = () => {
    // Note: Pour copier dans le presse-papiers, il faudrait installer expo-clipboard
    Alert.alert(
      'Chemin du fichier',
      filePath,
      [
        { text: 'OK' },
        { text: 'Partager à nouveau', onPress: handleShareAgain }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Export réussi !</Text>

          {/* Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="document-text-outline" size={20} color="#6b7280" />
              <Text style={styles.detailText}>
                {recordsCount} mesures exportées
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="code-outline" size={20} color="#6b7280" />
              <Text style={styles.detailText}>
                Format: {format.toUpperCase()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="folder-outline" size={20} color="#6b7280" />
              <Text style={styles.detailText}>
                {getLocationDisplayName(location)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="document-outline" size={20} color="#6b7280" />
              <Text style={styles.detailText} numberOfLines={2}>
                {fileName}
              </Text>
            </View>
          </View>

          {/* File Path */}
          <TouchableOpacity style={styles.pathContainer} onPress={copyPathToClipboard}>
            <View style={styles.pathHeader}>
              <Ionicons name="location-outline" size={16} color="#3b82f6" />
              <Text style={styles.pathLabel}>Chemin du fichier</Text>
              <Ionicons name="copy-outline" size={16} color="#3b82f6" />
            </View>
            <Text style={styles.pathText} numberOfLines={3}>
              {filePath}
            </Text>
          </TouchableOpacity>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <Button
              title="Partager à nouveau"
              variant="outline"
              onPress={handleShareAgain}
              style={styles.shareButton}
            />
            <Button
              title="Terminé"
              onPress={onClose}
              style={styles.doneButton}
            />
          </View>

          {/* Info */}
          <Text style={styles.infoText}>
            Le fichier a été sauvegardé et peut être partagé avec votre médecin ou importé dans d'autres applications.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  pathContainer: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  pathLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
    flex: 1,
  },
  pathText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  shareButton: {
    flex: 1,
  },
  doneButton: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});
