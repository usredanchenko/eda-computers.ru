import { User } from '@/types';

/**
 * Определяет правильный редирект на основе роли пользователя
 * @param user - объект пользователя
 * @param defaultRedirect - дефолтный редирект (если нет роли)
 * @returns путь для редиректа
 */
export function getRedirectPath(user: User | null, defaultRedirect: string = '/'): string {
  if (!user) {
    return defaultRedirect;
  }

  switch (user.role) {
    case 'ADMIN':
      return '/admin';
    case 'USER':
      return '/account';
    default:
      return defaultRedirect;
  }
}

/**
 * Проверяет, имеет ли пользователь доступ к определенной странице
 * @param user - объект пользователя
 * @param requiredRole - требуемая роль
 * @returns true если доступ разрешен
 */
export function hasAccess(user: User | null, requiredRole: 'ADMIN' | 'USER' | 'ANY'): boolean {
  if (!user) {
    return false;
  }

  if (requiredRole === 'ANY') {
    return true;
  }

  if (requiredRole === 'ADMIN') {
    return user.role === 'ADMIN';
  }

  return user.role === 'USER' || user.role === 'ADMIN';
}

/**
 * Получает отображаемое имя пользователя
 * @param user - объект пользователя
 * @returns отображаемое имя
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) {
    return 'Гость';
  }

  return user.name || user.email || 'Пользователь';
}
