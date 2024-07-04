import { Modal, Result } from 'antd'
import Button from './CustomButton'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IModalSuccessProps {
  isOpen?: boolean
  titleSuccess?: string
  textButtonConfirm?: string
  status?: 'success' | 'error' | 'info' | 'warning'
  onCloseModalSuccess: () => void
}

const CustomModalSuccess: React.FC<IModalSuccessProps> = ({
  isOpen,
  titleSuccess,
  textButtonConfirm,
  status = 'success',
  onCloseModalSuccess
}) => {
  const { t } = useTranslation()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isOpen && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      // Thực hiện hàm khi đếm ngược kết thúc
      handleCountdownEnd()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isOpen, countdown])

  const handleCountdownEnd = () => {
    onCloseModalSuccess()
  }

  const handleCancel = () => {
    onCloseModalSuccess()
  }

  return (
    <Modal open={isOpen} style={{ minWidth: '40%' }} footer={null} onCancel={handleCancel} className={'w-4/5 md:w-3/5'}>
      <Result
        status={status}
        title={titleSuccess}
        subTitle={`${t('time')} ${countdown}`}
        extra={[
          <Button key={textButtonConfirm} onClick={handleCancel}>
            {textButtonConfirm}
          </Button>
        ]}
      />
    </Modal>
  )
}

export default CustomModalSuccess
