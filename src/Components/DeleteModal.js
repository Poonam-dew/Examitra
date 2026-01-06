import React, { useEffect, useState } from "react";

export default function DeleteModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  isOpen,
  onClose,
  onConfirm,
}) {
  const [visible, setVisible] = useState(isOpen);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4
        bg-black/40 transition-opacity duration-200
        ${isOpen ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-xl w-full max-w-sm
          p-5 sm:p-6 transform transition-all duration-200
          ${isOpen ? "scale-100" : "scale-95"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-base sm:text-lg font-semibold mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            disabled={loading}
            onClick={onClose}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg border transition
              ${loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"}`}
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleConfirm}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition
              flex items-center justify-center gap-2
              ${loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"}`}
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
