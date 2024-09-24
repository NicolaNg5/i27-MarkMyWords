import React from 'react';

interface SwitchButtonProps {
  isOn: boolean;
  toggleSwitch: () => void;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ isOn, toggleSwitch }) => {
  // Determine the label based on the isOn state
  const label = isOn ? 'View Results for Student' : 'View Results for Class';

  return (
    <div className="flex items-center space-x-2 px-3 py-3">
      <span>{label}</span>
      <button
        onClick={toggleSwitch}
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${isOn ? 'bg-yellow-400' : 'bg-gray-300'}`}
      >
        <div
          className={`h-4 w-4 rounded-full bg-white transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};

export default SwitchButton;
