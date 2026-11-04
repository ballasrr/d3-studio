#!/usr/bin/env bash
# D3: серверная часть деплоя (Ubuntu/Debian, nginx уже стоит).
#
#   sudo bash /tmp/deploy-d3.sh [домен] [архив]
#
# По умолчанию: домен shah-hookah-bar.ru, архив /tmp/d3-site.tar.gz.
# Сайт раскладывается в /var/www/d3 и открывается по адресу https://<домен>/d3/
# Конфиг Шаха не перезаписывается: в его server-блок добавляется include сниппета.
set -euo pipefail

DOMAIN="${1:-shah-hookah-bar.ru}"
ARCHIVE="${2:-/tmp/d3-site.tar.gz}"
CONF_OVERRIDE="${3:-}"
TARGET=/var/www/d3
SNIPPET=/etc/nginx/snippets/d3.conf

[ "$(id -u)" -eq 0 ] || { echo "Запусти через sudo"; exit 1; }
[ -f "$ARCHIVE" ] || { echo "Нет архива $ARCHIVE"; exit 1; }

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

echo "==> Сниппет nginx: $SNIPPET"
mkdir -p "$(dirname "$SNIPPET")"
cat > "$SNIPPET" <<'EOF'
# D3 (static export, basePath=/d3)
location = /d3 {
    return 301 /d3/;
}

# хешированные ассеты Next.js кешируются на год
location ^~ /d3/_next/ {
    root /var/www;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ^~ /d3/ {
    root /var/www;
    index index.html;
    try_files $uri $uri/ /d3/index.html;
    error_page 404 /d3/404.html;
}
EOF

echo "==> Ищу server-блок для $DOMAIN"
# sites-enabled — это симлинки, поэтому -R (follow symlinks), а не -r.
# sites-available тоже смотрим: конфиг может быть ещё не включён.
CANDS="$(
  grep -RlE "server_name" /etc/nginx/sites-enabled /etc/nginx/sites-available /etc/nginx/conf.d 2>/dev/null \
    | while read -r f; do readlink -f "$f"; done | sort -u
)"
CONF=""
if [ -n "$CONF_OVERRIDE" ]; then
  CONF="$(readlink -f "$CONF_OVERRIDE")"
  [ -f "$CONF" ] || { echo "Нет такого конфига: $CONF_OVERRIDE"; exit 1; }
fi
for f in $CANDS; do
  [ -n "$CONF" ] && break
  if grep -qE "server_name[^;]*${DOMAIN}" "$f" 2>/dev/null; then CONF="$f"; fi
done
if [ -z "$CONF" ]; then
  echo "Не нашёл конфиг nginx с server_name $DOMAIN."
  echo "Диагностика:"
  echo "  ls -l /etc/nginx/sites-enabled/ /etc/nginx/sites-available/ /etc/nginx/conf.d/"
  echo "  nginx -T 2>/dev/null | grep -n server_name"
  echo "Можно указать конфиг вручную третьим аргументом:"
  echo "  bash /tmp/deploy-d3.sh $DOMAIN /tmp/d3-site.tar.gz /etc/nginx/sites-available/shah"
  exit 1
fi
echo "    конфиг: $CONF"

if grep -q "include $SNIPPET" "$CONF"; then
  echo "==> include уже настроен"
else
  CONF_BACKUP="$CONF.bak.$(date +%Y%m%d%H%M%S)"
  cp "$CONF" "$CONF_BACKUP"
  echo "==> Добавляю include в server-блок (бэкап: $CONF_BACKUP)"
  DOMAIN="$DOMAIN" SNIPPET="$SNIPPET" CONF="$CONF" python3 - <<'PY'
import os, re, sys

conf = os.environ["CONF"]
snippet = os.environ["SNIPPET"]
domain = os.environ["DOMAIN"]
text = open(conf, encoding="utf-8").read()

blocks = []
for m in re.finditer(r"\bserver\s*\{", text):
    depth, i = 1, m.end()
    while i < len(text) and depth:
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
        i += 1
    blocks.append((m.start(), m.end(), i - 1, text[m.end():i - 1]))

def score(block):
    body = block[3]
    return (
        domain in body,
        "listen 443" in body or "ssl_certificate" in body,
        "listen" in body,
    )

if not blocks:
    sys.exit("в конфиге нет ни одного server-блока")
best = max(blocks, key=score)
insert_at = best[2]
indent = "    "
text = text[:insert_at] + f"{indent}include {snippet};\n" + text[insert_at:]
open(conf, "w", encoding="utf-8").write(text)
print("    include добавлен")
PY
fi

echo "==> Проверка конфига и reload"
if ! nginx -t; then
  if [ -n "${CONF_BACKUP:-}" ] && [ -f "$CONF_BACKUP" ]; then
    echo "==> nginx -t упал — откатываю конфиг из $CONF_BACKUP"
    cp "$CONF_BACKUP" "$CONF"
    nginx -t && echo "конфиг восстановлен, сайт Шаха не тронут"
  fi
  exit 1
fi
systemctl reload nginx

echo "==> Локальная проверка"
curl -fsS --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/d3/" | grep -qi "Третье" \
  || { echo "Сайт не отвечает по /d3/ — проверь nginx и /var/www/d3"; exit 1; }
curl -fsS --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/" >/dev/null \
  || echo "! внимание: корень сайта Шаха не отвечает — проверь отдельно"

echo ""
echo "Готово: https://$DOMAIN/d3/"
echo "Файлы: $TARGET ($(du -sh "$TARGET" | cut -f1))"
