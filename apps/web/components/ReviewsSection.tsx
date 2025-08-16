'use client';

import { motion } from 'framer-motion';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    customerName: 'Александр К.',
    rating: 5,
    comment: 'Отличный сервис! Собрал игровой ПК за 2 часа. Все работает идеально, FPS в играх выше ожидаемого.',
    date: '2024-01-15'
  },
  {
    id: 2,
    customerName: 'Мария В.',
    rating: 5,
    comment: 'Профессиональная сборка, все компоненты подобраны идеально. Конструктор помог сэкономить время и деньги.',
    date: '2024-01-10'
  },
  {
    id: 3,
    customerName: 'Дмитрий С.',
    rating: 4,
    comment: 'Хороший выбор компонентов, быстрая доставка. Единственное - хотелось бы больше готовых сборок.',
    date: '2024-01-08'
  },
  {
    id: 4,
    customerName: 'Елена П.',
    rating: 5,
    comment: 'Первый раз собирала ПК, конструктор очень помог. Все совместимо, работает без проблем.',
    date: '2024-01-05'
  },
  {
    id: 5,
    customerName: 'Игорь М.',
    rating: 5,
    comment: 'Отличные цены, качественные компоненты. Расчет TDP и FPS очень точный.',
    date: '2024-01-03'
  },
  {
    id: 6,
    customerName: 'Анна Л.',
    rating: 4,
    comment: 'Удобный интерфейс, понятная система подбора. Рекомендую всем!',
    date: '2024-01-01'
  }
];

export default function ReviewsSection() {
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length;

  return (
    <section className="relative z-10 py-16 px-4 bg-dark-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Отзывы клиентов</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-2xl">
                  {star <= Math.round(averageRating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-white text-xl font-bold">
              {averageRating.toFixed(1)} из 5
            </span>
          </div>
          <p className="text-xl text-gray-300">
            {mockReviews.length} отзывов от довольных клиентов
          </p>
        </motion.div>

        {/* Отзывы */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 border border-gray-700 hover:border-neon-cyan transition-all duration-300"
            >
              {/* Рейтинг */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-lg">
                    {star <= review.rating ? '⭐' : '☆'}
                  </span>
                ))}
              </div>

              {/* Комментарий */}
              <p className="text-gray-300 mb-4 leading-relaxed">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Автор и дата */}
              <div className="flex items-center justify-between">
                <span className="text-neon-cyan font-semibold">
                  {review.customerName}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(review.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Кнопка "Все отзывы" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neon-button px-8 py-3 text-lg"
          >
            Читать все отзывы
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
