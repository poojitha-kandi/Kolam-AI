import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        regionalStyles: 'Regional Styles',
        learningMode: 'Learning Mode',
        dailyChallenge: 'Daily Challenge',
        customizer: 'Customizer',
        community: 'Community'
      },
      home: {
        title: 'Kolam AI - Pattern Recreation',
        subtitle: 'Upload a Kolam image to see your beautiful traditional design',
        upload: 'Upload Your Kolam',
        recreate: 'Recreate Kolam',
        processing: 'Processing...'
      },
      regionalStyles: {
        title: 'Regional Kolam Styles'
      },
      learningMode: {
        title: 'Step-by-Step Kolam Learning'
      },
      dailyChallenge: {
        title: 'Daily Kolam Challenge'
      },
      customizer: {
        title: 'Smart Kolam Customizer'
      },
      community: {
        title: 'Kolam Community'
      }
    }
  },
  ta: {
    translation: {
      nav: {
        home: 'முகப்பு',
        regionalStyles: 'பிராந்திய பாணிகள்',
        learningMode: 'கற்றல் முறை',
        dailyChallenge: 'தினசரி சவால்',
        customizer: 'தனிப்பயனாக்கல்',
        community: 'சமூகம்'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;