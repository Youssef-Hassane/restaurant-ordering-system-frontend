import apiClient from './client';
import type { ApiResponse, Order, OrderWithItems, CreateOrderRequest, OrderStatus } from '../types';

export const ordersApi = {
  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data!;
  },

  getAll: async (status?: OrderStatus): Promise<Order[]> => {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get<ApiResponse<Order[]>>(`/orders${params}`);
    return response.data.data || [];
  },

  getById: async (id: string): Promise<OrderWithItems> => {
    const response = await apiClient.get<ApiResponse<OrderWithItems>>(`/orders/${id}`);
    return response.data.data!;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/orders/${id}`);
  }
};