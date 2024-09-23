import React, { useEffect, useState } from 'react';

import { Button as ButtonAnt } from 'antd';

interface CustomButtonBorderProps {
  onClick?: () => void; 
  children?: React.ReactNode; 
  classNameCustom?: string;
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  size?: 'large' | 'middle' | 'small';
  htmlType?: "button" | "reset" | "submit" | undefined;
  loading?: boolean;
}

const CustomButtonBorder: React.FC<CustomButtonBorderProps> = ({ onClick, children, classNameCustom, type="primary", size='large', htmlType, loading }) => {
  const [buttonSize, setButtonSize] = useState(size);

  const updateSize = () => {
    if (window.innerWidth <= 768) {
      setButtonSize('middle'); // Kích thước màn hình nhỏ hơn 768px => dùng size 'middle'
    } else {
      setButtonSize(size); // Dùng size mặc định được truyền vào
    }
  };

  useEffect(() => {
    // Lần đầu render hoặc khi kích thước thay đổi, sẽ cập nhật size
    updateSize();

    // Lắng nghe sự kiện resize để thay đổi kích thước button theo màn hình
    window.addEventListener('resize', updateSize);

    // Cleanup listener khi component bị unmount
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [size]);

  return (
    <ButtonAnt
      onClick={onClick}
      type={type}
      size={buttonSize}
      htmlType={htmlType}
      loading={loading}
      className={`px-4 py-2 rounded border-1 border-[#03A3B3] text-[#03A3B3] bg-[#FFFFFF] hover:bg-black duration-300 ${classNameCustom}`}
    >
      {children}
    </ButtonAnt>
  );
};

export default CustomButtonBorder;
