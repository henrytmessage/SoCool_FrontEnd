import React, { useState } from 'react';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';

interface EmailInputProps {
  value?: string;
  onChange?: (value: string) => void;
  size?: 'large' | 'middle' | 'small';
  width?: number;
}

const CustomInputEmail: React.FC<EmailInputProps> = ({ value, onChange, size="large" , width = 400}) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState(value || '');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    // Regular expression for basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (validateEmail(email)) {
        setError('');
        onChange && onChange(email);
      } else {
        setError(t('errorValidEmail'));
      }
    }
  };

  return (
    <div className="flex flex-col">
      <Input
        value={email}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={t('emailHere')}
        status={error ? 'error' : ''}
        size={size}
        style={{ width: width }}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default CustomInputEmail;
