"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: {
      icon: "text-red-500",
      iconBg: "bg-red-500/10",
      button: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
      icon: "text-yellow-500",
      iconBg: "bg-yellow-500/10",
      button: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    info: {
      icon: "text-blue-500",
      iconBg: "bg-blue-500/10",
      button: "bg-blue-500 hover:bg-blue-600 text-white",
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background border rounded-2xl shadow-2xl max-w-md w-full p-6 relative pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center mb-4`}
              >
                <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
              </div>

              {/* Content */}
              <h2 className="text-xl font-bold mb-2">{title}</h2>
              <p className="text-muted-foreground mb-6">{message}</p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-lg border hover:bg-muted transition-colors font-medium"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-2.5 rounded-lg transition-colors font-medium ${styles.button}`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Made with Bob
