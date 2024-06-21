import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { SizeType } from 'antd/es/config-provider/SizeContext';

const { Option } = Select;

interface OptionType {
  key: number | string;
  label: string;
}

interface CustomSelectProps {
  value?: number; 
  onChange?: (value: number) => void; 
  options: OptionType[]; 
  disabled?: boolean;
  size?: SizeType
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, disabled , size='large' }) => {
  const { t } = useTranslation();


  const handleChange = (selectedValue: number) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <Select value={value} onChange={handleChange} disabled={disabled} size={size} style={{ minWidth: 200 }} placeholder={ t('chooseHere')}>
      {options.map((option) => (
        <Option key={option.key} value={option.key}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default CustomSelect;
