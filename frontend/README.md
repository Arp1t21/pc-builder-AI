# PC Builder Frontend

Веб-платформа для конфигурации ПК с AI-анализом

## Установка
```bash
npm install
```

## Запуск
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Сборка для продакшена
```bash
npm run build
```

## Технологии

- React 18
- Vite
- Tailwind CSS
- React Router
- Zustand (State Management)
- Axios
- Lucide Icons

## Структура проекта
```
src/
├── api/              # API конфигурация
├── components/       # React компоненты
│   ├── layout/      # Шапка, подвал, макет
│   ├── builder/     # Компоненты конфигуратора
│   ├── auth/        # Формы входа/регистрации
│   └── builds/      # Компоненты сборок
├── pages/           # Страницы приложения
├── store/           # Zustand store
├── utils/           # Утилиты и константы
└── App.jsx          # Главный компонент
```

## API Endpoints

- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация
- `GET /api/components` - Список компонентов
- `GET /api/components/category/:category` - Компоненты по категории
- `GET /api/builds/my` - Мои сборки
- `GET /api/builds/public` - Публичные сборки
- `POST /api/builds` - Создать сборку
- `PUT /api/builds/:id` - Обновить сборку
- `DELETE /api/builds/:id` - Удалить сборку
- `POST /api/ai/analyze` - AI-анализ сборки