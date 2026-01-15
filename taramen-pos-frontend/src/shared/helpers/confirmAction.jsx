import React, { createContext, useContext, useState } from "react";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const confirm = (title, message, onConfirm, onCancel) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          if (onCancel) onCancel();
          resolve(false);
        },
      });
    });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {/* Modal implementation would go here */}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}

// Global confirmation dialog instance
let globalConfirm = null;

export function ConfirmationDialog() {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  globalConfirm = (title, message, onConfirm, onCancel) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          if (onConfirm) onConfirm();
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          if (onCancel) onCancel();
          resolve(false);
        },
      });
    });
  };

  if (!confirmState.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{confirmState.title}</h3>
        <p className="text-gray-600 mb-4">{confirmState.message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={confirmState.onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={confirmState.onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export function confirmAction(title, message, onConfirm, onCancel) {
  if (globalConfirm) {
    return globalConfirm(title, message, onConfirm, onCancel);
  }
  return Promise.resolve(false);
}
