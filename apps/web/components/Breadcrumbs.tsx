'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export default function Breadcrumbs({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  
  // Генерируем хлебные крошки на основе текущего пути
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Главная', href: '/' }
    ];

    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Маппинг сегментов на читаемые названия
      const labelMap: Record<string, string> = {
        'dashboard': 'Личный кабинет',
        'orders': 'Заказы',
        'reviews': 'Отзывы',
        'admin': 'Админ-панель',
        'auth': 'Авторизация',
        'login': 'Вход',
        'register': 'Регистрация',
        'builds': 'Готовые сборки',
        'about': 'О нас',
        'constructor': 'Конструктор',
        'profile': 'Профиль',
        'create': 'Создать',
        'comments': 'Комментарии',
        'review': 'Отзыв',
        'timeline': 'Таймлайн',
        'logs': 'Журнал'
      };

      const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: index === segments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Не показываем хлебные крошки на главной странице
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-gray-500"
            >
              /
            </motion.span>
          )}
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {item.isActive ? (
              <span className="text-neon-cyan font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-400 hover:text-neon-cyan transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </nav>
  );
}
