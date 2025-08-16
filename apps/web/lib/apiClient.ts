import { 
  LoginData, 
  RegisterData, 
  OrderData, 
  ReviewData,
  safeValidate,
  loginSchema,
  registerSchema,
  orderSchema,
  reviewSchema
} from './validation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Типы для API ответов
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
  success: boolean
}

// Класс для обработки API ошибок
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Класс API клиента
class ApiClient {
  private csrfToken: string | null = null

  private async getCSRFToken(): Promise<string> {
    if (this.csrfToken) return this.csrfToken || ''
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/csrf-token`, {
        credentials: 'include',
      })
      const data = await response.json()
      this.csrfToken = data.csrfToken || ''
      return this.csrfToken || ''
    } catch (e) {
      console.error('Failed to get CSRF token:', e)
      return ''
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    }

    // Add CSRF token for non-GET requests
    if (options.method && options.method !== 'GET') {
      const csrf = await this.getCSRFToken()
      if (csrf) headers['X-CSRF-Token'] = csrf
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData.code
        )
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      console.error('API request failed:', error)
      throw new ApiError(
        error instanceof Error ? error.message : 'Неизвестная ошибка',
        500
      )
    }
  }

  private getAuthHeaders(): Record<string, string> {
    if (typeof window !== 'undefined') {
      const token = this.getSecureToken()
      return token ? { Authorization: `Bearer ${token}` } : {}
    }
    return {}
  }

  private getSecureToken(): string | null {
    if (typeof window !== 'undefined') {
      // Используем sessionStorage для получения токена
      try {
        return sessionStorage.getItem('auth_token');
      } catch (error) {
        console.error('Error reading token from sessionStorage:', error);
        return null;
      }
    }
    return null;
  }

  // Аутентификация
  async login(credentials: unknown): Promise<ApiResponse<{ user: any; token: string }>> {
    const validation = safeValidate(loginSchema, credentials)
    if (!validation.success) {
      throw new ApiError(validation.errors.join(', '), 400)
    }

    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(validation.data),
    })
  }

  async register(userData: unknown): Promise<ApiResponse<{ user: any; token: string }>> {
    const validation = safeValidate(registerSchema, userData)
    if (!validation.success) {
      throw new ApiError(validation.errors.join(', '), 400)
    }

    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(validation.data),
    })
  }

  async checkAuth(): Promise<ApiResponse<{ user: any }>> {
    return this.request('/api/auth/me')
  }

  // Заказы
  async getOrders(): Promise<ApiResponse<any[]>> {
    return this.request('/api/orders')
  }

  async getOrder(id: number): Promise<ApiResponse<any>> {
    if (!id || id <= 0) {
      throw new ApiError('Неверный ID заказа', 400)
    }

    return this.request(`/api/orders/${id}`)
  }

  async createOrder(orderData: unknown): Promise<ApiResponse<any>> {
    const validation = safeValidate(orderSchema, orderData)
    if (!validation.success) {
      throw new ApiError(validation.errors.join(', '), 400)
    }

    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(validation.data),
    })
  }

  async updateOrderStatus(id: number, status: string): Promise<ApiResponse<any>> {
    if (!id || id <= 0) {
      throw new ApiError('Неверный ID заказа', 400)
    }

    if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      throw new ApiError('Неверный статус заказа', 400)
    }

    return this.request(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Отзывы
  async getReviews(): Promise<ApiResponse<any[]>> {
    return this.request('/api/reviews')
  }

  async getReview(id: number): Promise<ApiResponse<any>> {
    if (!id || id <= 0) {
      throw new ApiError('Неверный ID отзыва', 400)
    }

    return this.request(`/api/reviews/${id}`)
  }

  async createReview(reviewData: unknown): Promise<ApiResponse<any>> {
    const validation = safeValidate(reviewSchema, reviewData)
    if (!validation.success) {
      throw new ApiError(validation.errors.join(', '), 400)
    }

    return this.request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(validation.data),
    })
  }

  async updateReviewStatus(id: number, status: string): Promise<ApiResponse<any>> {
    if (!id || id <= 0) {
      throw new ApiError('Неверный ID отзыва', 400)
    }

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      throw new ApiError('Неверный статус отзыва', 400)
    }

    return this.request(`/api/reviews/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Компоненты
  async getComponents(): Promise<ApiResponse<any[]>> {
    return this.request('/api/components')
  }

  async getComponent(id: number): Promise<ApiResponse<any>> {
    if (!id || id <= 0) {
      throw new ApiError('Неверный ID компонента', 400)
    }

    return this.request(`/api/components/${id}`)
  }

  // Профиль
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/api/users/profile')
  }

  async updateProfile(profileData: Partial<any>): Promise<ApiResponse<any>> {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse<any>> {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      throw new ApiError('Необходимо указать текущий и новый пароль', 400)
    }

    if (passwordData.newPassword.length < 6) {
      throw new ApiError('Новый пароль должен содержать минимум 6 символов', 400)
    }

    return this.request('/api/users/profile/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    })
  }

  // Заказы пользователя
  async getUserOrders(userId: number, page: number = 1, limit: number = 10, status?: string): Promise<ApiResponse<any>> {
    if (!userId || userId <= 0) {
      throw new ApiError('Неверный ID пользователя', 400)
    }

    let url = `/api/orders/user/${userId}?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    return this.request(url)
  }

  async getUserOrder(userId: number, orderId: number): Promise<ApiResponse<any>> {
    if (!userId || userId <= 0) {
      throw new ApiError('Неверный ID пользователя', 400)
    }

    if (!orderId || orderId <= 0) {
      throw new ApiError('Неверный ID заказа', 400)
    }

    return this.request(`/api/orders/user/${userId}/${orderId}`)
  }

  // Корзина
  async getUserCart(userId: number): Promise<ApiResponse<any>> {
    if (!userId || userId <= 0) {
      throw new ApiError('Неверный ID пользователя', 400)
    }

    return this.request(`/api/cart/user/${userId}`)
  }

  async saveUserCart(userId: number, cartData: any): Promise<ApiResponse<any>> {
    if (!userId || userId <= 0) {
      throw new ApiError('Неверный ID пользователя', 400)
    }

    return this.request(`/api/cart/user/${userId}`, {
      method: 'POST',
      body: JSON.stringify(cartData),
    })
  }
}

export const apiClient = new ApiClient()
