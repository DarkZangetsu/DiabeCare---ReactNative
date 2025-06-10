import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastType } from '../components/Toast';

interface ToastConfig {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextType {
  showToast: (config: Omit<ToastConfig, 'id'>) => void;
  showSuccess: (message: string, action?: ToastConfig['action']) => void;
  showError: (message: string, action?: ToastConfig['action']) => void;
  showWarning: (message: string, action?: ToastConfig['action']) => void;
  showInfo: (message: string, action?: ToastConfig['action']) => void;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showToast = (config: Omit<ToastConfig, 'id'>) => {
    const id = generateId();
    const newToast: ToastConfig = { ...config, id };
    
    setToasts(prev => {
      // Limiter à 3 toasts maximum
      const filtered = prev.slice(-2);
      return [...filtered, newToast];
    });
  };

  const showSuccess = (message: string, action?: ToastConfig['action']) => {
    showToast({ message, type: 'success', action });
  };

  const showError = (message: string, action?: ToastConfig['action']) => {
    showToast({ message, type: 'error', action });
  };

  const showWarning = (message: string, action?: ToastConfig['action']) => {
    showToast({ message, type: 'warning', action });
  };

  const showInfo = (message: string, action?: ToastConfig['action']) => {
    showToast({ message, type: 'info', action });
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const hideAllToasts = () => {
    setToasts([]);
  };

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
    hideAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          visible={true}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          action={toast.action}
          onHide={() => hideToast(toast.id)}
          style={{
            top: 60 + (index * 80), // Empiler les toasts
          }}
        />
      ))}
    </ToastContext.Provider>
  );
};
