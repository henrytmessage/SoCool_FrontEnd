import React, { forwardRef } from 'react';
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
  required?: boolean;
  isEdit?: boolean;
}

const CustomTextArea = forwardRef<HTMLTextAreaElement, CustomTextAreaProps>(({
  value,
  disabled,
  maxLength,
  onChange,
  width = 850,
  placeholder,
  required,
  isEdit
}, ref) => {
  const { t } = useTranslation();
  const isMobile = window.innerWidth <= 768;
  const rows = value.length > 60 ? 4 : isMobile ? 2 : 4;

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
      />
      {required && <span className="text-red-500 text-sm mt-1">{t('required')}</span>}
    </div>
  );
});

export default CustomTextArea;
