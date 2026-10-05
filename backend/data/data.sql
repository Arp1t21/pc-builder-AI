-- Очистка перед вставкой
DELETE FROM components;

-- Процессоры Intel
INSERT INTO components (category, brand, name, chipset, specs, price, image_url) VALUES
                                                                                     ('CPU', 'Intel', 'Intel Core i5-13400F', 'Raptor Lake', '10 ядер (6P+4E), 16 потоков, до 4.6 GHz, 20 MB Cache', 99950, null),
                                                                                     ('CPU', 'Intel', 'Intel Core i7-13700K', 'Raptor Lake', '16 ядер (8P+8E), 24 потока, до 5.4 GHz, 30 MB Cache', 214950, null),
                                                                                     ('CPU', 'Intel', 'Intel Core i9-13900K', 'Raptor Lake', '24 ядра (8P+16E), 32 потока, до 5.8 GHz, 36 MB Cache', 299950, null),

-- Процессоры AMD
                                                                                     ('CPU', 'AMD', 'AMD Ryzen 5 7600X', 'Zen 4', '6 ядер, 12 потоков, до 5.3 GHz, 32 MB Cache', 124950, null),
                                                                                     ('CPU', 'AMD', 'AMD Ryzen 7 7700X', 'Zen 4', '8 ядер, 16 потоков, до 5.4 GHz, 32 MB Cache', 174950, null),
                                                                                     ('CPU', 'AMD', 'AMD Ryzen 9 7950X', 'Zen 4', '16 ядер, 32 потока, до 5.7 GHz, 64 MB Cache', 324950, null),

-- Видеокарты NVIDIA
                                                                                     ('GPU', 'NVIDIA', 'MSI GeForce RTX 4060 GAMING X 8GB', 'Ada Lovelace', '8GB GDDR6, 3072 CUDA, Boost: 2475 MHz', 199950, null),
                                                                                     ('GPU', 'NVIDIA', 'ASUS TUF Gaming GeForce RTX 4060 Ti 16GB', 'Ada Lovelace', '16GB GDDR6, 4352 CUDA, Boost: 2535 MHz', 274950, null),
                                                                                     ('GPU', 'NVIDIA', 'Gigabyte GeForce RTX 4070 GAMING OC 12GB', 'Ada Lovelace', '12GB GDDR6X, 5888 CUDA, Boost: 2475 MHz', 349950, null),
                                                                                     ('GPU', 'NVIDIA', 'MSI GeForce RTX 4080 SUPER GAMING X TRIO 16GB', 'Ada Lovelace', '16GB GDDR6X, 10240 CUDA, Boost: 2550 MHz', 649950, null),
                                                                                     ('GPU', 'NVIDIA', 'ASUS ROG Strix GeForce RTX 4090 OC 24GB', 'Ada Lovelace', '24GB GDDR6X, 16384 CUDA, Boost: 2640 MHz', 999950, null),

-- Видеокарты AMD
                                                                                     ('GPU', 'AMD', 'PowerColor AMD Radeon RX 7600 Fighter 8GB', 'RDNA 3', '8GB GDDR6, 2048 Stream Processors, Boost: 2625 MHz', 164950, null),
                                                                                     ('GPU', 'AMD', 'Sapphire PULSE AMD Radeon RX 7700 XT 12GB', 'RDNA 3', '12GB GDDR6, 3456 Stream Processors, Boost: 2544 MHz', 274950, null),
                                                                                     ('GPU', 'AMD', 'XFX Speedster MERC 310 AMD Radeon RX 7800 XT 16GB', 'RDNA 3', '16GB GDDR6, 3840 Stream Processors, Boost: 2430 MHz', 324950, null),

-- Оперативная память DDR4
                                                                                     ('RAM', 'Kingston', 'Kingston FURY Beast DDR4 16GB (2x8GB)', '3200 MHz', 'DDR4, 16GB (2x8GB), 3200MHz, CL16, Black', 29950, null),
                                                                                     ('RAM', 'Corsair', 'Corsair Vengeance LPX DDR4 32GB (2x16GB)', '3600 MHz', 'DDR4, 32GB (2x16GB), 3600MHz, CL18, Black', 54950, null),
                                                                                     ('RAM', 'G.Skill', 'G.Skill Trident Z RGB DDR4 32GB (2x16GB)', '3600 MHz', 'DDR4, 32GB (2x16GB), 3600MHz, CL16, RGB', 69950, null),

-- Оперативная память DDR5
                                                                                     ('RAM', 'Kingston', 'Kingston FURY Beast DDR5 32GB (2x16GB)', '5600 MHz', 'DDR5, 32GB (2x16GB), 5600MHz, CL36, Black', 64950, null),
                                                                                     ('RAM', 'Corsair', 'Corsair Dominator Platinum RGB DDR5 32GB (2x16GB)', '6000 MHz', 'DDR5, 32GB (2x16GB), 6000MHz, CL36, RGB', 84950, null),
                                                                                     ('RAM', 'G.Skill', 'G.Skill Trident Z5 RGB DDR5 64GB (2x32GB)', '6400 MHz', 'DDR5, 64GB (2x32GB), 6400MHz, CL32, RGB', 149950, null),

-- Материнские платы Intel
                                                                                     ('Motherboard', 'ASUS', 'ASUS PRIME B660M-A DDR4', 'LGA1700', 'mATX, Intel B660, DDR4, 2xM.2, USB 3.2', 49950, null),
                                                                                     ('Motherboard', 'MSI', 'MSI MAG B760 TOMAHAWK WIFI DDR4', 'LGA1700', 'ATX, Intel B760, DDR4, 3xM.2, WiFi 6E', 84950, null),
                                                                                     ('Motherboard', 'Gigabyte', 'Gigabyte Z790 AORUS ELITE AX', 'LGA1700', 'ATX, Intel Z790, DDR5, 4xM.2, WiFi 6E, RGB', 124950, null),
                                                                                     ('Motherboard', 'ASUS', 'ASUS ROG MAXIMUS Z790 HERO', 'LGA1700', 'ATX, Intel Z790, DDR5, 5xM.2, WiFi 6E, RGB Oled', 249950, null),

-- Материнские платы AMD
                                                                                     ('Motherboard', 'MSI', 'MSI PRO B550-VC', 'AM4', 'ATX, AMD B550, DDR4, 2xM.2, USB 3.2', 44950, null),
                                                                                     ('Motherboard', 'ASUS', 'ASUS TUF Gaming B650-PLUS WIFI', 'AM5', 'ATX, AMD B650, DDR5, 3xM.2, WiFi 6', 89950, null),
                                                                                     ('Motherboard', 'Gigabyte', 'Gigabyte X670 AORUS ELITE AX', 'AM5', 'ATX, AMD X670, DDR5, 4xM.2, WiFi 6E, PCIe 5.0', 139950, null),
                                                                                     ('Motherboard', 'ASUS', 'ASUS ROG CROSSHAIR X670E HERO', 'AM5', 'ATX, AMD X670E, DDR5, 5xM.2, WiFi 6E, PCIe 5.0', 274950, null),

-- SSD накопители
                                                                                     ('SSD', 'Samsung', 'Samsung 970 EVO Plus 500GB', 'NVMe M.2', '500GB, NVMe M.2, 3500/3200 MB/s, TLC', 24950, null),
                                                                                     ('SSD', 'Samsung', 'Samsung 980 PRO 1TB', 'NVMe M.2', '1TB, NVMe M.2 PCIe 4.0, 7000/5000 MB/s, TLC', 44950, null),
                                                                                     ('SSD', 'WD', 'WD Black SN850X 2TB', 'NVMe M.2', '2TB, NVMe M.2 PCIe 4.0, 7300/6600 MB/s, TLC', 84950, null),
                                                                                     ('SSD', 'Kingston', 'Kingston KC3000 1TB', 'NVMe M.2', '1TB, NVMe M.2 PCIe 4.0, 7000/6000 MB/s, TLC', 49950, null),
                                                                                     ('SSD', 'Crucial', 'Crucial P5 Plus 2TB', 'NVMe M.2', '2TB, NVMe M.2 PCIe 4.0, 6600/5000 MB/s, TLC', 74950, null),

-- Блоки питания
                                                                                     ('PSU', 'Corsair', 'Corsair RM550e 550W', '80+ Gold', '550W, 80+ Gold, Modular, 135mm fan', 39950, null),
                                                                                     ('PSU', 'be quiet!', 'be quiet! Pure Power 11 600W', '80+ Gold', '600W, 80+ Gold, Non-modular, 120mm fan', 39950, null),
                                                                                     ('PSU', 'Corsair', 'Corsair RM750e 750W', '80+ Gold', '750W, 80+ Gold, Fully Modular, 135mm fan', 49950, null),
                                                                                     ('PSU', 'EVGA', 'EVGA SuperNOVA 850 G6', '80+ Gold', '850W, 80+ Gold, Fully Modular, 135mm FDB fan', 59950, null),
                                                                                     ('PSU', 'Seasonic', 'Seasonic FOCUS GX-1000', '80+ Gold', '1000W, 80+ Gold, Fully Modular, 120mm FDB fan', 79950, null),
                                                                                     ('PSU', 'Corsair', 'Corsair HX1200 Platinum', '80+ Platinum', '1200W, 80+ Platinum, Fully Modular, 140mm ML fan', 124950, null),

-- Корпуса
                                                                                     ('Case', 'Fractal Design', 'Fractal Design Meshify 2 Compact', 'Mid Tower', 'Mid Tower, Tempered Glass, USB 3.1 Type-C, 2x140mm fans', 59950, null),
                                                                                     ('Case', 'NZXT', 'NZXT H510 Flow', 'Mid Tower', 'Mid Tower, Tempered Glass, USB 3.1 Type-C, 2x120mm fans', 49950, null),
                                                                                     ('Case', 'Corsair', 'Corsair 4000D Airflow', 'Mid Tower', 'Mid Tower, Tempered Glass, USB 3.1 Type-C, 2x120mm fans', 54950, null),
                                                                                     ('Case', 'Lian Li', 'Lian Li O11 Dynamic EVO', 'Mid Tower', 'Mid Tower, Tempered Glass, USB 3.1 Type-C, Support 360mm AIO', 84950, null),
                                                                                     ('Case', 'be quiet!', 'be quiet! Pure Base 500DX', 'Mid Tower', 'Mid Tower, Tempered Glass, 3x140mm Pure Wings 2 fans', 59950, null),
                                                                                     ('Case', 'Fractal Design', 'Fractal Design Torrent', 'Mid Tower', 'Mid Tower, Tempered Glass, 2x180mm Dynamic PWM fans', 89950, null);