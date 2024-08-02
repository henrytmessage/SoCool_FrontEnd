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

const getRandomLinkSell = (arr: string[]) => {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const [randomNumber, setRandomNumber] = useState<number>(getRandomNumber())
  const [intervalTime, setIntervalTime] = useState<number>(20000)
  const [linkBuyer, setLinkBuyer] = useState('')

  useEffect(() => {
    const fetchDataLink = async () => {
      const data = await getLinkDemo()
      if (data.status_code === 200) {
        setLinkBuyer(getRandomLinkSell(data.data))

        // Set up interval to update linkBuyer every 30 seconds
        const linkUpdateInterval = setInterval(() => {
          setLinkBuyer(getRandomLinkSell(data.data))
        }, 30000)

        // Clear interval on component unmount
        return () => clearInterval(linkUpdateInterval)
      }
    }
    fetchDataLink()
  }, [])

  useEffect(() => {
    if (location.pathname === '/') {
      // Update random number at an interval
      const updateInterval = setInterval(() => {
        setRandomNumber(getRandomNumber())
      }, intervalTime)

      return () => clearInterval(updateInterval)
    }
  }, [intervalTime, location.pathname])

  useEffect(() => {
    if (location.pathname === '/') {
      let timerDuration = 30000
      const adjustInterval = () => {
        if (timerDuration === 30000) {
          timerDuration = 60000
        } else if (timerDuration === 60000) {
          timerDuration = 300000
        }
        setIntervalTime(timerDuration)
      }

      const timerInit = setTimeout(() => {
        adjustInterval()
        const timer = setInterval(() => {
          adjustInterval()
        }, 30000)

        return () => {
          clearInterval(timer)
          clearTimeout(timerInit)
        }
      }, 30000)

      return () => clearTimeout(timerInit)
    }
  }, [location.pathname])

  return (
    <div className="fixed w-full bg-[#F4F4F4] z-50 px-6 shadow-md ">
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
      {location.pathname === '/' && <div className="text-center">{t('haveSpawnedLink', { number: randomNumber })}, { linkBuyer }</div>}
      {location.pathname === '/chat' && <CustomCountUp />}
    </div>
  )
}

export default Header
