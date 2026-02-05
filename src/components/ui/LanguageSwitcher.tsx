import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en' as const, name: 'English', nativeName: 'English' },
    { code: 'ar' as const, name: 'Arabic', nativeName: 'العربية' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 rtl:space-x-reverse p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label={t('nav.language')}
      >
        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
          {language === 'ar' ? 'ع' : 'EN'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 end-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 min-w-[140px] z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-start text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${
                language === lang.code ? 'text-brand-gold font-medium' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{lang.nativeName}</span>
              {language === lang.code && (
                <span className="text-brand-gold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}