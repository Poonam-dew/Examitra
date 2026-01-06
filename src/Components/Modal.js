import React, { useState } from "react";

export default function Modal({
  title,
  label,
  placeholder,
  value,
  setValue,
  onSubmit,
  onClose,
  buttonText,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center
                 z-50 px-4 sm:px-0"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md sm:max-w-[450px]
                   p-5 sm:p-6 rounded-lg shadow-lg relative
                   transition-all duration-300 transform scale-100
                   animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className={`absolute top-2 right-4 sm:right-6 text-gray-500
                      hover:text-black text-2xl
                      ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-semibold mb-4">
          {title}
        </h2>

        {/* Input Label */}
        <p className="mb-2 text-black font-semibold text-sm">
          {label}
        </p>

        {/* Input */}
        <input
          className="border rounded-md w-full px-3 py-2 text-sm
                     mb-5 focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading}
        />

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`w-full sm:w-auto px-4 py-2 border rounded-lg
                        ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !value.trim()}
            className={`w-full sm:w-auto px-4 py-2 bg-black text-white
                        rounded-lg flex items-center gap-2 justify-center
                        ${isLoading
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:bg-gray-900"}`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Please wait...
              </>
            ) : (
              buttonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
