#!/usr/bin/env bash
# D3: деплой из готового архива (legacy-вариант, если не хочется git на сервере).
#
#   sudo bash /tmp/deploy-d3.sh [домен] [архив] [конфиг-nginx]
#
# Нужен рядом файл nginx-d3.sh (scp оба файла в /tmp).
# Для git-деплоя используй deploy/server-deploy.sh — он делает git pull + build.
set -euo pipefail

DOMAIN="${1:-shah-hookah-bar.ru}"
ARCHIVE="${2:-/tmp/d3-site.tar.gz}"
CONF_OVERRIDE="${3:-}"
TARGET=/var/www/d3
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

[ "$(id -u)" -eq 0 ] || { echo "Запусти через sudo"; exit 1; }
[ -f "$ARCHIVE" ] || { echo "Нет архива $ARCHIVE"; exit 1; }
[ -f "$SCRIPT_DIR/nginx-d3.sh" ] || {
  echo "Рядом нет nginx-d3.sh. Залей оба файла:"
  echo "  scp d3-site.tar.gz deploy-d3.sh nginx-d3.sh root@<server>:/tmp/"
  exit 1
}

echo "==> Распаковка $ARCHIVE"
rm -rf "$TARGET.new"
mkdir -p "$TARGET.new"
tar -xzf "$ARCHIVE" -C "$TARGET.new" --strip-components=1
[ -f "$TARGET.new/index.html" ] || { echo "В архиве нет d3/index.html"; exit 1; }

if [ -d "$TARGET" ]; then
  BACKUP="$TARGET.bak.$(date +%Y%m%d%H%M%S)"
  echo "==> Бэкап предыдущей версии: $BACKUP"
  mv "$TARGET" "$BACKUP"
fi
mv "$TARGET.new" "$TARGET"
chown -R www-data:www-data "$TARGET"
find "$TARGET" -type d -exec chmod 755 {} \;
find "$TARGET" -type f -exec chmod 644 {} \;

bash "$SCRIPT_DIR/nginx-d3.sh" "$DOMAIN" "$CONF_OVERRIDE"

echo ""
echo "Готово: https://$DOMAIN/d3/"
echo "Файлы: $TARGET ($(du -sh "$TARGET" | cut -f1))"
