import { Modal, Result } from 'antd'
import Button from './CustomButton'

interface IModalSuccessProps {
  isOpen?: boolean
  titleWarning?: string
  textButtonConfirm?: string
  content?: string
  status?: 'success' | 'error' | 'info' | 'warning'
  onCloseModalWarning: () => void
  onConfirmModalWarning?: () => void
}

const CustomModalWarning: React.FC<IModalSuccessProps> = ({
  isOpen,
  titleWarning,
  textButtonConfirm,
  content,
  status = 'warning',
  onCloseModalWarning,
  onConfirmModalWarning
}) => {

  const handleCancel = () => {
    onCloseModalWarning()
  }

  const handleConfirm= () => {
    onConfirmModalWarning && onConfirmModalWarning()
  }

  return (
    <Modal open={isOpen} style={{ minWidth: '37%' }} footer={null} onCancel={handleCancel} className={'w-4/5 md:w-3/5'}>
      <Result
        icon={null}
        status={status}
        title={
          <div className='text-lg text-left'>
            <div>{titleWarning}</div>
            <div>{content}</div>
          </div>
        }
        extra={[
          <div className='flex justify-around' key={textButtonConfirm}>
          <Button type="default" key={titleWarning} onClick={handleCancel}>
            Cancel
          </Button>
          <Button key={textButtonConfirm} onClick={handleConfirm}>
            {textButtonConfirm}
          </Button>
          </div>
        ]}
        
      />
      
    </Modal>
  )
}

export default CustomModalWarning
