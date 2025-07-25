import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../components/utils/translations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { showToast } from '../components/common/ErrorBoundary';

export default function LanguageSettings() {
  const navigate = useNavigate();
  const { t, currentLanguage, setLanguage } = useTranslation();

  const languages = [
    { code: 'en', name: t('english'), nativeName: 'English', flag: '🇺🇸' },
    { code: 'he', name: t('hebrew'), nativeName: 'עברית', flag: '🇮🇱' },
    { code: 'ar', name: t('arabic'), nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: t('french'), nativeName: 'Français', flag: '🇫🇷' },
    { code: 'es', name: t('spanish'), nativeName: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: t('portuguese'), nativeName: 'Português', flag: '🇧🇷' }
  ];

  const handleLanguageChange = (langCode) => {
    const lang = languages.find(l => l.code === langCode);
    setLanguage(langCode);
    showToast(`${t('appLanguage')} ${t('changedTo')} ${lang.name}`, 'success');
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${currentLanguage === 'ar' || currentLanguage === 'he' ? 'rtl' : 'ltr'}`}>
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{t('appLanguage')}</h1>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="bg-white rounded-xl shadow-sm">
          {languages.map((language, index) => (
            <div key={language.code}>
              <button
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors ${
                  currentLanguage === language.code ? 'bg-red-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div className="text-left rtl:text-right">
                    <p className="font-medium text-gray-900">{language.name}</p>
                    <p className="text-sm text-gray-600">{language.nativeName}</p>
                  </div>
                </div>
                {currentLanguage === language.code && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
              {index < languages.length - 1 && <div className="border-b border-gray-100 mx-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}