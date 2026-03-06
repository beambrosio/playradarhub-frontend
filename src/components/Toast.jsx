import React, { useEffect, useState } from 'react';
import './Toast.css';
export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  if (!visible) return null;
  return (
    <div className={`toast toast--${type} ${visible ? 'toast--visible' : ''}`}>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={() => {
          setVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        aria-label="Close notification"
      >
        ?
      </button>
    </div>
  );
}
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return { toasts, addToast, removeToast };
}
