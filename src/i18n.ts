// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ENTranslate from "./language/EN-translate.json";
import VNTranslate from "./language/VN-translate.json";
import { checkLocationInVietnam } from './function';

// Translations
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: ENTranslate },
    vn: { translation: VNTranslate },
  },
  lng: "en", // Ngôn ngữ mặc định
  fallbackLng: "en", // Ngôn ngữ dự phòng
  interpolation: { escapeValue: false },
});

const storedLanguage = localStorage.getItem('language');

if (storedLanguage) {
  i18n.changeLanguage(storedLanguage);
} else if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      if (checkLocationInVietnam(lat, lng)) {
        i18n.changeLanguage('vn'); 
        localStorage.setItem('language', 'vn')
      } else {
        i18n.changeLanguage('en');
        localStorage.setItem('language', 'en')
      }
    },
    (err) => {
      console.log("err", err);
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}


export default i18n;
