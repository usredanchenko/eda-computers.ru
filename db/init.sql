-- Инициализация базы данных EDA Computers
-- Создание пользователя и настройка прав доступа

-- Создание пользователя для приложения (если не существует)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'eda_user') THEN
    CREATE USER eda_user WITH PASSWORD 'eda_password';
  END IF;
END
$$;

-- Создание базы данных (если не существует)
SELECT 'CREATE DATABASE eda_computers'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eda_computers')\gexec

-- Подключение к базе данных
\c eda_computers;

-- Создание таблиц
-- Таблица категорий компонентов
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица компонентов
CREATE TABLE IF NOT EXISTS components (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  price DECIMAL(10,2) NOT NULL,
  specs JSONB,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  tdp INTEGER,
  fps_fortnite INTEGER,
  fps_gta5 INTEGER,
  fps_warzone INTEGER,
  compatibility TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица готовых сборок
CREATE TABLE IF NOT EXISTS builds (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  components JSONB,
  total_price DECIMAL(10,2),
  performance_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  delivery_address TEXT,
  notes TEXT,
  components JSONB,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'created',
  order_type VARCHAR(20) DEFAULT 'guest',
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estimated_delivery TIMESTAMP,
  tracking_number VARCHAR(100)
);



-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сессий пользователей
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица корзин пользователей
CREATE TABLE IF NOT EXISTS user_carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  cart_data JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица комментариев к заказам
CREATE TABLE IF NOT EXISTS order_comments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_admin_comment BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица журнала изменений заказов
CREATE TABLE IF NOT EXISTS order_logs (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  status_from VARCHAR(50),
  status_to VARCHAR(50) NOT NULL,
  changed_by VARCHAR(100) NOT NULL,
  comment TEXT,
  metadata JSONB,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отзывов (обновлена для связи с пользователями и заказами)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_comment TEXT,
  order_total DECIMAL(10,2),
  components JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category_id);
CREATE INDEX IF NOT EXISTS idx_components_price ON components(price);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_order_logs_order ON order_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_carts_user_id ON user_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_order_comments_order_id ON order_comments(order_id);
CREATE INDEX IF NOT EXISTS idx_order_comments_user_id ON order_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_order_comments_created_at ON order_comments(created_at);

-- Предоставление прав пользователю
GRANT ALL PRIVILEGES ON DATABASE eda_computers TO eda_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO eda_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO eda_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO eda_user;

-- Установка владельца таблиц
ALTER TABLE categories OWNER TO eda_user;
ALTER TABLE components OWNER TO eda_user;
ALTER TABLE builds OWNER TO eda_user;
ALTER TABLE orders OWNER TO eda_user;
ALTER TABLE reviews OWNER TO eda_user;
ALTER TABLE users OWNER TO eda_user;
ALTER TABLE order_logs OWNER TO eda_user;
ALTER TABLE user_sessions OWNER TO eda_user;
ALTER TABLE user_carts OWNER TO eda_user;
ALTER TABLE order_comments OWNER TO eda_user;

-- Создание последовательностей
ALTER SEQUENCE categories_id_seq OWNER TO eda_user;
ALTER SEQUENCE components_id_seq OWNER TO eda_user;
ALTER SEQUENCE builds_id_seq OWNER TO eda_user;
ALTER SEQUENCE orders_id_seq OWNER TO eda_user;
ALTER SEQUENCE reviews_id_seq OWNER TO eda_user;
ALTER SEQUENCE users_id_seq OWNER TO eda_user;
ALTER SEQUENCE order_logs_id_seq OWNER TO eda_user;
ALTER SEQUENCE user_sessions_id_seq OWNER TO eda_user;
ALTER SEQUENCE user_carts_id_seq OWNER TO eda_user;
ALTER SEQUENCE order_comments_id_seq OWNER TO eda_user;
