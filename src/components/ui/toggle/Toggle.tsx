import React from "react";

type ToggleProps = {
  label?: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({ label, enabled, onToggle }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onToggle(!enabled)}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${
          enabled ? "bg-indigo-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-300 ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
      {label && <span className="text-xs font-medium">{label}</span>}
    </div>
  );
};

export default Toggle;
