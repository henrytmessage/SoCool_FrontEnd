import React, { ReactNode } from 'react';
import { Modal } from 'antd';
import Button from './CustomButton';

interface ModalComponentProps {
    title?: string;
    open?: boolean;
    children: ReactNode;
    textButtonEdit?: string;
    textButtonOK?: string;
    onClose: () => void;
    onOK: () => void;
}

const CustomModal: React.FC<ModalComponentProps> = ({ title, children, open = false, textButtonEdit, textButtonOK,  onClose, onOK }) => {

    const handleCancel = () => {
      onClose();
    };

    const handleOK = () => {
      onOK();
    }

    return (
        <Modal
            title={title}
            open={open}
            onOk={handleOK}
            onCancel={handleCancel}
            style={{ minWidth: '40%' }}
            className={'w-4/5 md:w-3/5'} 
            footer={[
              <Button key="back" onClick={handleCancel} classNameCustom="outline outline-0 bg-gray-200 text-gray-800 hover:bg-gray-300">
                {textButtonEdit}
              </Button>,
              <Button key="submit" onClick={handleOK} classNameCustom="text-gray-800 ml-6">
                {textButtonOK}
              </Button>
            ]}
        >
            {children}
        </Modal>
    );
};

export default CustomModal;
