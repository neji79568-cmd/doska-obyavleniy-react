# Рядом — доска объявлений

React + TypeScript. Список и публикация объявлений через готовый API. Без Babel: TypeScript и JSX обрабатывает Vite, типы проверяет `tsc`.

Сайт: https://neji79568-cmd.github.io/doska-obyavleniy-react/

## Запуск

Нужен Node.js 22.12+ (для GitHub Actions используется Node.js 24).

```sh
npm ci
npm run dev
```

Проверка типов и сборка: `npm run build`. Просмотр сборки: `npm run preview`.

## Возможности

- Загрузка объявлений по 12 с кнопкой «Показать ещё».
- Поиск по названию и описанию и сортировка среди загруженных объявлений.
- Карточки с фотографией, ценой в сомах и просмотром полного описания.
- Форма с обязательными названием, описанием, ценой и фотографией; предпросмотр фото.
- Сообщения о загрузке, ошибках и успешной публикации. Адаптация для телефона.

API: `https://inai-col1.fishrungames.com`.

- `GET /ads?page=1&limit=12` — получение списка.
- `POST /ads` — `FormData` с полями `title`, `description`, `price`, `image`.
- Относительные адреса фотографий разрешаются относительно API, а не GitHub Pages.
- Фото обязательно согласно схеме сервера. Контакт можно указать в описании, отдельного поля в API нет.

## GitHub Pages через Actions

Исходники хранятся в основной ветке `main`. Workflow `.github/workflows/pages.yml` при каждом push:

1. Выполняет `npm ci`.
2. Проверяет TypeScript и собирает приложение (`npm run build`).
3. Загружает `dist` как Pages artifact.
4. Публикует artifact официальным `actions/deploy-pages`.

В **Settings → Pages → Source** выберите **GitHub Actions**. Ветка `gh-pages` не используется.

В `vite.config.ts` указан `base: '/doska-obyavleniy-react/'`. При переименовании репозитория поменяйте этот путь.
