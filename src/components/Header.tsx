import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import CustomCountUp from '../common/CustomCountDown'
import { Avatar } from 'antd'
import { logoSoCool } from '../assets'
import { getLinkDemo } from '../service'

const getRandomNumber = (): number => {
  return Math.floor(Math.random() * (100 - 10 + 1)) + 10
}

const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const [randomNumber, setRandomNumber] = useState<number>(getRandomNumber())

  useEffect(() => {
    if (location.pathname === '/') {
      // Update random number every minute
      const updateInterval = setInterval(() => {
        setRandomNumber(getRandomNumber())
      }, 60000)

      return () => clearInterval(updateInterval)
    }
  }, [location.pathname])

  return (
    <div className="fixed w-full bg-[#F4F4F4] z-50 px-6 shadow-md">
      <div className="flex items-center justify-center gap-4">
        <a href="/">
          <Avatar src={<img src={logoSoCool} alt="avatar" />} className="sm:size-14 size-10" />
        </a>
        <a href="/">
          <h3 className="bg-[#03A3B3] text-transparent bg-clip-text text-center py-3 font-bold text-2xl sm:text-6xl">
            {t('soCool')}
          </h3>
        </a>
      </div>
      {/* {location.pathname === '/' && (
        <div className="text-center md:flex justify-center">
          <div className="mr-2">{t('haveSpawnedLink', { number: randomNumber })}</div>
        </div>
      )} */}
      {/* {location.pathname === '/chat' && <CustomCountUp />} */}
    </div>
  )
}

export default Header
