import React, { forwardRef, useEffect, useState } from 'react';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';

interface CustomTextAreaProps {
  value?: string;
  disabled?: boolean;
  maxLength?: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onEnterPress?: () => void;
  width?: number;
  placeholder?: string;
  required?: boolean;
  isEdit?: boolean;
  key?: string;
}

const CustomTextArea = forwardRef<HTMLTextAreaElement, CustomTextAreaProps>(({
  value='',
  disabled,
  maxLength,
  onChange,
  width = 850,
  placeholder,
  required,
  isEdit,
  key
}, ref) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState(3);

  useEffect(() => {
    // Count the number of newline characters (\n)
    const newLineCount = (value.match(/\n/g) || []).length;  // Count occurrences of '\n'
    if (value.length > 250 || newLineCount >= 3) {
      setRows(6);
    } else {
      setRows(3);
    }
  }, [value]);  // Update rows when value changes

  return (
    <div className="flex flex-col">
      <Input.TextArea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        status={required ? 'error' : isEdit ? 'warning' : ''}
        onChange={onChange}
        className="md:w-[850px]"
        key={key}
      />
      {required && <span className="text-red-500 text-sm mt-1">{t('required')}</span>}
    </div>
  );
});

export default CustomTextArea;
