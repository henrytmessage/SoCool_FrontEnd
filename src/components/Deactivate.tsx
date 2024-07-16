import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomButton } from '../common'
import { SmileOutlined } from '@ant-design/icons'
import { Result } from 'antd'

const Deactivate = () => {
  const { t, i18n } = useTranslation()
  const urlParams = new URLSearchParams(window.location.search);
  
  useEffect(() => {
    const language = urlParams.get('lang');
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [i18n]);

  return (
    <Result
      icon={<SmileOutlined />}
      title={t('deletedLinkTitle')}
      extra={<CustomButton type="primary">{t('backToHome')}</CustomButton>}
    />
  )
}

export default Deactivate
