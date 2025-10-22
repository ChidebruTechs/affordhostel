import api from '../config/api';
import { Hostel } from '../types';

export interface HostelFilters {
  search?: string;
  university?: string;
  min_price?: number;
  max_price?: number;
  amenities?: string;
  verified?: boolean;
  ordering?: string;
}

class HostelService {
  async getHostels(filters?: HostelFilters): Promise<{ results: Hostel[]; count: number }> {
    const response = await api.get('/hostels/', { params: filters });
    return response.data;
  }

  async getHostel(id: string): Promise<Hostel> {
    const response = await api.get(`/hostels/${id}/`);
    return response.data;
  }

  async createHostel(hostelData: FormData): Promise<Hostel> {
    const response = await api.post('/hostels/', hostelData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateHostel(id: string, hostelData: FormData): Promise<Hostel> {
    const response = await api.put(`/hostels/${id}/`, hostelData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteHostel(id: string): Promise<void> {
    await api.delete(`/hostels/${id}/`);
  }

  async addToWishlist(hostelId: string): Promise<void> {
    await api.post(`/hostels/${hostelId}/wishlist/add/`);
  }

  async removeFromWishlist(hostelId: string): Promise<void> {
    await api.delete(`/hostels/${hostelId}/wishlist/remove/`);
  }

  async getWishlist(): Promise<any[]> {
    const response = await api.get('/hostels/wishlist/');
    return response.data;
  }

  async getLandlordHostels(): Promise<Hostel[]> {
    const response = await api.get('/hostels/my-hostels/');
    return response.data;
  }
}

export default new HostelService();