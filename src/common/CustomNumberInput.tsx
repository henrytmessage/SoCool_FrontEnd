import React from 'react';
import { Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomSelect from './CustomSelect';

interface CustomInputNumberProps {
  value: string;
  size?: 'large' | 'middle' | 'small';
  width?: number;
  disabled?: boolean;
  currencyOptions: string[];
  onChange: (value: string) => void; 
  onChangeSelect?: (value: string) => void;
  onEnter?: () => void;
}

const CustomInputNumber: React.FC<CustomInputNumberProps> = ({ value, size='large', width = 400, disabled, currencyOptions, onChange, onChangeSelect, onEnter }) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Kiểm tra nếu là số
    if (/^\d*$/.test(inputValue)) {
      onChange(inputValue); 
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onEnter) {
        onEnter(); // Gọi callback khi nhấn Enter
      }
    }
  };

  const { Option } = Select;
  const selectAfter = (
    <Select defaultValue={currencyOptions[0]} onChange={onChangeSelect} disabled={disabled}>
      {currencyOptions?.map((currency) => (
        <Option key={currency} value={currency}>
          {currency}
        </Option>
      ))}
    </Select>
  );

  return (
    <Input
      value={value}
      size={size}
      style={{ width: width }}
      addonAfter={selectAfter}
      disabled={disabled}
      placeholder={t('writeNumberHere')}
      onChange={handleChange}
      onPressEnter={handleKeyPress}
    />
  );
};

export default CustomInputNumber;
