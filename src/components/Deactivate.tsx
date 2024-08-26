import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SmileOutlined } from '@ant-design/icons'
import { message, Result } from 'antd'
import { CustomButton } from '../common'
import { postServiceLinkAnswer, postServiceLinkDeactivate } from '../service'
import { useNavigate } from 'react-router-dom'

const Deactivate = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [textTitleLink, setTextTitleLink] = useState('')
  const urlParams = new URLSearchParams(window.location.search)

  const handleBackToHome = () => {
    navigate('/')
  }

  useEffect(() => {
    const fetchDataDeactivate = async () => {
      const language = urlParams.get('language')
      const id = urlParams.get('id')
      const answer = urlParams.get('answer')

      if (language) {
        i18n.changeLanguage(language)
      }

      try {
        if (id && answer) {
          const bodyLinkAnswer = { id, answer }
          const response = await postServiceLinkAnswer(bodyLinkAnswer)
          if (response.status_code === 200) {
            setTextTitleLink(t('deletedLinkTitle'))
          } else {
            setTextTitleLink(t('tryAgain'))
          }
        } else if (id && !answer) {
          const response = await postServiceLinkDeactivate(id)
          if (response.status_code === 200) {
            setTextTitleLink(t('thanksSharing'))
          } else {
            setTextTitleLink(t('tryAgain'))
          }
        }
      } catch (error) {
        message.error('Failed to deactivate link.')
        console.error(error)
      }
    }

    fetchDataDeactivate()
  }, [i18n])

  return (
    <Result
      icon={<SmileOutlined />}
      title={textTitleLink}
      extra={
        <CustomButton type="primary" onClick={handleBackToHome}>
          {t('backToHome')}
        </CustomButton>
      }
    />
  )
}

export default Deactivate
