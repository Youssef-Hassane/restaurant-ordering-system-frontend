import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../hooks/useToast';
import { ordersApi } from '../../api/orders';
import { formatPrice } from '../../utils/currency';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface OrderFormProps {
  onCancel: () => void;
}

interface FormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
}

interface FormErrors {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
}

export default function OrderForm({ onCancel }: OrderFormProps) {
  const navigate = useNavigate();
  const { items, total, currency, clearCart, closeCart } = useCart();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    } else if (formData.customer_name.trim().length < 2) {
      newErrors.customer_name = 'Name must be at least 2 characters';
    }
    
    if (formData.customer_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customer_email)) {
        newErrors.customer_email = 'Invalid email format';
      }
    }
    
    if (formData.customer_phone) {
      const phoneRegex = /^[\d\s\-+()]{7,20}$/;
      if (!phoneRegex.test(formData.customer_phone)) {
        newErrors.customer_phone = 'Invalid phone number format';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim() || undefined,
        customer_phone: formData.customer_phone.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };
      
      const order = await ordersApi.create(orderData);
      
      showToast('success', `Order #${order.order_number} placed successfully!`);
      clearCart();
      closeCart();
      navigate('/order-success', { state: { order } });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to place order. Please try again.';
      showToast('error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onCancel}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Cart
      </button>
      
      <h3 className="text-lg font-semibold">Customer Information</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name *"
          name="customer_name"
          value={formData.customer_name}
          onChange={handleChange}
          placeholder="Enter your name"
          error={errors.customer_name}
          disabled={isSubmitting}
        />
        
        <Input
          label="Email (optional)"
          name="customer_email"
          type="email"
          value={formData.customer_email}
          onChange={handleChange}
          placeholder="email@example.com"
          error={errors.customer_email}
          disabled={isSubmitting}
        />
        
        <Input
          label="Phone (optional)"
          name="customer_phone"
          type="tel"
          value={formData.customer_phone}
          onChange={handleChange}
          placeholder="+20 123 456 7890"
          error={errors.customer_phone}
          disabled={isSubmitting}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special instructions..."
            rows={3}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all resize-none"
          />
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
          <h4 className="font-medium mb-2">Order Summary</h4>
          <div className="space-y-1 text-sm">
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.product.price * item.quantity, item.product.currency)}</span>
              </div>
            ))}
          </div>
          <div className="border-t dark:border-gray-700 mt-2 pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-brand-gold">{formatPrice(total, currency)}</span>
          </div>
        </div>
        
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
          size="lg"
        >
          <Send className="w-4 h-4 mr-2" />
          Place Order
        </Button>
      </form>
    </div>
  );
}