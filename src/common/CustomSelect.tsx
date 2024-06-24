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
  value?: string; 
  onChange?: (value: string) => void; 
  options: OptionType[]; 
  disabled?: boolean;
  size?: SizeType;
  isEdit?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, disabled , size='large', isEdit }) => {
  const { t } = useTranslation();


  const handleChange = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <Select value={value} onChange={handleChange} disabled={disabled} size={size} style={{ minWidth: 200 }} placeholder={ t('chooseHere')} 
      status={isEdit ? 'warning' : ''}
    >
      {options.map((option) => (
        <Option key={option.key} value={option.key}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default CustomSelect;
