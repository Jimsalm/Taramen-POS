import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import ConfirmModal from "@/components/custom/ConfirmModal";

const ConfirmContext = createContext();

const defaultState = {
  isOpen: false,
  title: "",
  message: "",
  onConfirm: null,
  onCancel: null,
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  primaryActionVariant: "default",
};

const useConfirmState = () => {
  const [confirmState, setConfirmState] = useState(defaultState);
  const resolverRef = useRef(null);
  const settledRef = useRef(false);

  const resolveOnce = useCallback((result, callback) => {
    if (settledRef.current) return;
    settledRef.current = true;
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
    callback?.();
    resolverRef.current?.(result);
  }, []);

  const confirm = useCallback((title, message, onConfirm, onCancel) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      settledRef.current = false;
      setConfirmState({
        ...defaultState,
        isOpen: true,
        title: title ?? "",
        message: message ?? "",
        onConfirm,
        onCancel,
      });
    });
  }, []);

  const handleConfirm = useCallback(
    () => resolveOnce(true, confirmState.onConfirm),
    [resolveOnce, confirmState.onConfirm]
  );

  const handleCancel = useCallback(
    () => resolveOnce(false, confirmState.onCancel),
    [resolveOnce, confirmState.onCancel]
  );

  const handleClose = useCallback(
    () => resolveOnce(false, confirmState.onCancel),
    [resolveOnce, confirmState.onCancel]
  );

  return { confirmState, confirm, handleConfirm, handleCancel, handleClose };
};

export function ConfirmProvider({ children }) {
  const { confirmState, confirm, handleConfirm, handleCancel, handleClose } = useConfirmState();

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleClose}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        primaryActionVariant={confirmState.primaryActionVariant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
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
  const { confirmState, confirm, handleConfirm, handleCancel, handleClose } = useConfirmState();

  globalConfirm = confirm;

  return (
    <ConfirmModal
      isOpen={confirmState.isOpen}
      onClose={handleClose}
      title={confirmState.title}
      message={confirmState.message}
      confirmLabel={confirmState.confirmLabel}
      cancelLabel={confirmState.cancelLabel}
      primaryActionVariant={confirmState.primaryActionVariant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}

export function confirmAction(title, message, onConfirm, onCancel) {
  if (globalConfirm) {
    return globalConfirm(title, message, onConfirm, onCancel);
  }
  return Promise.resolve(false);
}
