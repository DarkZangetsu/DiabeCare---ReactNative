import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, TextInput, StyleSheet, Animated, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface InputDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: 'text' | 'number' | 'email' | 'multiline';
  maxLength?: number;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  validation?: (value: string) => string | null; // Retourne un message d'erreur ou null
}

const { width: screenWidth } = Dimensions.get('window');

export const InputDialog: React.FC<InputDialogProps> = ({
  visible,
  title,
  message,
  placeholder = 'Entrez votre texte...',
  defaultValue = '',
  inputType = 'text',
  maxLength,
  onConfirm,
  onCancel,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  icon = 'create-outline',
  validation,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setValue(defaultValue);
      setError(null);
      
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Focus sur l'input après l'animation
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      });
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, defaultValue]);

  const handleConfirm = () => {
    // Validation
    if (validation) {
      const validationError = validation(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    onConfirm(value);
  };

  const handleCancel = () => {
    setValue(defaultValue);
    setError(null);
    onCancel();
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    // Effacer l'erreur quand l'utilisateur tape
    if (error) {
      setError(null);
    }
  };

  const getKeyboardType = () => {
    switch (inputType) {
      case 'number':
        return 'numeric';
      case 'email':
        return 'email-address';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
          <Animated.View
            style={[
              styles.dialog,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name={icon as any} size={24} color="#3b82f6" />
              </View>
              <Text style={styles.title}>{title}</Text>
              {message && <Text style={styles.message}>{message}</Text>}
            </View>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={[
                  styles.input,
                  inputType === 'multiline' && styles.multilineInput,
                  error && styles.inputError,
                ]}
                value={value}
                onChangeText={handleValueChange}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                keyboardType={getKeyboardType()}
                multiline={inputType === 'multiline'}
                numberOfLines={inputType === 'multiline' ? 4 : 1}
                maxLength={maxLength}
                autoCapitalize={inputType === 'email' ? 'none' : 'sentences'}
                autoCorrect={inputType !== 'email'}
                selectTextOnFocus
              />
              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              {maxLength && (
                <Text style={styles.charCount}>
                  {value.length}/{maxLength}
                </Text>
              )}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                title={cancelText}
                variant="outline"
                onPress={handleCancel}
                style={styles.cancelButton}
              />
              <Button
                title={confirmText}
                variant="primary"
                onPress={handleConfirm}
                style={styles.confirmButton}
                disabled={!value.trim()}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: Math.min(screenWidth - 40, 400),
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    padding: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});
