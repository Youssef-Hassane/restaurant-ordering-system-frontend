import { useState, useEffect } from 'react';
import { Search, Eye, ChevronDown, Clock, CheckCircle, XCircle, ChefHat, Package, Trash2, AlertTriangle } from 'lucide-react';
import { Order, OrderStatus, OrderWithItems } from '../types';
import { ordersApi } from '../api/orders';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import { formatPrice } from '../utils/currency';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Clock className="w-4 h-4" /> },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: <CheckCircle className="w-4 h-4" /> },
  preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: <ChefHat className="w-4 h-4" /> },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: <Package className="w-4 h-4" /> },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: <XCircle className="w-4 h-4" /> }
};

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Role-based permissions
  const canDeleteOrders = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersApi.getAll(statusFilter || undefined);
      setOrders(data);
    } catch (error) {
      showToast('error', 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    return (
      order.customer_name.toLowerCase().includes(query) ||
      order.order_number.toString().includes(query) ||
      order.customer_email?.toLowerCase().includes(query) ||
      order.customer_phone?.includes(query)
    );
  });

  const viewOrderDetails = async (orderId: string) => {
    setIsLoadingDetail(true);
    setIsDetailModalOpen(true);
    try {
      const order = await ordersApi.getById(orderId);
      setSelectedOrder(order);
    } catch (error) {
      showToast('error', 'Failed to load order details');
      setIsDetailModalOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      showToast('success', `Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error: any) {
      showToast('error', error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await ordersApi.delete(orderId);
      showToast('success', 'Order deleted successfully');
      setDeleteConfirm(null);
      fetchOrders();
    } catch (error: any) {
      showToast('error', error.response?.data?.error || 'Failed to delete order');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all customer orders
          <span className="ml-2 text-sm text-brand-gold capitalize">
            ({user?.role})
          </span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, order #, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{STATUS_CONFIG[status].label}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Pending</div>
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            {orders.filter(o => o.status === 'pending').length}
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Preparing</div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {orders.filter(o => o.status === 'preparing').length}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">Ready</div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {orders.filter(o => o.status === 'ready').length}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed Today</div>
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {orders.filter(o => {
              const today = new Date().toDateString();
              const orderDate = new Date(o.created_at).toDateString();
              return o.status === 'completed' && today === orderDate;
            }).length}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-brand-gold">#{order.order_number}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{order.customer_name}</div>
                      {order.customer_phone && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer_phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatPrice(order.total_amount, order.currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        disabled={order.status === 'completed' || order.status === 'cancelled'}
                        className={`appearance-none pr-8 pl-3 py-1 text-xs font-medium rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold ${STATUS_CONFIG[order.status].color} ${
                          order.status === 'completed' || order.status === 'cancelled' ? 'cursor-not-allowed opacity-75' : ''
                        }`}
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>{STATUS_CONFIG[status].label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order.id)}
                        className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canDeleteOrders && (order.status === 'pending' || order.status === 'cancelled') && (
                        <button
                          onClick={() => setDeleteConfirm(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        title={selectedOrder ? `Order #${selectedOrder.order_number}` : 'Order Details'}
      >
        {isLoadingDetail ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : selectedOrder ? (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-2 ${STATUS_CONFIG[selectedOrder.status].color}`}>
                {STATUS_CONFIG[selectedOrder.status].icon}
                {STATUS_CONFIG[selectedOrder.status].label}
              </span>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Customer Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <span className="text-gray-900 dark:text-white">{selectedOrder.customer_name}</span>
                
                {selectedOrder.customer_email && (
                  <>
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="text-gray-900 dark:text-white">{selectedOrder.customer_email}</span>
                  </>
                )}
                
                {selectedOrder.customer_phone && (
                  <>
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="text-gray-900 dark:text-white">{selectedOrder.customer_phone}</span>
                  </>
                )}
                
                <span className="text-gray-500 dark:text-gray-400">Date:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(selectedOrder.created_at)}</span>
              </div>
              
              {selectedOrder.notes && (
                <div className="pt-2 border-t dark:border-gray-600">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Notes: </span>
                  <span className="text-gray-900 dark:text-white text-sm">{selectedOrder.notes}</span>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-0">
                    <div>
                      <span className="text-gray-900 dark:text-white">{item.product_name}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">× {item.quantity}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.total_price, item.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
              <span className="text-2xl font-bold text-brand-gold">
                {formatPrice(selectedOrder.total_amount, selectedOrder.currency)}
              </span>
            </div>

            {/* Actions */}
            {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="danger"
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'cancelled');
                    setIsDetailModalOpen(false);
                  }}
                >
                  Cancel Order
                </Button>
                {selectedOrder.status === 'ready' && (
                  <Button
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'completed');
                      setIsDetailModalOpen(false);
                    }}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : null}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Order"
      >
        <div className="flex items-start space-x-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this order? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => deleteConfirm && handleDeleteOrder(deleteConfirm)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}