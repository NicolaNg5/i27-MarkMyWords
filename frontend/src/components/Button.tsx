import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-secondary text-black font-semibold py-2 px-4 rounded-lg hover:bg-secondary-dark transition-colors duration-300"
    >
      {text}
    </button>
  );
};

export default Button;
