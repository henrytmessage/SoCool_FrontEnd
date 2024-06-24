// file: src/components/Alert.tsx
import React, { useState, useEffect } from 'react';
import { Alert } from 'antd';

interface CustomAlertProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  isShowAlert?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type = 'info', isShowAlert }) => {
  const [visible, setVisible] = useState(false); // Initialize as hidden initially

  const showAlert = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 3000); // Auto hide after 3 seconds
  };

  return (
    <div className="fixed top-0 right-0 m-4"> 
      { isShowAlert && <Alert
        message={message}
        type={type}
        showIcon
        onClose={() => setVisible(false)}
        closable
      />
    }
    </div>

  );
};

export default CustomAlert;
