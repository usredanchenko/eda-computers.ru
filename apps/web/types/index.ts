// API Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at?: string;
  is_active?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Component Types
export interface Component {
  id: number;
  name: string;
  category_id: number;
  price: number;
  specs: Record<string, any>;
  stock_quantity: number;
  image_url?: string;
  tdp: number;
  fps_fortnite: number;
  fps_gta5: number;
  fps_warzone: number;
  compatibility: Record<string, any> | string;
}

export interface OrderComponent {
  id: number;
  name: string;
  category_name: string;
  price: number;
}

export interface Build {
  id: number;
  name: string;
  components: Component[];
  totalPrice: number;
  performance: number;
  created_at: string;
  updated_at: string;
}

// Order Types
export interface Order {
  id: number;
  user_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  components: OrderComponent[];
  has_review: boolean;
}

export interface CreateOrderData {
  components: any[];
  total_price: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  notes?: string;
  order_type?: 'guest' | 'auth';
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Review Types
export interface Review {
  id: number;
  user_id: number;
  order_id: number;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  order_total: number;
  admin_comment: string | null;
  user_name?: string;
}

export interface CreateReviewData {
  order_id: number;
  rating: number;
  text: string;
}

// Profile Types
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Performance Types
export interface PerformanceMetrics {
  cpu: number;
  gpu: number;
  ram: number;
  storage: number;
  overall: number;
}

// Compatibility Types
export interface CompatibilityIssue {
  type: 'warning' | 'error';
  message: string;
  components: string[];
}
