import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ENTranslate from './language/EN-translate.json'
import VNTranslate from './language/VN-translate.json'

// Translations
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: ENTranslate },
    vn: { translation: VNTranslate }
  },
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language
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
      const response = await fetch(`https://ip-api.com/json/${ip}`)
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
