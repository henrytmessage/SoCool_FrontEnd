import React from 'react';

import { Button as ButtonAnt } from 'antd';

interface CustomButtonProps {
  onClick?: () => void; 
  children?: React.ReactNode; 
  classNameCustom?: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  size?: 'large' | 'middle' | 'small';
  htmlType?: "button" | "reset" | "submit" | undefined;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children, classNameCustom, type="primary", size='large', htmlType, loading }) => {
  return (
    <ButtonAnt
      onClick={onClick}
      type={type}
      size={size}
      htmlType={htmlType}
      loading={loading}
      className={`px-4 py-2 rounded transition-colors duration-300 ${classNameCustom}`}
    >
      {children}
    </ButtonAnt>
  );
};

export default CustomButton;
