#!/usr/bin/env bash
# D3 lead intake service: SQLite storage + private admin page.
# Run on the server as root after git pull:
#   bash /var/www/d3-site/deploy/leads/install.sh
set -euo pipefail

SRC_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR=/var/www/d3-leads
SERVICE=/etc/systemd/system/d3-leads.service

[ "$(id -u)" -eq 0 ] || { echo "Run as root"; exit 1; }

install -d -m 755 -o www-data -g www-data "$APP_DIR"
install -m 644 -o www-data -g www-data "$SRC_DIR/server.py" "$APP_DIR/server.py"

if [ ! -s "$APP_DIR/key.txt" ]; then
  python3 -c "import secrets; print(secrets.token_urlsafe(24))" > "$APP_DIR/key.txt"
  chown www-data:www-data "$APP_DIR/key.txt"
  chmod 600 "$APP_DIR/key.txt"
fi

# Telegram notifications: reuse the existing Asko bot token + owner chat id.
# Only notifications are sent; there is no bot dialogue for visitors.
if [ -f /root/Asko_manager/.env ]; then
  TG_TOKEN="$(sed -n 's/^BOT_TOKEN=//p' /root/Asko_manager/.env | head -n1)"
  TG_CHAT="$(sed -n 's/^ALLOWED_USER_IDS=//p' /root/Asko_manager/.env | head -n1 | cut -d, -f1)"
  if [ -n "$TG_TOKEN" ] && [ -n "$TG_CHAT" ]; then
    printf 'D3_TG_TOKEN=%s\nD3_TG_CHAT=%s\n' "$TG_TOKEN" "$TG_CHAT" > /etc/d3-leads.env
    chown root:www-data /etc/d3-leads.env
    chmod 640 /etc/d3-leads.env
    echo "==> Telegram notifications enabled for chat $TG_CHAT"
  fi
fi

cat > "$SERVICE" <<'EOF'
[Unit]
Description=D3 lead intake
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/d3-leads
EnvironmentFile=-/etc/d3-leads.env
Environment=D3_LEADS_DB=/var/www/d3-leads/leads.sqlite3
Environment=D3_LEADS_KEY_FILE=/var/www/d3-leads/key.txt
Environment=D3_LEADS_PORT=8124
ExecStart=/usr/bin/python3 /var/www/d3-leads/server.py
Restart=on-failure
RestartSec=2
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/var/www/d3-leads

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable d3-leads >/dev/null 2>&1 || true
systemctl restart d3-leads

for _ in $(seq 1 20); do
  if curl -fsS --max-time 2 http://127.0.0.1:8124/health >/dev/null 2>&1; then
    echo "==> d3-leads is up"
    break
  fi
  sleep 0.5
done

curl -fsS --max-time 3 http://127.0.0.1:8124/health >/dev/null || {
  echo "d3-leads failed to start:"
  systemctl status d3-leads --no-pager -l | tail -n 20
  exit 1
}

KEY="$(cat "$APP_DIR/key.txt")"
echo ""
echo "Готово."
echo "База: $APP_DIR/leads.sqlite3"
echo "Ключ: $APP_DIR/key.txt"
echo "Просмотр: https://shah-hookah-bar.ru/d3/leads?key=$KEY"
echo "CSV:      https://shah-hookah-bar.ru/d3/leads.csv?key=$KEY"
