import React from "react";

interface ButtonProps {
  text: string;
  additionalStyling?: string;
  icon?: any;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, additionalStyling, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${additionalStyling} inline-flex items-center font-semibold py-2 px-4 rounded-lg`}
    >
      <span className="mr-3">{icon}</span>
      {text}
    </button>
  );
};

export default Button;
