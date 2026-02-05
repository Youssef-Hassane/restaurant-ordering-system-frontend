import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';

export default function CartSummary() {
  const { total, currency, itemCount } = useCart();

  return (
    <div className="border-t dark:border-gray-700 pt-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600 dark:text-gray-400">Items</span>
        <span className="font-medium">{itemCount}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold text-brand-gold">
          {formatPrice(total, currency)}
        </span>
      </div>
    </div>
  );
}