import React from 'react';

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange }) => {
  const toggle = () => onChange(!enabled);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        onClick={toggle}
        className={`${
          enabled ? 'bg-teal-600' : 'bg-gray-200'
        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
        aria-checked={enabled}
        role="switch"
      >
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
