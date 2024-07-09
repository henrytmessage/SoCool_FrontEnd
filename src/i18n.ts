// src/i18n.ts

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ENTranslate from './language/EN-translate.json'
import VNTranslate from './language/VN-translate.json'
import { checkLocationInVietnam } from './function'

// Translations
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: ENTranslate },
    vn: { translation: VNTranslate }
  },
  lng: 'en', // Ngôn ngữ mặc định
  fallbackLng: 'en', // Ngôn ngữ dự phòng
  interpolation: { escapeValue: false }
})

const storedLanguage = localStorage.getItem('language')

if (storedLanguage) {
  i18n.changeLanguage(storedLanguage)
} else if (navigator.geolocation) {
  const fetchIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      fetchLocation(data.ip)
    } catch (error) {
      console.error('Error fetching IP:', error)
    }
  }

  const fetchLocation = async (ip: string) => {
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`)
      const data = await response.json()
      if (data.countryCode === 'VN') {
        i18n.changeLanguage('vn')
        localStorage.setItem('language', 'vn')
      } else {
        i18n.changeLanguage('en')
        localStorage.setItem('language', 'en')
      }
    } catch (error) {
      console.error('Error fetching location:', error)
    }
  }

  fetchIp()
} else {
  console.log('Geolocation is not supported by this browser.')
}

export default i18n
