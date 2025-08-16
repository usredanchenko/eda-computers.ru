const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eda_computers',
  user: process.env.DB_USER || 'eda_user',
  password: process.env.DB_PASSWORD || 'eda_password',
});

const categories = {
  CPU: 1,
  MB: 2,
  GPU: 3,
  RAM: 4,
  SSD: 5,
  PSU: 6,
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function ensureCategories(client) {
  const rows = [
    { id: 1, name: 'CPU' },
    { id: 2, name: 'Motherboard' },
    { id: 3, name: 'GPU' },
    { id: 4, name: 'RAM' },
    { id: 5, name: 'Storage' },
    { id: 6, name: 'PSU' },
  ];
  await client.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);
  for (const r of rows) {
    await client.query(
      'INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING',
      [r.id, r.name]
    );
  }
}

async function insertComponents(client) {
  const cpus = [
    ['Intel Core i5-12400F', { cores: 6, threads: 12, base_clock: 2.5, boost_clock: 4.4, socket: 'LGA1700' }, 65],
    ['Intel Core i7-12700F', { cores: 12, threads: 20, base_clock: 2.1, boost_clock: 4.9, socket: 'LGA1700' }, 125],
    ['AMD Ryzen 5 5600', { cores: 6, threads: 12, base_clock: 3.5, boost_clock: 4.4, socket: 'AM4' }, 65],
    ['AMD Ryzen 7 5800X3D', { cores: 8, threads: 16, base_clock: 3.4, boost_clock: 4.5, socket: 'AM4' }, 105],
  ];
  const gpus = [
    ['NVIDIA RTX 3060 12GB', { memory: 12, memory_type: 'GDDR6', boost_clock: 1777, cuda_cores: 3584 }, 170],
    ['NVIDIA RTX 4070 Super 12GB', { memory: 12, memory_type: 'GDDR6X', boost_clock: 2475, cuda_cores: 7168 }, 225],
    ['AMD RX 6700 XT 12GB', { memory: 12, memory_type: 'GDDR6', boost_clock: 2581, stream_processors: 2560 }, 230],
    ['AMD RX 7800 XT 16GB', { memory: 16, memory_type: 'GDDR6', boost_clock: 2430, stream_processors: 3840 }, 263],
  ];
  const rams = [
    ['Kingston Fury Beast DDR4-3200 16GB (2x8GB)', { type: 'DDR4', speed: 3200, size_gb: 16, latency: 'CL16', modules: 2 }, 6],
    ['G.Skill Ripjaws V DDR4-3600 32GB (2x16GB)', { type: 'DDR4', speed: 3600, size_gb: 32, latency: 'CL18', modules: 2 }, 7],
    ['Corsair Vengeance DDR5-6000 32GB (2x16GB)', { type: 'DDR5', speed: 6000, size_gb: 32, latency: 'CL36', modules: 2 }, 7],
  ];
  const ssds = [
    ['Kingston NV2 1TB NVMe', { type: 'NVMe', capacity_gb: 1000, read_speed: 3500, write_speed: 2100, form_factor: 'M.2' }, 5],
    ['Crucial P5 Plus 2TB NVMe', { type: 'NVMe', capacity_gb: 2000, read_speed: 6600, write_speed: 5000, form_factor: 'M.2' }, 8],
  ];
  const psus = [
    ['be quiet! Pure Power 11 FM 650W', { wattage: 650, efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' }, 0],
    ['Cooler Master MWE Gold 750 V2', { wattage: 750, efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' }, 0],
  ];
  const mbs = [
    ['ASUS PRIME B660-PLUS D4', { chipset: 'B660', socket: 'LGA1700', ram_slots: 4, max_ram: 128, pcie_slots: 3 }, 15],
    ['MSI PRO B650-P', { chipset: 'B650', socket: 'AM5', ram_slots: 4, max_ram: 128, pcie_slots: 3 }, 15],
  ];

  const rows = [];
  const images = {
    CPU: '/images/components/cpu-intel-i5.svg',
    MB: '/images/components/motherboard-msi-b760.svg',
    GPU: '/images/components/gpu-rtx4070.svg',
    RAM: '/images/components/ram-corsair-ddr5.svg',
    SSD: '/images/components/ssd-samsung-970.svg',
    PSU: '/images/components/psu-corsair-rm750.svg',
  };

  const pushSet = (items, catId, fpsBase = { fortnite: 120, gta5: 70, warzone: 80 }) => {
    for (let i = 0; i < items.length; i++) {
      for (let variant = 0; variant < 8; variant++) {
        const [name, specs, tdp] = items[i];
        const price = rand(3000, 200000);
        const stock = rand(5, 60);
        const fps_fortnite = catId === categories.GPU || catId === categories.CPU ? fpsBase.fortnite + rand(-30, 60) : 0;
        const fps_gta5 = catId === categories.GPU || catId === categories.CPU ? fpsBase.gta5 + rand(-15, 40) : 0;
        const fps_warzone = catId === categories.GPU || catId === categories.CPU ? fpsBase.warzone + rand(-20, 50) : 0;
        const image_url =
          catId === categories.CPU ? images.CPU :
          catId === categories.MB ? images.MB :
          catId === categories.GPU ? images.GPU :
          catId === categories.RAM ? images.RAM :
          catId === categories.SSD ? images.SSD :
          images.PSU;

        rows.push({
          category_id: catId,
          name: `${name} v${variant + 1}`,
          price,
          image_url,
          specs,
          stock_quantity: stock,
          tdp,
          fps_fortnite,
          fps_gta5,
          fps_warzone,
          compatibility: catId === categories.GPU ? { requires_atx: false, min_psu: 550 } : {},
        });
      }
    }
  };

  pushSet(cpus, categories.CPU);
  pushSet(gpus, categories.GPU, { fortnite: 150, gta5: 80, warzone: 90 });
  pushSet(rams, categories.RAM);
  pushSet(ssds, categories.SSD);
  pushSet(psus, categories.PSU);
  pushSet(mbs, categories.MB);

  const limited = rows.slice(0, 200);

  const values = [];
  const params = [];
  let idx = 1;
  for (const r of limited) {
    values.push(`(${r.category_id}, $${idx++}, ${r.price}, $${idx++}, $${idx++}, ${r.stock_quantity}, ${r.tdp}, ${r.fps_fortnite}, ${r.fps_gta5}, ${r.fps_warzone}, $${idx++})`);
    params.push(r.name);
    params.push(r.image_url);
    params.push(JSON.stringify(r.specs));
    params.push(JSON.stringify(r.compatibility || {}));
  }
  const text = `INSERT INTO components (category_id, name, price, image_url, specs, stock_quantity, tdp, fps_fortnite, fps_gta5, fps_warzone, compatibility) VALUES ${values.join(', ')}`;
  await client.query(text, params);
}

async function insertBuilds(client) {
  const byCat = async (catId, limit) => {
    const res = await client.query('SELECT id FROM components WHERE category_id = $1 ORDER BY random() LIMIT $2', [catId, limit]);
    return res.rows.map(r => r.id);
  };

  const makeBuild = async (name, description, perf = 'high') => {
    const cpu = await byCat(categories.CPU, 1);
    const mb = await byCat(categories.MB, 1);
    const gpu = await byCat(categories.GPU, 1);
    const ram = await byCat(categories.RAM, 1);
    const ssd = await byCat(categories.SSD, 1);
    const psu = await byCat(categories.PSU, 1);
    const components = [...cpu, ...mb, ...gpu, ...ram, ...ssd, ...psu];

    const priceRes = await client.query('SELECT SUM(price) AS total FROM components WHERE id = ANY($1::int[])', [components]);
    const total = Number(priceRes.rows[0].total || 0);

    await client.query(
      'INSERT INTO builds (name, description, total_price, components) VALUES ($1, $2, $3, $4)',
      [name, description, total, JSON.stringify(components)]
    );
  };

  const builds = [
    ['Starter 1080p', 'Оптимальная сборка для игр в 1080p. Баланс цены и FPS.'],
    ['Streamer 1440p', 'Игры и стриминг в 1440p — стабильная производительность.'],
    ['4K Enthusiast', 'Для 4K-игр и творчества — топовое железо.'],
    ['Esports Lite', 'Максимум FPS в киберспортивных тайтлах.'],
    ['Creator Pro', 'Работа с графикой и видео, быстрый рендер.'],
    ['Budget Office', 'Офисные задачи и учеба, низкое энергопотребление.'],
    ['Compact ITX', 'Компактный корпус, тихая работа.'],
    ['VR Ready', 'Готов к VR — стабильные 90+ FPS.'],
    ['Quiet Build', 'Тихая система с качественными вентиляторами.'],
    ['AI Dev Box', 'Машинное обучение и разработка, GPU-ускорение.'],
  ];

  for (const [name, desc] of builds) {
    await makeBuild(name, desc);
  }
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await ensureCategories(client);
    await insertComponents(client);
    await insertBuilds(client);
    await client.query('COMMIT');
    console.log('Inserted extra components and builds');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    process.exitCode = 1;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  main().then(() => process.exit());
}
