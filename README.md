# ADAM Music App
Курсовой проект — полноценное музыкальное веб-приложение (full-stack).

## Что делает приложение
Есть регистрация и вход для пользователей
Можно смотреть альбомы и исполнителей
Есть плеер (работает глобально по сайту)
Поиск по альбомам, исполнителям и трекам
Можно добавлять треки в избранное
Создание своих плейлистов и добавление или удаление треков
Возможность оставлять комментарии к альбомам
Есть небольшая статистика (`/api/stats`)

## Технологии
Front-end: React, React Router, Vite
Back-end: Node.js, Express
База данных: MongoDB через Mongoose
Авторизация: JWT и bcrypt

## Структура проекта
`client/` — фронтенд (интерфейс)
`server/` — сервер, API и логика работы с базой
`package.json` в корне — общие скрипты

## Установка
```bash
npm run install:all
```

## Запуск
Сначала запускаем сервер

```bash
npm run dev:server
```
Потом запускаем клиент

```bash
npm run dev:client
```
После запуска
Клиент [http://localhost:3000](http://localhost:3001)
Сервер [http://localhost:5000](http://localhost:3000)

## Environment (server/.env)
Нужно создать файл `server/.env` и прописать

```env
MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
PORT=3000  
```

## Заполнение базы (демо данные)
```bash
npm run seed
```

## Основные команды
`npm run install:all` устанавливает зависимости для сервера и клиента
`npm run dev:server` запуск сервера в режиме разработки
`npm run dev:client` запуск фронтенда
`npm run seed` добавляет тестовые данные в базу

## Небольшое примечание
Если порт 5000 уже занят, сервер выдаст ошибку EADDRINUSE
В этом случае можно освободить порт или поменять значение PORT в .env и заново запустить проект

<!-- API -->

## API Documentation (кратко)

Base URL: http://localhost:3000/api  

Если эндпоинт требует авторизацию, нужно передавать токен в header:  
Authorization: Bearer <token>  

## Health

GET /health  
Просто проверка, что сервер работает  

Ответ:
{ "ok": true }

## Auth

POST /auth/register  
Регистрация нового пользователя  

Body:
{
  "email": "user@mail.com",
  "password": "123456",
  "name": "Adam"
}

В ответ приходит токен и данные пользователя  

---

POST /auth/login  
Вход в систему  

Body:
{
  "email": "user@mail.com",
  "password": "123456"
}

В ответ тоже приходит токен и пользователь  

## Albums

GET /albums  
Получить список всех альбомов  
Можно фильтровать по артисту  

GET /albums/:id  
Получить один альбом вместе с треками  

## Artists

GET /artists  
GET /artists/:id  

## Tracks

GET /tracks  
Список всех треков  

## Search

GET /search?q=текст  
Поиск по альбомам, артистам и трекам  

Ответ:
{
  "albums": [],
  "artists": [],
  "tracks": []
}

## Stats

GET /stats  
Общая статистика по приложению  

Ответ:
{
  "tracks": 0,
  "artists": 0,
  "genres": 0,
  "users": 0
}

## Favorites (нужен логин)

GET /favorites  
Список избранных треков  

POST /favorites  
Добавить трек в избранное  

Body:
{
  "trackId": "..."
}

DELETE /favorites?trackId=...  
Удалить из избранного  

## Reviews

GET /reviews?albumId=...  
Получить комментарии к альбому  

POST /reviews  
Оставить комментарий (нужно быть авторизованным)  

Body:
{
  "albumId": "...",
  "rating": 5,
  "text": "Хороший альбом"
}

## Playlists (нужен логин)

GET /playlists  
Список плейлистов  

POST /playlists  
Создать плейлист  

Body:
{
  "name": "Мой плейлист"
}

PUT /playlists/:id  
Обновить плейлист  

DELETE /playlists/:id  
Удалить плейлист  

POST /playlists/:id/tracks  
Добавить трек в плейлист  

Body:
{
  "trackId": "..."
}

DELETE /playlists/:id/tracks/:trackId  
Удалить трек из плейлиста  

## Ошибки

Обычно ошибки приходят в таком формате:

{
  "error": "Текст ошибки"
}

<!-- Testing -->
## Testing

Проверено вручную

Браузеры:
Chrome — работает стабильно
Firefox — работает стабильно

Функции:
регистрация работает
логин работает
создание плейлиста работает
поиск работает
плеер работает

API проверен через Postman:
все основные запросы (GET, POST) работают корректно

<!-- Lighthouse -->

## Performance (Lighthouse)

Проведена проверка сайта с помощью Lighthouse

Компьютерная версия:
Performance: 88
Accessibility: 100
Best Practices: 100
SEO: 82

Основные метрики:
FCP улучшен на +7
LCP улучшен на +17
TBT улучшен на +30
CLS улучшен на +25
SI улучшен на +9

Мобильная версия:
Performance: 59
Accessibility: 95
Best Practices: 100
SEO: 82

Основные метрики:
TBT улучшен на +30
CLS улучшен на +25
SI улучшен на +4

Вывод:
Сайт хорошо оптимизирован для десктопных устройств, все показатели находятся на высоком уровне.
Мобильная версия работает стабильно, однако производительность ниже из-за загрузки ресурсов и требует дополнительной оптимизации.
