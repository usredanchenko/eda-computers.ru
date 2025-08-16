const { Pool } = require('pg');

// Создаем пул подключений к PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eda_computers',
  user: process.env.DB_USER || 'eda_user',
  password: process.env.DB_PASSWORD || 'eda_password',
  max: 20, // максимальное количество подключений в пуле
  idleTimeoutMillis: 30000, // время жизни неактивного подключения
  connectionTimeoutMillis: 2000, // время ожидания подключения
});

// Обработка ошибок подключения
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Функция для выполнения запросов
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Функция для получения клиента из пула
const getClient = () => {
  return pool.connect();
};

module.exports = {
  query,
  getClient,
  pool
};
