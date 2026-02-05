import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../utils/currency';
import { useCart } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate">
          {product.name}
        </h4>
        <p className="text-sm text-brand-gold font-semibold">
          {formatPrice(product.price, product.currency)}
        </p>
        
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-8 text-center font-medium">{quantity}</span>
          
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => removeItem(product.id)}
            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded ml-auto transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="text-right flex-shrink-0">
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatPrice(product.price * quantity, product.currency)}
        </span>
      </div>
    </div>
  );
}