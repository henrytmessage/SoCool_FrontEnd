import React from 'react';
import { Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomSelect from './CustomSelect';
import { formatVND } from '../function';

interface CustomInputNumberProps {
  value: string;
  valueCurrency?: string;
  size?: 'large' | 'middle' | 'small';
  width?: number;
  disabled?: boolean;
  currencyOptions: string[];
  required?: boolean;
  isEdit?: boolean;
  onChange: (value: string) => void; 
  onChangeSelect?: (value: string) => void;
  onEnter?: () => void;
}

const CustomInputNumber: React.FC<CustomInputNumberProps> = ({ value, valueCurrency, size='large', width = 400, disabled, currencyOptions, required, onChange, onChangeSelect, onEnter, isEdit }) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\s/g, '');
    
    if (inputValue === '') {
      onChange(inputValue);
      return;
    }
  
    // Nếu là USD, cho phép nhập số và dấu "."
    if (valueCurrency === 'USD') {
      // Kiểm tra nếu là số hoặc dấu "." (nếu chưa có dấu ".")
      if (/^\d*\.?\d*$/.test(inputValue)) {
        // Kiểm tra nếu dấu "." đã có và ngăn cách nhiều hơn một dấu "."
        if (inputValue.split('.').length <= 2) {
          // Kiểm tra nếu có thể parse giá trị
          if (!isNaN(parseFloat(inputValue))) {
            onChange(inputValue); 
          }
        }
      }
    } else {
      // Nếu không phải USD, chỉ cho phép nhập số
      if (/^\d*$/.test(inputValue)) {
        const inputNumberPrice = formatVND(inputValue)
        onChange(inputNumberPrice); 
      }
    }
  };
  

  const { Option } = Select;
  const selectAfter = (
    <Select value={valueCurrency} onChange={onChangeSelect} disabled={true} 
      status={isEdit ? 'warning' : ''}
    >
      {currencyOptions?.map((currency) => (
        <Option key={currency} value={currency}>
          {currency}
        </Option>
      ))}
    </Select>
  );

  return (
    <div className="flex flex-col border-blue-500" >
      <Input
        value={value}
        size={size}
        // style={{ width: width }}
        addonAfter={selectAfter}
        disabled={disabled}
        placeholder={t('writeNumberHere')}
        status={required ? 'error' : (isEdit ? 'warning' : '')} 
        className='md:w-[400px]'
        onChange={handleChange}
    
      />
      {required && <span className="text-red-500 text-sm mt-1">{t('required')}</span>}
    </div>
  );
};

export default CustomInputNumber;
