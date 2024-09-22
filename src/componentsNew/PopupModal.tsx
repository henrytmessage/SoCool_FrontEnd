import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';

interface ModalProps {
  isVisible: boolean;
  loading: boolean,
  hideModal: () => void;
  confirm: () => void;
  title:string
}

const PopupModal: React.FC<ModalProps > = ({ isVisible,loading, hideModal, confirm, title }) => {

  return (
    <>
      <Modal
        title = {title}
        visible = { isVisible }
        onOk={confirm}
        
        onCancel={hideModal}
        footer={[
          <Button
            key="back"
            onClick={hideModal}
          >
            Cancel
          </Button>,
          <Button key="submit" onClick={confirm} loading = {loading} >
            Confirm
          </Button>
        ]}
      >
        <p></p>
      </Modal>
    </>
  );
};

export default PopupModal;
