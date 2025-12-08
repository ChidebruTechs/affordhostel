import api from '../config/api';
import { User } from '../types';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  university?: string;
  student_id?: string;
  course?: string;
  year_of_study?: string;
  business_name?: string;
  business_registration?: string;
  tax_pin?: string;
  bank_account?: string;
  license_number?: string;
  experience?: string;
  specialization?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login/', credentials);
    const { user, tokens } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register/', userData);
    const { user, tokens } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile/');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile/', userData);
    return response.data;
  }

  async changePassword(passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<void> {
    await api.post('/auth/change-password/', passwordData);
  }

  async resetPassword(email: string): Promise<void> {
    await api.post('/auth/password-reset/', { email });
  }

  async confirmPasswordReset(data: {
    user_id: string;
    token: string;
    password: string;
  }): Promise<void> {
    await api.post(`/auth/password-reset-confirm/${data.user_id}/${data.token}/`, {
      password: data.password,
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

export default new AuthService();