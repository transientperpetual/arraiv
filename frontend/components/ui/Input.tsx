import React from "react";

interface InputProps {
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 h-11 border text-sm text-black-primary font-normal border-white-secondary rounded-sm focus:outline-none focus:ring-1 focus:ring-black-secondary disabled:opacity-50"
    />
  );
};

export default Input;
