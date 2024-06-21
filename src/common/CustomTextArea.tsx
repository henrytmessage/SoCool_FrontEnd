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
  required?: boolean
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  value,
  disabled,
  maxLength,
  onChange,
  // onEnterPress,
  width=850,
  placeholder,
  required
}) => {

  const { t } = useTranslation();
  
  // const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault(); // Prevent default behavior (new line)
  //     if (onEnterPress) {
  //       onEnterPress(); // Call callback function if provided
  //     }
  //   }
  // };

  return (
    <div className='flex flex-col'>
      <Input.TextArea
        rows={4}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        style={{ width: width }}
        status={required ? 'error' : ''}
        onChange={onChange}
        // onPressEnter={handleKeyPress}
      />
      {required && <span className="text-red-500 text-sm mt-1">{t('required')}</span>}
    </div> 
  );
};

export default CustomTextArea;
