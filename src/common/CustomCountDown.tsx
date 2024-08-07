import React, { useEffect, useState } from 'react'
import { Alert } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ClockCircleOutlined } from '@ant-design/icons'
import CustomModalWarning from './CustomModalWarning'

const CustomCountUp: React.FC = () => {
  const { t } = useTranslation()

  const maxTime = 15 * 60 // 15 minutes in seconds
  const alertTime = 14 * 60 // 14 minutes in seconds
  const [seconds, setSeconds] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [showFinalText, setShowFinalText] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const startTime = sessionStorage.getItem('startTime')

    if (!startTime) {
      sessionStorage.setItem('startTime', Date.now().toString())
    }

    const interval = setInterval(() => {
      const startTime = parseInt(sessionStorage.getItem('startTime') || '0', 10)
      const currentTime = Date.now()
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000)

      setSeconds(elapsedSeconds)

      if (elapsedSeconds >= alertTime && elapsedSeconds < alertTime + 5) {
        setShowAlert(true)
      } else {
        setShowAlert(false)
      }

      if (elapsedSeconds >= maxTime) {
        setShowFinalText(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [alertTime, maxTime, navigate])

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60)
    const remainingSeconds = secs % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const onClickModalWarning = () => {
    sessionStorage.removeItem('startTime')
    navigate('/')
  }

  return (
    <div
      className={`absolute top-0 right-0 py-3 sm:py-6 px-6 text-right  ${
        seconds >= alertTime ? 'text-red-500' : 'text-[#0D0D0D]'
      } text-2xl sm:text-4xl`}
    >
      <div className="flex gap-2 justify-end">
        <ClockCircleOutlined />
        <div>{formatTime(seconds)}</div>
      </div>
      {showAlert && (
        <div>
          <Alert message={t('oneMinute')} type="warning" showIcon className="mt-4" />
        </div>
      )}
      {showFinalText && (
        <CustomModalWarning
          isOpen={showFinalText}
          onCloseModalWarning={onClickModalWarning}
          titleWarning={t('continueExperience')}
          textButtonConfirm={t('confirm')}
        />
      )}
    </div>
  )
}

export default CustomCountUp
