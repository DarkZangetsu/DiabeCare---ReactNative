import { useState } from 'react';

interface ConfirmDialogConfig {
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  destructive?: boolean;
}

interface InputDialogConfig {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: 'text' | 'number' | 'email' | 'multiline';
  maxLength?: number;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  validation?: (value: string) => string | null;
}

export const useDialog = () => {
  const [confirmDialog, setConfirmDialog] = useState<{
    visible: boolean;
    config: ConfirmDialogConfig;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    visible: false,
    config: { title: '', message: '' },
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [inputDialog, setInputDialog] = useState<{
    visible: boolean;
    config: InputDialogConfig;
    onConfirm: (value: string) => void;
    onCancel: () => void;
  }>({
    visible: false,
    config: { title: '' },
    onConfirm: (value: string) => {},
    onCancel: () => {},
  });

  const showConfirmDialog = (
    config: ConfirmDialogConfig,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setConfirmDialog({
      visible: true,
      config,
      onConfirm: () => {
        onConfirm();
        hideConfirmDialog();
      },
      onCancel: () => {
        onCancel?.();
        hideConfirmDialog();
      },
    });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, visible: false }));
  };

  const showInputDialog = (
    config: InputDialogConfig,
    onConfirm: (value: string) => void,
    onCancel?: () => void
  ) => {
    setInputDialog({
      visible: true,
      config,
      onConfirm: (value: string) => {
        onConfirm(value);
        hideInputDialog();
      },
      onCancel: () => {
        onCancel?.();
        hideInputDialog();
      },
    });
  };

  const hideInputDialog = () => {
    setInputDialog(prev => ({ ...prev, visible: false }));
  };

  const confirmDelete = (
    itemName: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showConfirmDialog(
      {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer "${itemName}" ? Cette action est irréversible.`,
        type: 'danger',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        icon: 'trash',
        destructive: true,
      },
      onConfirm,
      onCancel
    );
  };

  return {
    confirmDialog,
    showConfirmDialog,
    hideConfirmDialog,
    inputDialog,
    showInputDialog,
    hideInputDialog,
    confirmDelete,
  };
};
