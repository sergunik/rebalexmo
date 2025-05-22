# RebalExmo

Бот для автоматичного ребалансування портфелю на біржі EXMO через USDT.

## Особливості

- Автоматичне ребалансування портфелю BTC/XAUT
- Цільова пропорція 50/50
- Поріг ребалансування ±7%
- Всі операції через USDT
- Сповіщення через Telegram
- Зберігання даних у файлах
- Docker контейнеризація

## Встановлення

1. Клонуйте репозиторій:
```bash
git clone https://github.com/yourusername/rebalexmo.git
cd rebalexmo
```

2. Створіть файл `.env` на основі `.env.example`:
```bash
cp .env.example .env
```

3. Відредагуйте `.env` файл, додавши свої ключі API та токени.

4. Запустіть через Docker:
```bash
docker-compose up -d
```

## Розробка

Для розробки:
```bash
docker-compose up
```

Для запуску тестів:
```bash
docker-compose exec app npm test
```

## Ліцензія

MIT 