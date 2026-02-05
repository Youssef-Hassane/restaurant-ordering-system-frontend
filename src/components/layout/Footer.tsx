import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <footer className={`border-t ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4 md:mb-0">
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isRTL ? (
                <>أوردر<span className="text-brand-gold">كينج</span></>
              ) : (
                <>ORDER<span className="text-brand-gold">KING</span></>
              )}
            </span>
          </div>
          
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}