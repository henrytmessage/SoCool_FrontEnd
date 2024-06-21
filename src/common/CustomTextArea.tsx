import React from 'react';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';

interface CustomTextAreaProps {
  value: string;
  disabled?: boolean;
  maxLength?: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onEnterPress?: () => void;
  width?: number;
  placeholder?: string;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  value,
  disabled,
  maxLength,
  onChange,
  onEnterPress,
  width=850,
  placeholder
}) => {
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (new line)
      if (onEnterPress) {
        onEnterPress(); // Call callback function if provided
      }
    }
  };

  return (
    <Input.TextArea
      rows={4}
      maxLength={maxLength}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      style={{ width: width }}
      onChange={onChange}
      onPressEnter={handleKeyPress}
    />
  );
};

export default CustomTextArea;
