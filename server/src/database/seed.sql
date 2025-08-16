-- Очистка таблиц
TRUNCATE TABLE components CASCADE;
TRUNCATE TABLE builds CASCADE;

-- Вставка компонентов с TDP и FPS данными
INSERT INTO components (category_id, name, price, image_url, specs, stock_quantity, tdp, fps_fortnite, fps_gta5, fps_warzone, compatibility) VALUES
-- Процессоры (category_id = 1)
(1, 'Intel Core i5-13600K', 24999.00, '/images/components/cpu-intel-i5.svg', '{"cores": 14, "threads": 20, "base_clock": 3.5, "boost_clock": 5.1, "socket": "LGA1700"}', 15, 125, 180, 95, 110, '{"socket_type": "LGA1700", "max_ram_speed": 5600}'),
(1, 'Intel Core i7-13700K', 34999.00, '/images/components/cpu-intel-i7.svg', '{"cores": 16, "threads": 24, "base_clock": 3.4, "boost_clock": 5.4, "socket": "LGA1700"}', 12, 125, 200, 105, 120, '{"socket_type": "LGA1700", "max_ram_speed": 5600}'),
(1, 'Intel Core i9-13900K', 49999.00, '/images/components/cpu-intel-i9.svg', '{"cores": 24, "threads": 32, "base_clock": 3.0, "boost_clock": 5.8, "socket": "LGA1700"}', 8, 253, 220, 115, 130, '{"socket_type": "LGA1700", "max_ram_speed": 5600}'),
(1, 'AMD Ryzen 5 7600X', 22999.00, '/images/components/cpu-amd-r5.svg', '{"cores": 6, "threads": 12, "base_clock": 4.7, "boost_clock": 5.3, "socket": "AM5"}', 18, 105, 170, 90, 105, '{"socket_type": "AM5", "max_ram_speed": 5200}'),
(1, 'AMD Ryzen 7 7700X', 32999.00, '/images/components/cpu-amd-r7.svg', '{"cores": 8, "threads": 16, "base_clock": 4.5, "boost_clock": 5.4, "socket": "AM5"}', 14, 105, 190, 100, 115, '{"socket_type": "AM5", "max_ram_speed": 5200}'),
(1, 'AMD Ryzen 9 7900X', 44999.00, '/images/components/cpu-amd-r9.svg', '{"cores": 12, "threads": 24, "base_clock": 4.7, "boost_clock": 5.6, "socket": "AM5"}', 10, 170, 210, 110, 125, '{"socket_type": "AM5", "max_ram_speed": 5200}'),

-- Материнские платы (category_id = 2)
(2, 'MSI MPG B760 GAMING EDGE WIFI', 18999.00, '/images/components/motherboard-msi-b760.svg', '{"chipset": "B760", "socket": "LGA1700", "ram_slots": 4, "max_ram": 128, "pcie_slots": 3}', 20, 15, 0, 0, 0, '{"socket_type": "LGA1700", "form_factor": "ATX"}'),
(2, 'ASUS ROG STRIX B760-F GAMING WIFI', 21999.00, '/images/components/motherboard-asus-b760.svg', '{"chipset": "B760", "socket": "LGA1700", "ram_slots": 4, "max_ram": 128, "pcie_slots": 3}', 18, 15, 0, 0, 0, '{"socket_type": "LGA1700", "form_factor": "ATX"}'),
(2, 'GIGABYTE Z790 AORUS ELITE AX', 29999.00, '/images/components/motherboard-gigabyte-z790.svg', '{"chipset": "Z790", "socket": "LGA1700", "ram_slots": 4, "max_ram": 128, "pcie_slots": 4}', 15, 20, 0, 0, 0, '{"socket_type": "LGA1700", "form_factor": "ATX"}'),
(2, 'MSI MPG B650 GAMING EDGE WIFI', 17999.00, '/images/components/motherboard-msi-b650.svg', '{"chipset": "B650", "socket": "AM5", "ram_slots": 4, "max_ram": 128, "pcie_slots": 3}', 22, 15, 0, 0, 0, '{"socket_type": "AM5", "form_factor": "ATX"}'),
(2, 'ASUS ROG STRIX B650-F GAMING WIFI', 19999.00, '/images/components/motherboard-asus-b650.svg', '{"chipset": "B650", "socket": "AM5", "ram_slots": 4, "max_ram": 128, "pcie_slots": 3}', 19, 15, 0, 0, 0, '{"socket_type": "AM5", "form_factor": "ATX"}'),
(2, 'GIGABYTE X670E AORUS ELITE AX', 34999.00, '/images/components/motherboard-gigabyte-x670e.svg', '{"chipset": "X670E", "socket": "AM5", "ram_slots": 4, "max_ram": 128, "pcie_slots": 4}', 12, 20, 0, 0, 0, '{"socket_type": "AM5", "form_factor": "ATX"}'),

-- Видеокарты (category_id = 3)
(3, 'NVIDIA RTX 4060 Ti 8GB', 39999.00, '/images/components/gpu-rtx4060ti.svg', '{"memory": 8, "memory_type": "GDDR6", "boost_clock": 2535, "cuda_cores": 4352}', 25, 160, 140, 75, 85, '{"requires_atx": false, "min_psu": 550}'),
(3, 'NVIDIA RTX 4070 12GB', 59999.00, '/images/components/gpu-rtx4070.svg', '{"memory": 12, "memory_type": "GDDR6X", "boost_clock": 2475, "cuda_cores": 5888}', 20, 200, 180, 95, 110, '{"requires_atx": false, "min_psu": 650}'),
(3, 'NVIDIA RTX 4070 Ti 12GB', 79999.00, '/images/components/gpu-rtx4070ti.svg', '{"memory": 12, "memory_type": "GDDR6X", "boost_clock": 2610, "cuda_cores": 7680}', 15, 285, 220, 115, 130, '{"requires_atx": true, "min_psu": 750}'),
(3, 'NVIDIA RTX 4080 16GB', 119999.00, '/images/components/gpu-rtx4080.svg', '{"memory": 16, "memory_type": "GDDR6X", "boost_clock": 2505, "cuda_cores": 9728}', 12, 320, 280, 145, 165, '{"requires_atx": true, "min_psu": 850}'),
(3, 'NVIDIA RTX 4090 24GB', 199999.00, '/images/components/gpu-rtx4090.svg', '{"memory": 24, "memory_type": "GDDR6X", "boost_clock": 2520, "cuda_cores": 16384}', 8, 450, 350, 180, 200, '{"requires_atx": true, "min_psu": 1000}'),
(3, 'AMD RX 7600 8GB', 29999.00, '/images/components/gpu-rx7600.svg', '{"memory": 8, "memory_type": "GDDR6", "boost_clock": 2655, "stream_processors": 2048}', 30, 165, 130, 70, 80, '{"requires_atx": false, "min_psu": 550}'),
(3, 'AMD RX 7700 XT 12GB', 49999.00, '/images/components/gpu-rx7700xt.svg', '{"memory": 12, "memory_type": "GDDR6", "boost_clock": 2544, "stream_processors": 3456}', 18, 245, 190, 100, 115, '{"requires_atx": true, "min_psu": 700}'),
(3, 'AMD RX 7800 XT 16GB', 69999.00, '/images/components/gpu-rx7800xt.svg', '{"memory": 16, "memory_type": "GDDR6", "boost_clock": 2430, "stream_processors": 3840}', 15, 263, 210, 110, 125, '{"requires_atx": true, "min_psu": 750}'),
(3, 'AMD RX 7900 XT 20GB', 99999.00, '/images/components/gpu-rx7900xt.svg', '{"memory": 20, "memory_type": "GDDR6", "boost_clock": 2400, "stream_processors": 5376}', 12, 315, 250, 130, 145, '{"requires_atx": true, "min_psu": 800}'),
(3, 'AMD RX 7900 XTX 24GB', 129999.00, '/images/components/gpu-rx7900xtx.svg', '{"memory": 24, "memory_type": "GDDR6", "boost_clock": 2500, "stream_processors": 12288}', 10, 355, 280, 145, 165, '{"requires_atx": true, "min_psu": 850}'),

-- Оперативная память (category_id = 4)
(4, 'Corsair Vengeance DDR5-5600 16GB (2x8GB)', 5999.00, '/images/components/ram-corsair-ddr5.svg', '{"type": "DDR5", "speed": 5600, "size_gb": 16, "latency": "CL36", "modules": 2}', 50, 5, 0, 0, 0, '{"max_speed": 5600}'),
(4, 'G.Skill Trident Z5 DDR5-6000 32GB (2x16GB)', 12999.00, '/images/components/ram-gskill-ddr5.svg', '{"type": "DDR5", "speed": 6000, "size_gb": 32, "latency": "CL36", "modules": 2}', 35, 6, 0, 0, 0, '{"max_speed": 6000}'),
(4, 'Kingston Fury Beast DDR5-6400 32GB (2x16GB)', 14999.00, '/images/components/ram-kingston-ddr5.svg', '{"type": "DDR5", "speed": 6400, "size_gb": 32, "latency": "CL32", "modules": 2}', 30, 7, 0, 0, 0, '{"max_speed": 6400}'),
(4, 'Corsair Dominator DDR5-7200 32GB (2x16GB)', 19999.00, '/images/components/ram-corsair-dominator.svg', '{"type": "DDR5", "speed": 7200, "size_gb": 32, "latency": "CL34", "modules": 2}', 25, 8, 0, 0, 0, '{"max_speed": 7200}'),
(4, 'G.Skill Trident Z5 RGB DDR5-8000 32GB (2x16GB)', 29999.00, '/images/components/ram-gskill-rgb.svg', '{"type": "DDR5", "speed": 8000, "size_gb": 32, "latency": "CL38", "modules": 2}', 20, 9, 0, 0, 0, '{"max_speed": 8000}'),

-- Накопители (category_id = 5)
(5, 'Samsung 970 EVO Plus 1TB NVMe', 4999.00, '/images/components/ssd-samsung-970.svg', '{"type": "NVMe", "capacity_gb": 1000, "read_speed": 3500, "write_speed": 3300, "form_factor": "M.2"}', 60, 6, 0, 0, 0, '{"form_factor": "M.2"}'),
(5, 'WD Black SN850X 1TB NVMe', 6999.00, '/images/components/ssd-wd-black.svg', '{"type": "NVMe", "capacity_gb": 1000, "read_speed": 7300, "write_speed": 6300, "form_factor": "M.2"}', 45, 8, 0, 0, 0, '{"form_factor": "M.2"}'),
(5, 'Samsung 990 PRO 2TB NVMe', 12999.00, '/images/components/ssd-samsung-990.svg', '{"type": "NVMe", "capacity_gb": 2000, "read_speed": 7450, "write_speed": 6900, "form_factor": "M.2"}', 35, 10, 0, 0, 0, '{"form_factor": "M.2"}'),
(5, 'Seagate FireCuda 530 2TB NVMe', 14999.00, '/images/components/ssd-seagate-firecuda.svg', '{"type": "NVMe", "capacity_gb": 2000, "read_speed": 7300, "write_speed": 6900, "form_factor": "M.2"}', 30, 10, 0, 0, 0, '{"form_factor": "M.2"}'),
(5, 'Crucial P3 4TB NVMe', 19999.00, '/images/components/ssd-crucial-p3.svg', '{"type": "NVMe", "capacity_gb": 4000, "read_speed": 3500, "write_speed": 3000, "form_factor": "M.2"}', 25, 12, 0, 0, 0, '{"form_factor": "M.2"}'),

-- Блоки питания (category_id = 6)
(6, 'Corsair RM750x 750W Gold', 9999.00, '/images/components/psu-corsair-rm750.svg', '{"wattage": 750, "efficiency": "80+ Gold", "modular": "Full", "form_factor": "ATX"}', 40, 0, 0, 0, 0, '{"form_factor": "ATX"}'),
(6, 'Seasonic Focus GX-850 850W Gold', 12999.00, '/images/components/psu-seasonic-850.svg', '{"wattage": 850, "efficiency": "80+ Gold", "modular": "Full", "form_factor": "ATX"}', 35, 0, 0, 0, 0, '{"form_factor": "ATX"}'),
(6, 'EVGA SuperNOVA 1000 GT 1000W Gold', 15999.00, '/images/components/psu-evga-1000.svg', '{"wattage": 1000, "efficiency": "80+ Gold", "modular": "Full", "form_factor": "ATX"}', 30, 0, 0, 0, 0, '{"form_factor": "ATX"}'),
(6, 'Corsair HX1200 1200W Platinum', 24999.00, '/images/components/psu-corsair-hx1200.svg', '{"wattage": 1200, "efficiency": "80+ Platinum", "modular": "Full", "form_factor": "ATX"}', 20, 0, 0, 0, 0, '{"form_factor": "ATX"}'),
(6, 'Seasonic PRIME TX-1600 1600W Titanium', 39999.00, '/images/components/psu-seasonic-1600.svg', '{"wattage": 1600, "efficiency": "80+ Titanium", "modular": "Full", "form_factor": "ATX"}', 15, 0, 0, 0, 0, '{"form_factor": "ATX"}');

-- Вставка готовых сборок
INSERT INTO builds (name, description, price, image_url, is_featured, components) VALUES
('Gaming Starter', 'Базовый игровой ПК для 1080p игр', 149999.00, '/images/builds/gaming-starter.jpg', false, '[1, 4, 6, 16, 21, 26]'),
('Performance Pro', 'Мощная система для 1440p игр', 249999.00, '/images/builds/performance-pro.jpg', true, '[2, 5, 8, 17, 22, 27]'),
('Elite Gaming', 'Премиум сборка для 4K игр', 399999.00, '/images/builds/elite-gaming.jpg', false, '[3, 6, 10, 18, 23, 28]'),
('Streaming Beast', 'Идеально для стриминга и игр', 299999.00, '/images/builds/streaming-beast.jpg', false, '[2, 5, 9, 17, 22, 27]'),
('Budget Champion', 'Оптимальное соотношение цена/качество', 99999.00, '/images/builds/budget-champion.jpg', false, '[4, 7, 6, 16, 21, 26]');
