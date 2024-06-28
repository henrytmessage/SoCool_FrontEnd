// file: src/components/Alert.tsx
import React, { useState, useEffect } from 'react';
import { Alert } from 'antd';

interface CustomAlertProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  isShowAlert?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type = 'info', isShowAlert }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isShowAlert) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 5000); 
    }
  }, [isShowAlert]);

  return (
    <div className="fixed top-0 right-0 m-4">
      {visible && (
        <Alert
          message={message}
          type={type}
          showIcon
          onClose={() => setVisible(false)}
          closable
        />
      )}
    </div>
  );
};

export default CustomAlert;
