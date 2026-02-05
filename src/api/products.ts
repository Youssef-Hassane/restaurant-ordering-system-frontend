import apiClient from './client';
import type { ApiResponse, Product, CreateProductRequest } from '../types';

export interface ProductFilters {
  category?: string;
  available?: boolean;
  search?: string;
  currency?: string;
}

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.available !== undefined) params.append('available', String(filters.available));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.currency) params.append('currency', filters.currency);
    
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products?${params.toString()}`);
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<ApiResponse<string[]>>('/products/categories');
    return response.data.data || [];
  },

  getCurrencies: async (): Promise<{ code: string; symbol: string; isDefault: boolean }[]> => {
    const response = await apiClient.get<ApiResponse<{ code: string; symbol: string; isDefault: boolean }[]>>('/products/currencies');
    return response.data.data || [];
  },

  create: async (productData: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', productData);
    return response.data.data!;
  },

  update: async (id: string, productData: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, productData);
    return response.data.data!;
  },

  patch: async (id: string, productData: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, productData);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  toggleAvailability: async (id: string, available: boolean): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/availability`, { available });
    return response.data.data!;
  }
};