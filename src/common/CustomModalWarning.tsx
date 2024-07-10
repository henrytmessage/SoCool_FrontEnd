import { Modal, Result } from 'antd'
import Button from './CustomButton'

interface IModalSuccessProps {
  isOpen?: boolean
  titleWarning?: string
  textButtonConfirm?: string
  status?: 'success' | 'error' | 'info' | 'warning'
  onCloseModalWarning: () => void
}

const CustomModalWarning: React.FC<IModalSuccessProps> = ({
  isOpen,
  titleWarning,
  textButtonConfirm,
  status = 'warning',
  onCloseModalWarning
}) => {

  const handleCancel = () => {
    onCloseModalWarning()
  }

  return (
    <Modal open={isOpen} style={{ minWidth: '40%' }} footer={null} onCancel={handleCancel} className={'w-4/5 md:w-3/5'}>
      <Result
        status={status}
        title={titleWarning}
        extra={[
          <Button key={textButtonConfirm} onClick={handleCancel}>
            {textButtonConfirm}
          </Button>
        ]}
      />
    </Modal>
  )
}

export default CustomModalWarning
