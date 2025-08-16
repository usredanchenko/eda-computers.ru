import { CreateOrderData, CreateReviewData, PasswordChangeData, User, ApiResponse, Order, Review, OrderStatus } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private csrfToken: string | null = null;

  private async getCSRFToken(): Promise<string> {
    if (this.csrfToken) return this.csrfToken;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/csrf-token`, {
        credentials: 'include'
      });
      const data = await response.json();
      this.csrfToken = data.csrfToken || '';
      return this.csrfToken || '';
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
      return '';
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Получаем CSRF токен для POST/PUT/DELETE запросов
    let csrfToken = '';
    if (options.method && options.method !== 'GET') {
      csrfToken = await this.getCSRFToken();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    };

    // Добавляем CSRF токен в заголовки
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Важно для cookies
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private getAuthHeaders(): Record<string, string> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
  }

  // Аутентификация
  async login(email: string, password: string) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Сохраняем токен в localStorage для совместимости
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    // Сохраняем токен в localStorage для совместимости
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  }

  async checkAuth() {
    return this.request('/api/auth/me');
  }

  async logout() {
    const response = await this.request('/api/auth/logout', {
      method: 'POST',
    });
    
    // Очищаем токен из localStorage
    localStorage.removeItem('auth_token');
    this.csrfToken = null;
    
    return response;
  }

  // Заказы
  async getUserOrders() {
    return this.request('/api/orders');
  }

  async getOrder(orderId: number) {
    return this.request(`/api/orders/${orderId}`);
  }

  async createOrder(orderData: CreateOrderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(orderId: number) {
    return this.request(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  }

  // Комментарии
  async getUserComments() {
    return this.request('/api/comments/user');
  }

  async getOrderComments(orderId: number) {
    return this.request(`/api/comments/order/${orderId}`);
  }

  async createComment(orderId: number, message: string) {
    return this.request('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, message }),
    });
  }

  async deleteComment(commentId: number) {
    return this.request(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Отзывы
  async getReviews() {
    return this.request('/api/reviews');
  }

  async getReview(id: number) {
    return this.request(`/api/reviews/${id}`);
  }

  async createReview(reviewData: CreateReviewData) {
    return this.request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }



  // Компоненты
  async getComponents() {
    return this.request('/api/components');
  }

  async getComponent(id: number) {
    return this.request(`/api/components/${id}`);
  }

  // Профиль
  async updateProfile(profileData: Partial<User>) {
    return this.request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: PasswordChangeData) {
    return this.request('/api/profile/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // ===== АДМИН МЕТОДЫ =====

  // Получить всех пользователей
  async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    return this.request('/api/users');
  }

  // Публичные готовые сборки (витрина)
  async getPublicBuilds() {
    return this.request('/api/builds/public');
  }

  // Получить конкретного пользователя
  async getUser(userId: number): Promise<ApiResponse<{ user: User }>> {
    return this.request(`/api/users/${userId}`);
  }

  // Создать нового пользователя
  async createUser(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: 'USER' | 'ADMIN';
  }): Promise<ApiResponse<{ user: User }>> {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // Обновить пользователя
  async updateUser(userId: number, userData: {
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: 'USER' | 'ADMIN';
    is_active?: boolean;
  }): Promise<ApiResponse<{ user: User }>> {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  // Получить статистику пользователей
  async getUserStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    byRole: { [key: string]: number };
    newLast30Days: number;
  }>> {
    return this.request('/api/users/stats/overview');
  }

  // Получить все заказы (для админов)
  async getAllOrders(): Promise<ApiResponse<{ orders: Order[] }>> {
    return this.request('/api/orders/all');
  }

  // Обновить статус заказа (для админов)
  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<ApiResponse<{ order: Order }>> {
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Получить все отзывы (для админов)
  async getAllReviews(): Promise<ApiResponse<{ reviews: Review[] }>> {
    return this.request('/api/reviews');
  }

  // Обновить статус отзыва (для админов)
  async updateReviewStatus(reviewId: number, status: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<{ review: Review }>> {
    return this.request(`/api/reviews/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
}

export const api = new ApiClient();
