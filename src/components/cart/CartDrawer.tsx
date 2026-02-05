import { useEffect, useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import OrderForm from '../orders/OrderForm';
import Button from '../ui/Button';

export default function CartDrawer() {
  const { isOpen, closeCart, items, clearCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setShowOrderForm(false);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className={`absolute top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col animate-slide-in-right ${isRTL ? 'left-0' : 'right-0'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <ShoppingBag className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-semibold">{t('cart.title')}</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">{t('cart.empty')}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {t('cart.emptySubtitle')}
              </p>
            </div>
          ) : showOrderForm ? (
            <OrderForm onCancel={() => setShowOrderForm(false)} />
          ) : (
            <div className="divide-y dark:divide-gray-800">
              {items.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {items.length > 0 && !showOrderForm && (
          <div className="p-4 border-t dark:border-gray-800">
            <CartSummary />
            
            <div className="mt-4 space-y-2">
              <Button
                onClick={() => setShowOrderForm(true)}
                className="w-full"
                size="lg"
              >
                {t('cart.checkout')}
              </Button>
              
              <Button
                onClick={clearCart}
                variant="ghost"
                className="w-full text-red-500 hover:text-red-600"
              >
                {t('cart.clearCart')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}