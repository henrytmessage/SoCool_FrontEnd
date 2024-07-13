import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import CustomCountUp from '../common/CustomCountDown'
import { Avatar } from 'antd'
import { logoSoCool } from '../assets'

const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <div className="fixed w-full bg-[#F4F4F4] z-50 px-6 shadow-md ">
      <div className="flex items-center justify-center gap-4">
        <Avatar src={<img src={logoSoCool} alt="avatar" />} className="sm:size-14 size-10" />

        <h3 className="bg-[#03A3B3] text-transparent bg-clip-text text-center py-3 font-bold text-2xl sm:text-6xl">
          {t('soCool')}
        </h3>
      </div>

      {location.pathname === '/chat' && <CustomCountUp />}
    </div>
  )
}

export default Header
