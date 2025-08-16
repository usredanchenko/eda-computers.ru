import { Component } from '@/types';

export const mockComponents: Component[] = [
  // Процессоры
  {
    id: 1,
    name: 'Intel Core i7-13700K',
    category_id: 1,
    price: 45000,
    specs: {
      cores: '16 (8P + 8E)',
      frequency: '3.4 GHz',
      socket: 'LGA1700',
      tdp: 125
    },
    stock_quantity: 15,
    image_url: undefined, // Используем иконку
    tdp: 125,
    fps_fortnite: 180,
    fps_gta5: 120,
    fps_warzone: 140,
    compatibility: 'LGA1700'
  },
  {
    id: 2,
    name: 'AMD Ryzen 7 7700X',
    category_id: 1,
    price: 42000,
    specs: {
      cores: '8',
      frequency: '4.5 GHz',
      socket: 'AM5',
      tdp: 105
    },
    stock_quantity: 12,
    image_url: undefined, // Используем иконку
    tdp: 105,
    fps_fortnite: 175,
    fps_gta5: 115,
    fps_warzone: 135,
    compatibility: 'AM5'
  },
  // Видеокарты
  {
    id: 3,
    name: 'NVIDIA RTX 4070 Ti',
    category_id: 3,
    price: 85000,
    specs: {
      memory: '12 GB GDDR6X',
      boost_clock: '2.61 GHz',
      tdp: 285
    },
    stock_quantity: 8,
    image_url: undefined, // Используем иконку
    tdp: 285,
    fps_fortnite: 200,
    fps_gta5: 150,
    fps_warzone: 180,
    compatibility: 'ATX'
  },
  {
    id: 4,
    name: 'AMD RX 7800 XT',
    category_id: 3,
    price: 75000,
    specs: {
      memory: '16 GB GDDR6',
      boost_clock: '2.43 GHz',
      tdp: 263
    },
    stock_quantity: 10,
    image_url: undefined, // Используем иконку
    tdp: 263,
    fps_fortnite: 190,
    fps_gta5: 140,
    fps_warzone: 170,
    compatibility: 'ATX'
  },
  // Материнские платы
  {
    id: 5,
    name: 'ASUS ROG STRIX Z790-E',
    category_id: 2,
    price: 35000,
    specs: {
      socket: 'LGA1700',
      chipset: 'Z790',
      ram_type: 'DDR5',
      form_factor: 'ATX'
    },
    stock_quantity: 6,
    image_url: undefined, // Используем иконку
    tdp: 15,
    fps_fortnite: 0,
    fps_gta5: 0,
    fps_warzone: 0,
    compatibility: 'LGA1700'
  },
  {
    id: 6,
    name: 'MSI MPG B650 CARBON',
    category_id: 2,
    price: 28000,
    specs: {
      socket: 'AM5',
      chipset: 'B650',
      ram_type: 'DDR5',
      form_factor: 'ATX'
    },
    stock_quantity: 8,
    image_url: undefined, // Используем иконку
    tdp: 12,
    fps_fortnite: 0,
    fps_gta5: 0,
    fps_warzone: 0,
    compatibility: 'AM5'
  },
  // Оперативная память
  {
    id: 7,
    name: 'Corsair Vengeance 32GB DDR5-6000',
    category_id: 4,
    price: 18000,
    specs: {
      capacity: '32 GB',
      speed: '6000 MHz',
      type: 'DDR5',
      latency: 'CL36'
    },
    stock_quantity: 20,
    image_url: undefined, // Используем иконку
    tdp: 5,
    fps_fortnite: 0,
    fps_gta5: 0,
    fps_warzone: 0,
    compatibility: 'DDR5'
  },
  {
    id: 8,
    name: 'G.Skill Trident Z5 32GB DDR5-6400',
    category_id: 4,
    price: 22000,
    specs: {
      capacity: '32 GB',
      speed: '6400 MHz',
      type: 'DDR5',
      latency: 'CL32'
    },
    stock_quantity: 15,
    image_url: undefined, // Используем иконку
    tdp: 5,
    fps_fortnite: 0,
    fps_gta5: 0,
    fps_warzone: 0,
    compatibility: 'DDR5'
  },
  // Накопители
  {
    id: 9,
    name: 'Samsung 970 EVO Plus 1TB',
    category_id: 5,
    price: 12000,
    specs: {
      capacity: '1 TB',
      interface: 'PCIe 3.0 x4',
      read_speed: '3500 MB/s',
      write_speed: '3300 MB/s'
    },
    stock_quantity: 25,
    image_url: undefined, // Используем иконку
    tdp: 3,
    fps_fortnite: 0,
    fps_gta5: 0,
    fps_warzone: 0,
    compatibility: 'M.2'
  },
  {
    id: 10,
    name: 'WD Black SN850X 2TB',
    category_id: 5,
    price: 25000,
    specs: {
      capacity: '2 TB',
      interface: 'PCIe 4.0 x4',
      read_speed: '7300 MB/s',
      write_speed: '6600 MB/s'
    },
    stock_quantity: 12,
    image_url: undefined, // Используем иконку
    tdp: 3,
    fps_fortnite: 0,
    fps_gta5: 0,
    fps_warzone: 0,
    compatibility: 'M.2'
  },
  // Блоки питания
  {
    id: 11,
    name: 'Corsair RM850x',
    category_id: 6,
    price: 15000,
    specs: {
      wattage: '850W',
      efficiency: '80+ Gold',
      modular: 'Full Modular',
      form_factor: 'ATX'
    },
    stock_quantity: 10,
    image_url: undefined, // Используем иконку
    tdp: 0,
    fps_fortnite: 0,
    fps_gta5: 0,
    fps_warzone: 0,
    compatibility: 'ATX'
  },
  {
    id: 12,
    name: 'Seasonic Focus GX-750',
    category_id: 6,
    price: 12000,
    specs: {
      wattage: '750W',
      efficiency: '80+ Gold',
      modular: 'Full Modular',
      form_factor: 'ATX'
    },
    stock_quantity: 8,
    image_url: undefined, // Используем иконку
    tdp: 0,
    fps_fortnite: 0,
    fps_gta5: 0,
    fps_warzone: 0,
    compatibility: 'ATX'
  }
];

export const mockBuilds = [
  {
    id: 1,
    name: 'Игровая сборка RTX 4070 Ti',
    description: 'Мощная игровая система для современных игр',
    components: [1, 3, 5, 7, 9, 11],
    total_price: 220000,
    performance_level: 'high'
  },
  {
    id: 2,
    name: 'Бюджетная сборка RX 7800 XT',
    description: 'Отличное соотношение цена/производительность',
    components: [2, 4, 6, 8, 10, 12],
    total_price: 200000,
    performance_level: 'medium'
  },
  {
    id: 3,
    name: 'Профессиональная сборка RTX 4080',
    description: 'Максимальная производительность для работы и игр',
    components: [1, 3, 5, 7, 9, 11],
    total_price: 350000,
    performance_level: 'high'
  },
  {
    id: 4,
    name: 'Компактная сборка ITX',
    description: 'Мощный компьютер в компактном корпусе',
    components: [2, 4, 6, 8, 10, 12],
    total_price: 180000,
    performance_level: 'medium'
  }
];

export const mockOrders = [
  {
    id: 1,
    user_id: 1,
    customer_name: 'Иван Петров',
    customer_email: 'ivan@example.com',
    customer_phone: '+7 (999) 123-45-67',
    status: 'delivered',
    total_price: 220000,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:15:00Z',
    components: [
      {
        id: 1,
        name: 'Intel Core i7-13700K',
        category_name: 'Процессор',
        price: 45000
      },
      {
        id: 3,
        name: 'NVIDIA RTX 4070 Ti',
        category_name: 'Видеокарта',
        price: 85000
      },
      {
        id: 5,
        name: 'ASUS ROG STRIX Z790-E',
        category_name: 'Материнская плата',
        price: 35000
      },
      {
        id: 7,
        name: 'Corsair Vengeance 32GB DDR5-6000',
        category_name: 'Оперативная память',
        price: 18000
      },
      {
        id: 9,
        name: 'Samsung 970 EVO Plus 1TB',
        category_name: 'Накопитель',
        price: 12000
      },
      {
        id: 11,
        name: 'Corsair RM850x',
        category_name: 'Блок питания',
        price: 15000
      }
    ],
    has_review: false
  },
  {
    id: 2,
    user_id: 1,
    customer_name: 'Иван Петров',
    customer_email: 'ivan@example.com',
    customer_phone: '+7 (999) 123-45-67',
    status: 'shipping',
    total_price: 180000,
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-05T11:30:00Z',
    components: [
      {
        id: 2,
        name: 'AMD Ryzen 7 7700X',
        category_name: 'Процессор',
        price: 42000
      },
      {
        id: 4,
        name: 'AMD RX 7800 XT',
        category_name: 'Видеокарта',
        price: 75000
      },
      {
        id: 6,
        name: 'MSI MPG B650 CARBON',
        category_name: 'Материнская плата',
        price: 28000
      },
      {
        id: 8,
        name: 'G.Skill Trident Z5 32GB DDR5-6400',
        category_name: 'Оперативная память',
        price: 22000
      },
      {
        id: 10,
        name: 'WD Black SN850X 2TB',
        category_name: 'Накопитель',
        price: 25000
      },
      {
        id: 12,
        name: 'Seasonic Focus GX-750',
        category_name: 'Блок питания',
        price: 12000
      }
    ],
    has_review: false
  }
];

export const mockReviews = [
  {
    id: 1,
    user_id: 1,
    order_id: 1,
    rating: 5,
    text: 'Отличная сборка! Все работает идеально, игры запускаются без проблем. Спасибо за качественную работу!',
    status: 'approved',
    created_at: '2024-01-25T16:45:00Z',
    updated_at: '2024-01-26T10:20:00Z',
    order_total: 220000,
    admin_comment: null
  },
  {
    id: 2,
    user_id: 2,
    order_id: 3,
    rating: 4,
    text: 'Хорошая сборка, но немного шумновата. В целом доволен покупкой.',
    status: 'pending',
    created_at: '2024-02-10T14:30:00Z',
    updated_at: '2024-02-10T14:30:00Z',
    order_total: 195000,
    admin_comment: null
  }
];
