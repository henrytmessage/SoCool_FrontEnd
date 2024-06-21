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
  required?: boolean;
  onChange: (value: string) => void; 
  onChangeSelect?: (value: string) => void;
  onEnter?: () => void;
}

const CustomInputNumber: React.FC<CustomInputNumberProps> = ({ value, size='large', width = 400, disabled, currencyOptions, required, onChange, onChangeSelect, onEnter }) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Kiểm tra nếu là số
    if (/^\d*$/.test(inputValue)) {
      onChange(inputValue); 
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
    <div className="flex flex-col">
      <Input
        value={value}
        size={size}
        style={{ width: width }}
        addonAfter={selectAfter}
        disabled={disabled}
        placeholder={t('writeNumberHere')}
        status={required ? 'error' : ''}
        onChange={handleChange}
      />
      {required && <span className="text-red-500 text-sm mt-1">{t('required')}</span>}
    </div>
  );
};

export default CustomInputNumber;
