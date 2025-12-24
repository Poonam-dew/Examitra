import React, { useState } from "react";

export default function Modal({
  title,
  label,
  placeholder,
  value,
  setValue,
  onSubmit,
  onClose,
  buttonText
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true); // start loader
    try {
      await onSubmit(); // call parent function (API)
    } catch (err) {
      // optional: handle error inside modal
    } finally {
      setIsLoading(false); // stop loader
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] relative transition-all duration-300 ease-in-out transform scale-100 animate-slide-in">

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading} // disable while loading
          className={`absolute top-2 right-6 text-gray-500 hover:text-black text-2xl ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-base font-semibold mb-4">{title}</h2>

        {/* Input Label */}
        <p className="mb-2 text-black font-semibold text-sm">{label}</p>

        {/* Input */}
        <input
          className="border rounded-md w-full px-3 text-sm py-2 mb-4"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading} // prevent typing while loading
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-4 py-2 border rounded-lg ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !value.trim()} // disable empty value
            className={`px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-900"
            }`}
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
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
