#!/usr/bin/env bash
# D3 на сервере: деплой из GitHub (git pull + сборка + публикация).
#
# Разовая установка (на сервере, root):
#   git clone https://github.com/ballasrr/d3-studio.git /var/www/d3-site
#   bash /var/www/d3-site/deploy/server-deploy.sh shah-hookah-bar.ru
#
# Обновление после git push:
#   ssh root@<server> "bash /var/www/d3-site/deploy/server-deploy.sh"
#   или на сервере: cd /var/www/d3-site && bash deploy/server-deploy.sh
#
# Что делает: git pull → npm ci → STATIC_EXPORT=1 build → копирует out/ в /var/www/d3
# → nginx-d3.sh (сниппет + include + reload + проверка).
set -euo pipefail

DOMAIN="${1:-shah-hookah-bar.ru}"
REPO_DIR="${D3_REPO_DIR:-/var/www/d3-site}"
WWW_DIR="${D3_WWW_DIR:-/var/www/d3}"
REPO_URL="${D3_REPO_URL:-https://github.com/ballasrr/d3-studio.git}"

[ "$(id -u)" -eq 0 ] || { echo "Запусти через sudo"; exit 1; }
command -v node >/dev/null || {
  echo "Нет Node.js. Поставь Node 20+ (curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs) и повтори."
  exit 1
}
node -v
npm -v

if [ ! -d "$REPO_DIR/.git" ]; then
  echo "==> Клонирую $REPO_URL → $REPO_DIR"
  mkdir -p "$(dirname "$REPO_DIR")"
  git clone "$REPO_URL" "$REPO_DIR"
fi

echo "==> Обновляю код"
git -C "$REPO_DIR" fetch --prune origin
git -C "$REPO_DIR" checkout master
git -C "$REPO_DIR" pull --ff-only

cd "$REPO_DIR"

echo "==> Зависимости"
npm ci --no-audit --no-fund || npm install --no-audit --no-fund

echo "==> Статическая сборка (basePath=/d3)"
NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}" \
  STATIC_EXPORT=1 \
  NEXT_PUBLIC_SITE_URL="https://$DOMAIN" \
  npm run build

[ -f out/index.html ] || { echo "Сборка не создала out/index.html"; exit 1; }

case "$WWW_DIR" in
  /var/www/*) ;;
  *) echo "Небезопасный WWW_DIR: $WWW_DIR"; exit 1 ;;
esac

echo "==> Публикую в $WWW_DIR"
if [ -d "$WWW_DIR" ]; then
  BACKUP="$WWW_DIR.bak.$(date +%Y%m%d%H%M%S)"
  echo "    бэкап предыдущей версии: $BACKUP"
  mv "$WWW_DIR" "$BACKUP"
fi
mkdir -p "$WWW_DIR"
cp -a out/. "$WWW_DIR"/
chown -R www-data:www-data "$WWW_DIR"
find "$WWW_DIR" -type d -exec chmod 755 {} \;
find "$WWW_DIR" -type f -exec chmod 644 {} \;

echo "==> nginx"
bash "$REPO_DIR/deploy/nginx-d3.sh" "$DOMAIN"

echo ""
echo "Готово: https://$DOMAIN/d3/"
echo "Сайт: $WWW_DIR ($(du -sh "$WWW_DIR" | cut -f1)), репозиторий: $REPO_DIR"
