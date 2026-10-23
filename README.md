# Доска объявлений

React + TypeScript, без Babel. Весь интерфейс в `src/main.tsx`.

`GET /ads` — список, `POST /ads` — публикация через FormData.
API: https://inai-col1.fishrungames.com

Запуск: `npm ci`, затем `npm run dev`.
Сборка: `npm run build`.

GitHub Actions собирает и публикует `dist` из `main`, без ветки `gh-pages`.
В Settings → Pages → Source нужно выбрать GitHub Actions.
Адрес после деплоя: https://tazhibaev890-max.github.io/dask1/
