import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  onClick?: any;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
}) => {
  const baseStyles = 'w-full px-4 rounded-sm font-medium transition-colors cursor-pointer';
  const variantStyles = {
    primary: 'h-11 bg-blackest text-background hover:bg-black-stroke active:bg-black-stroke',
    secondary: 'h-11 border border-2 border-screen-bg text-gray-800 hover:bg-gray-300',
    tertiary: 'py-0 text-black-primary font-black text-black-primary hover:text-black-stroke active:text-black-stroke'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;