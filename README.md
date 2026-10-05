# PC Builder AI 🖥️🤖

Веб-приложение для подбора и конфигурирования компьютерных сборок с AI-анализом совместимости и рекомендаций.

---

## 📁 Архитектура проекта

Проект разделен на две независимые части:

```text
pc-builder-AI/
├── backend/                  # Серверная часть на Python (FastAPI + SQLAlchemy)
│   ├── app/                  # Исходный код приложения
│   │   ├── models/           # Модели SQLAlchemy (User, Component, PcBuild, BuildReaction)
│   │   ├── schemas/          # Pydantic схемы валидации и сериализации
│   │   ├── routers/          # Маршруты API (auth, users, components, builds, ai)
│   │   ├── services/         # Сервисы (JWT auth, AI-анализатор сборки)
│   │   ├── config.py         # Настройки приложения (.env)
│   │   ├── database.py       # Подключение к PostgreSQL и инициализация данных
│   │   ├── dependencies.py   # Внедрение зависимостей (get_db, get_current_user)
│   │   └── main.py           # Инициализация FastAPI приложения и CORS
│   ├── data/                 # Начальные данные (data.sql)
│   ├── venv/                 # Виртуальное окружение Python
│   ├── requirements.txt      # Зависимости Python
│   ├── run.py                # Скрипт запуска сервера
│   ├── .env                  # Конфигурация окружения
│   └── .gitignore
│
├── frontend/                 # Клиентская часть на React 18 + Vite
│   ├── src/                  # Компоненты, страницы, Zustand store, Axios клиент
│   ├── package.json          # Зависимости NPM
│   ├── vite.config.js        # Проксирование /api на localhost:8000
│   └── tailwind.config.js
│
├── .gitignore                # Корневой gitignore
└── README.md                 # Документация проекта
```

---

## 🛠️ Стек технологий

- **Backend**: Python 3.13, FastAPI, SQLAlchemy 2.0, PostgreSQL 17, Pydantic v2, Uvicorn, Bcrypt, PyJWT.
- **Frontend**: React 18, Vite, Tailwind CSS, Zustand, Axios, Lucide React, React Router 6.

---

## 🚀 Быстрый старт

### 1. Запуск бэкенда (Python / FastAPI)

> [!NOTE]
> Служба PostgreSQL должна быть запущена, а база `pcbuilder` доступна на порту 5432 (настройки в `backend/.env`).

Перейдите в папку `backend` и запустите сервер:

```powershell
cd backend
.\venv\Scripts\python.exe run.py
```

*Или активируйте venv:*
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python run.py
```

- Бэкенд доступен по адресу: **http://localhost:8000**
- Интерактивная документация Swagger: **http://localhost:8000/docs**
- Альтернативная документация ReDoc: **http://localhost:8000/redoc**

---

### 2. Запуск фронтенда (React / Vite)

В отдельном окне терминала перейдите в папку `frontend`:

```powershell
cd frontend
npm run dev
```

Фронтенд доступен по адресу: **http://localhost:3000**

---

## 🔗 Основные API Эндпоинты

- `POST /api/auth/register` — Регистрация пользователя
- `POST /api/auth/login` — Авторизация (получение JWT)
- `GET /api/auth/me` — Текущий авторизованный пользователь
- `GET /api/users/me` — Профиль пользователя
- `PUT /api/users/me` — Редактирование профиля (email, bio, avatarUrl)
- `GET /api/users/{username}` — Публичный профиль
- `GET /api/components` — Полный каталог комплектующих
- `GET /api/components/category/{category}` — Фильтрация комплектующих по категории
- `GET /api/builds/public` — Публичные сборки пользователей
- `GET /api/builds/my` — Личные сборки пользователя
- `POST /api/builds` — Сохранение новой сборки
- `PUT /api/builds/{id}` — Редактирование сборки
- `DELETE /api/builds/{id}` — Удаление сборки
- `POST /api/builds/{id}/like` — Лайк сборки (toggle)
- `POST /api/builds/{id}/dislike` — Дизлайк сборки (toggle)
- `GET /api/builds/{id}/reaction` — Статус реакции пользователя
- `POST /api/ai/analyze` — Умный AI-анализ совместимости сборки (сокет, DDR, TDP/ватты, баланс)
