import { Button } from 'antd';
import { useState } from 'react';

const statusColors = {
  isSelected: { backgroundColor: '#03A3B3', color: '#fff' },
  normal: { backgroundColor: '#fff', color: '#000' },
};
interface StatusButtonProps {
  children: React.ReactNode;  
  classNameCustom?: string;  
  onClick?: () => void; 
  status:string
}

const StatusButton:React.FC<StatusButtonProps> = ({ onClick , classNameCustom , children, status}) => {

  return (
    <Button
      style={statusColors[status as keyof typeof statusColors]} 
      onClick={onClick} 
      className={`${classNameCustom}`}
    >
      {children}
    </Button>
  );
};

export default StatusButton;
