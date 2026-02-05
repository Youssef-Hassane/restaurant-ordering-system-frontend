import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const cartItem = items.find(item => item.product.id === product.id);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Translate category
  const getCategoryTranslation = (category: string) => {
    const categoryKey = category.toLowerCase().replace(/\s+/g, '');
    const translationKey = `products.categories.${categoryKey}`;
    const translated = t(translationKey);
    // If translation not found, return original
    return translated === translationKey ? category : translated;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">🍽️</span>
          </div>
        )}
        
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {t('products.unavailable')}
            </span>
          </div>
        )}
        
        <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'}`}>
          <span className="bg-brand-gold text-white text-xs font-medium px-2 py-1 rounded-full">
            {getCategoryTranslation(product.category)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-brand-gold">
            {formatPrice(product.price, product.currency)}
          </span>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {cartItem && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ×{cartItem.quantity}
              </span>
            )}
            
            <Button
              onClick={handleAddToCart}
              disabled={!product.available}
              size="sm"
              variant={added ? 'secondary' : 'primary'}
              className="min-w-[100px]"
            >
              {added ? (
                <>
                  <Check className={`w-4 h-4 ${isRTL ? 'ms-1' : 'me-1'}`} />
                  {t('common.add')}
                </>
              ) : (
                <>
                  <Plus className={`w-4 h-4 ${isRTL ? 'ms-1' : 'me-1'}`} />
                  {t('common.add')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}