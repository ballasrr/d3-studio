# Деплой D3 рядом с Шахом: https://shah-hookah-bar.ru/d3/

Сайт может жить двумя способами:

1. **Как отдельный Node-сервер** — обычный `npm run build` + `next start` (локально, Vercel).
2. **Как статика на общем nginx** — `STATIC_EXPORT=1 npm run build` собирает сайт
   в `out/` с `basePath=/d3`; nginx отдаёт файлы из `/var/www/d3`, Node не нужен.
   Так D3 стоит на том же сервере, что и Шах, и не мешает его конфигу.

Сервер Шаха: `193.188.22.186` (`shah-hookah-bar.ru`), Ubuntu + nginx, root-доступ.

---

## Сборка архива (на этой машине)

```powershell
powershell -ExecutionPolicy Bypass -File studio\d3\deploy\package.ps1 `
  -SiteUrl "https://shah-hookah-bar.ru"
```

Результат — `studio/d3/deploy/d3-site.tar.gz` (~1.1 МБ, внутри папка `d3/`).
Сборка подставляет правильные canonical/OG-ссылки вида `https://shah-hookah-bar.ru/d3/...`.

## Заливка на сервер

```powershell
cd "C:\Users\mrzip\OneDrive\Документы\deepseek-harness\default-workspace\studio\d3\deploy"
scp d3-site.tar.gz deploy-d3.sh root@193.188.22.186:/tmp/
ssh root@193.188.22.186 "bash /tmp/deploy-d3.sh shah-hookah-bar.ru /tmp/d3-site.tar.gz"
```

Что делает `deploy-d3.sh`:

- распаковывает архив в `/var/www/d3`, старую версию сохраняет как `/var/www/d3.bak.<дата>`;
- пишет сниппет `/etc/nginx/snippets/d3.conf` (`location /d3/` + годовое кеширование `_next`);
- **не перезаписывает конфиг Шаха**, а добавляет в его server-блок одну строку
  `include /etc/nginx/snippets/d3.conf;` (перед этим делает бэкап конфига);
- `nginx -t`, `systemctl reload nginx`, проверка `https://<домен>/d3/` c `--resolve`;
- при ошибке nginx-конфига сайт остаётся прежним, конфиг откатывается вручную из `.bak`.

## Проверка после деплоя

```powershell
tools\venv-pw\Scripts\python.exe studio\d3\deploy\smoke.py https://shah-hookah-bar.ru/d3/
```

Скрипт проверяет HTTP 200, заголовок, canvas (WebGL), CTA, отсутствие 404 и ошибок
в консоли, снимает `deploy/smoke-*.png`. Плюс вручную:

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" https://shah-hookah-bar.ru/
curl.exe -s -o NUL -w "%{http_code}`n" https://shah-hookah-bar.ru/d3/
curl.exe -s -o NUL -w "%{http_code}`n" https://shah-hookah-bar.ru/api/health
```

## Откат

```bash
ssh root@193.188.22.186
rm -rf /var/www/d3 && mv /var/www/d3.bak.<дата> /var/www/d3
# и убрать include из конфига nginx (бэкап /etc/nginx/sites-available/shah.bak.<дата>)
nginx -t && systemctl reload nginx
```

## Важно

- `basePath=/d3` задаётся только в экспортной сборке (`STATIC_EXPORT=1`), поэтому
  локальная разработка продолжает работать на `http://localhost:4310/`.
- Внутренние якоря (`#services`, `#contact`) и `next/link` уже учитывают `basePath`.
- Если позже поменяется домен, пересобрать пакет с новым `-SiteUrl` и повторить заливку.
- **Полный передеплой Шаха** (`deploy/deploy.sh` в его репозитории) перезаписывает
  `/etc/nginx/sites-available/shah` и теряет строку `include /etc/nginx/snippets/d3.conf;`.
  Сам сайт D3 в `/var/www/d3` при этом остаётся — после такого деплоя нужно один раз
  вернуть include (повторный запуск `deploy-d3.sh` сделает это идемпотентно).
  Штатный `update.sh` Шаха nginx не трогает — D3 продолжает работать.

## Живой адрес

https://shah-hookah-bar.ru/d3/ — проверено: 200, WebGL, console errors 0,
`/api/health` Шаха 200, корень Шаха 200.
