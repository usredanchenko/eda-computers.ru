import { z } from 'zod'

// Схемы валидации
export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
})

export const orderSchema = z.object({
  build_id: z.number().positive('ID сборки должен быть положительным'),
  total_price: z.number().positive('Цена должна быть положительной'),
})

export const reviewSchema = z.object({
  order_id: z.number().positive('ID заказа должен быть положительным'),
  rating: z.number().min(1).max(5, 'Рейтинг должен быть от 1 до 5'),
  text: z.string().min(10, 'Отзыв должен содержать минимум 10 символов'),
})

// Типы для валидации
export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>
export type OrderData = z.infer<typeof orderSchema>
export type ReviewData = z.infer<typeof reviewSchema>

// Функции валидации
export const validateLogin = (data: unknown): LoginData => {
  return loginSchema.parse(data)
}

export const validateRegister = (data: unknown): RegisterData => {
  return registerSchema.parse(data)
}

export const validateOrder = (data: unknown): OrderData => {
  return orderSchema.parse(data)
}

export const validateReview = (data: unknown): ReviewData => {
  return reviewSchema.parse(data)
}

// Безопасная валидация с возвратом ошибок
export const safeValidate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message),
      }
    }
    return {
      success: false,
      errors: ['Неизвестная ошибка валидации'],
    }
  }
}

// Валидация email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Валидация пароля
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

// Валидация цены
export const isValidPrice = (price: number): boolean => {
  return price > 0 && price <= 1000000
}

// Валидация рейтинга
export const isValidRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating)
}
