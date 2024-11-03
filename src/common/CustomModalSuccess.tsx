import { Modal, Result } from 'antd'
import Button from './CustomButton'
import { useTranslation } from 'react-i18next'

interface IModalSuccessProps {
  linkAi?: string
  isOpen?: boolean
  titleSuccess?: string
  textButtonConfirm?: string
  status?: 'success' | 'error' | 'info' | 'warning'
  onCloseModalSuccess: () => void
  textChildren?: string,
  textBottom?: string
}

const CustomModalSuccess: React.FC<IModalSuccessProps> = ({
  linkAi,
  isOpen,
  titleSuccess,
  textButtonConfirm,
  status = 'success',
  onCloseModalSuccess,
  textChildren,
  textBottom
}) => {
  const { t } = useTranslation()

  const handleCancel = () => {
    onCloseModalSuccess()
  }

  return (
    <Modal
      open={isOpen}
      style={{ minWidth: '40%' }}
      footer={null}
      onCancel={handleCancel}
      className={'w-4/5 md:w-3/5 '}
    >
      <Result
        className="py-2"
        status={status}
        title={ <span className="text-xl text-black font-semibold">
          {t('hereLinkAi')}{' '}
          <div className="my-2 text-xl text-[#1677ff]">
            ✨ {linkAi} ✨
          </div>
        </span>}
        subTitle={
          <>
            <div className=" text-base">{titleSuccess}</div>
            <div className=" text-base">{textChildren}</div>
            <div className=" text-base">This is the hiring page related to your job: <a href='dashboard'>{textBottom}</a>. You can check the details in your account dashboard.</div>
          </>
        }
        extra={[
          <>
            <Button key={textButtonConfirm} onClick={handleCancel}>
              {textButtonConfirm}
            </Button>
            {/* <div className='mt-4'>
              {t('hereLinkDemo')}{' '}
              <a
                href="https://www.youtube.com/watch?v=dMEWQaTTWyA"
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-[#1677ff] underline decoration-1"
              >
                ✨ Demo ✨
              </a>
            </div> */}
          </>
        ]}
      />
    </Modal>
  )
}

export default CustomModalSuccess
