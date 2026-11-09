# Деплой D3 рядом с Шахом: https://shah-hookah-bar.ru/d3/

Два способа. **Основной — git**: сервер сам забирает код из GitHub, собирает статику
и публикует её. Архив оставлен как резервный вариант.

Сервер: `193.188.22.186` (`shah-hookah-bar.ru`), Ubuntu + nginx, root-доступ.
Сайт живёт в `/var/www/d3`, nginx отдаёт его по `/d3/` (Node-процесс не нужен).

---

## 1. Git-деплой (основной)

Разовая установка на сервере (нужен Node 20+; на сервере Шаха он уже стоит):

```bash
ssh root@193.188.22.186

git clone https://github.com/ballasrr/d3-studio.git /var/www/d3-site
bash /var/www/d3-site/deploy/server-deploy.sh shah-hookah-bar.ru
```

Или одной командой с локальной машины:

```powershell
ssh root@193.188.22.186 "git clone https://github.com/ballasrr/d3-studio.git /var/www/d3-site && bash /var/www/d3-site/deploy/server-deploy.sh shah-hookah-bar.ru"
```

**Обновление после `git push`:**

```powershell
ssh root@193.188.22.186 "bash /var/www/d3-site/deploy/server-deploy.sh"
```

или на сервере:

```bash
cd /var/www/d3-site && bash deploy/server-deploy.sh
```

Что делает `server-deploy.sh`:

1. `git pull --ff-only` в `/var/www/d3-site` (репозиторий публичный — токен не нужен);
2. `npm ci` (при отсутствии lock — `npm install`);
3. `STATIC_EXPORT=1 NEXT_PUBLIC_SITE_URL=https://<домен> npm run build` → `out/` с
   `basePath=/d3`; память сборки ограничена `--max-old-space-size=1536`;
4. бэкап текущего `/var/www/d3` → `/var/www/d3.bak.<дата>`, копирование новой сборки;
5. `nginx-d3.sh` — сниппет `/etc/nginx/snippets/d3.conf`, `include` в server-блок
   Шаха (с бэкапом конфига), `nginx -t`, reload, проверка `https://<домен>/d3/`.

Требования: Node 20+, npm, git, nginx, python3. Если сборка падает по памяти —
добавь swap (скрипт Шаха это уже делал) или используй архивный способ ниже:
`fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`.

## 2. Архивный деплой (резерв)

Сборка на локальной машине:

```powershell
powershell -ExecutionPolicy Bypass -File studio\d3\deploy\package.ps1 `
  -SiteUrl "https://shah-hookah-bar.ru"
```

Заливка и запуск:

```powershell
cd studio\d3\deploy
scp d3-site.tar.gz deploy-d3.sh nginx-d3.sh root@193.188.22.186:/tmp/
ssh root@193.188.22.186 "bash /tmp/deploy-d3.sh shah-hookah-bar.ru /tmp/d3-site.tar.gz"
```

`deploy-d3.sh` распаковывает `d3-site.tar.gz` в `/var/www/d3` (старую версию
сохраняет рядом), чинит права и вызывает `nginx-d3.sh`.

## Проверка после деплоя

```powershell
tools\venv-pw\Scripts\python.exe studio\d3\deploy\smoke.py https://shah-hookah-bar.ru/d3/
```

Проверяет HTTP 200, заголовок, WebGL, CTA, 404 и ошибки консоли, снимает
`deploy/smoke-*.png`. Плюс вручную:

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" https://shah-hookah-bar.ru/
curl.exe -s -o NUL -w "%{http_code}`n" https://shah-hookah-bar.ru/d3/
curl.exe -s -o NUL -w "%{http_code}`n" https://shah-hookah-bar.ru/api/health
```

## Откат

Git-способ: в `/var/www` лежат бэкапы `d3.bak.<дата>`:

```bash
ssh root@193.188.22.186
rm -rf /var/www/d3 && mv /var/www/d3.bak.<дата> /var/www/d3
```

Если ломался nginx-конфиг — рядом с конфигом Шаха есть `*.bak.<дата>`,
вернуть его и `nginx -t && systemctl reload nginx`.

## Важно

- `basePath=/d3` включается только в `STATIC_EXPORT=1`, поэтому локальная разработка
  остаётся на `http://localhost:4310/`.
- **Полный передеплой Шаха** (`deploy/deploy.sh` в его репозитории) перезаписывает
  `/etc/nginx/sites-available/shah` и теряет строку `include /etc/nginx/snippets/d3.conf;`.
  Сам сайт в `/var/www/d3` остаётся — после такого деплоя достаточно запустить
  `nginx-d3.sh shah-hookah-bar.ru` (или `server-deploy.sh`), чтобы вернуть include.
  Штатный `update.sh` Шаха nginx не трогает.
- Репозиторий публичный; секретов и `.env` в нём нет.
