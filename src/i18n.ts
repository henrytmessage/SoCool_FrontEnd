// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ENTranslate from "./language/EN-translate.json";
import VNTranslate from "./language/VN-translate.json";

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

export default i18n;
