import { useState, useEffect } from 'react';
import Toast from './Toast';

interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

let addToastCallback: ((message: string, type: ToastData['type']) => void) | null = null;

export const showToast = (message: string, type: ToastData['type'] = 'info') => {
  if (addToastCallback) {
    addToastCallback(message, type);
  }
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    addToastCallback = (message: string, type: ToastData['type']) => {
      const newToast = {
        id: Date.now(),
        message,
        type,
      };
      setToasts((prev) => [...prev, newToast]);
    };

    return () => {
      addToastCallback = null;
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
