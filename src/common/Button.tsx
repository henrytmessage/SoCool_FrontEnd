import React from 'react';

interface CustomButtonProps {
  onClick?: () => void; 
  children?: React.ReactNode; 
  classNameCustom?: string;
}

const Button: React.FC<CustomButtonProps> = ({ onClick, children, classNameCustom }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded bg-cyan-400 hover:bg-cyan-500 transition-colors duration-300 ${classNameCustom}`}
    >
      {children}
    </button>
  );
};

export default Button;
