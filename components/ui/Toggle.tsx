import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, size = 'md' }) => {
  const height = size === 'sm' ? 'h-5' : 'h-6';
  const width = size === 'sm' ? 'w-9' : 'w-11';
  const knobSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const translate = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

  return (
    <button
      type="button"
      className={`${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex ${height} ${width} flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`${
          checked ? translate : 'translate-x-0'
        } pointer-events-none inline-block ${knobSize} transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};