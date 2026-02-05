import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import type { Order } from '../types';
import { formatPrice } from '../utils/currency';
import Button from '../components/ui/Button';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;

  useEffect(() => {
    // Redirect to home if no order data
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Placed!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Thank you for your order. Your food will be ready soon!
          </p>

          {/* Order Number */}
          <div className="bg-brand-gold/10 rounded-xl p-4 mb-6">
            <p className="text-sm text-brand-gold font-medium mb-1">Order Number</p>
            <p className="text-3xl font-bold text-brand-gold">#{order.order_number}</p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-left space-y-3">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <User className="w-5 h-5 mr-3" />
              <span>{order.customer_name}</span>
            </div>
            
            {order.customer_email && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5 mr-3" />
                <span>{order.customer_email}</span>
              </div>
            )}
            
            {order.customer_phone && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="w-5 h-5 mr-3" />
                <span>{order.customer_phone}</span>
              </div>
            )}
            
            {order.notes && (
              <div className="flex items-start text-gray-600 dark:text-gray-400">
                <FileText className="w-5 h-5 mr-3 mt-0.5" />
                <span>{order.notes}</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-5 h-5 mr-3" />
              <span>Status: <span className="capitalize font-medium text-yellow-600">{order.status}</span></span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center py-4 border-t dark:border-gray-700">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Amount</span>
            <span className="text-2xl font-bold text-brand-gold">
              {formatPrice(order.total_amount, order.currency)}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Link to="/" className="block">
              <Button className="w-full" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Ordering
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}