import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, User, Menu, X, Package, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { isRTL } = useLanguage();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const canManageProducts = user?.role === 'admin' || user?.role === 'manager';
  const canManageOrders = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'cashier';

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 border-b ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">

            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isRTL ? (
                <>أوردر<span className="text-brand-gold">كينج</span></>
              ) : (
                <>ORDER<span className="text-brand-gold">KING</span></>
              )}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {isAuthenticated && canManageProducts && (
              <Link
                to="/admin/products"
                className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/admin/products'
                    ? 'bg-brand-gold text-white'
                    : isDark 
                      ? 'text-gray-400 hover:bg-gray-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="text-sm">{t('nav.products')}</span>
              </Link>
            )}

            {isAuthenticated && canManageOrders && (
              <Link
                to="/admin/orders"
                className={`flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/admin/orders'
                    ? 'bg-brand-gold text-white'
                    : isDark 
                      ? 'text-gray-400 hover:bg-gray-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span className="text-sm">{t('nav.orders')}</span>
              </Link>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              aria-label={isDark ? t('nav.lightMode') : t('nav.darkMode')}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {user?.name}
                    </span>
                    <span className={`text-xs capitalize ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-1 rtl:space-x-reverse ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <User className="w-5 h-5" />
                <span className="text-sm">{t('nav.login')}</span>
              </Link>
            )}

            <button
              onClick={openCart}
              className={`relative p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              aria-label={t('cart.title')}
            >
              <ShoppingCart className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -end-1 bg-brand-gold text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2 rtl:space-x-reverse">
            <LanguageSwitcher />
            <button onClick={openCart} className="relative p-2">
              <ShoppingCart className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -end-1 bg-brand-gold text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex flex-col space-y-3">
              {isAuthenticated && canManageProducts && (
                <Link
                  to="/admin/products"
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-2 py-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Package className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('nav.products')}</span>
                </Link>
              )}
              
              {isAuthenticated && canManageOrders && (
                <Link
                  to="/admin/orders"
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-2 py-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ClipboardList className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('nav.orders')}</span>
                </Link>
              )}
              
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-2 py-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {isDark ? t('nav.lightMode') : t('nav.darkMode')}
                </span>
              </button>
              
              {isAuthenticated ? (
                <>
                  <div className={`px-2 py-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</span>
                    <span className="ms-1 text-xs capitalize">({user?.role})</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2 py-2 text-start rounded-lg ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-2 py-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t('nav.login')}</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}