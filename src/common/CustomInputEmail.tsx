import React, { useState } from 'react';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';

interface EmailInputProps {
  value?: string;
  size?: 'large' | 'middle' | 'small';
  width?: number;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
  isEdit?: boolean;
}

const CustomInputEmail: React.FC<EmailInputProps> = ({ value, size="large" , width = 400, required, onChange, onEnter, isEdit}) => {
  const { t } = useTranslation();

  const validateEmail = (email: string) => {
    // Regular expression for basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter && onEnter();
    }
  };

  return (
    <div className="flex flex-col">
      <Input
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={t('emailHere')}
        status={required ? 'error' : (isEdit ? 'warning' : '')} 
        size={size}
        style={{ width: width }}
      />
      {required && <span className="text-red-500 text-sm mt-1">{t('errorValidEmail')}</span>}
    </div>
  );
};

export default CustomInputEmail;
