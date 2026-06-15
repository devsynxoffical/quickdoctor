#!/bin/bash
# Run as ROOT (Hetzner web console → login as root, or: sudo -i)
# Installs packages, Postgres, nginx, Node 20, PM2. No password prompts inside this script.
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "You are '$(whoami)' — this script must run as root."
  echo ""
  echo "Hetzner KVM console: at the 'login:' prompt type root (not adminuser/devuser)."
  echo "PuTTY:               ssh adminuser@... then  sudo -i"
  echo ""
  echo "As root:"
  echo "  cd ~ && git clone https://github.com/devsynxoffical/quickdoctor.git quickdoctor"
  echo "  cd ~/quickdoctor"
  echo "  export SITE_DOMAIN=quickdoctor.ie APP_USER=adminuser"
  echo "  bash deploy/vps-install-system.sh"
  exit 1
fi

SITE_DOMAIN="${SITE_DOMAIN:-quickdoctor.ie}"
APP_USER="${APP_USER:-devuser}"
WEB_ROOT="/var/www/quickdoctor-web"
DB_NAME="quickdoctor"
DB_USER="quickdoctor"
DB_PASS="${DB_PASS:-$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)}"
SECRETS="/home/${APP_USER}/.quickdoctor-deploy-secrets"

echo "==> System packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git nginx postgresql postgresql-contrib

if ! command -v node >/dev/null || [ "$(node -v | sed 's/v//' | cut -d. -f1)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

npm install -g pm2

echo "==> PostgreSQL..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};" || true

echo "==> Web root (owned by ${APP_USER}, readable by nginx)..."
mkdir -p "$WEB_ROOT"
chown -R "${APP_USER}:${APP_USER}" "$WEB_ROOT"
chmod 755 "$WEB_ROOT"

cat > "$SECRETS" <<EOF
DB_PASS=${DB_PASS}
SITE_DOMAIN=${SITE_DOMAIN}
EOF
chown "${APP_USER}:${APP_USER}" "$SECRETS"
chmod 600 "$SECRETS"

echo "==> Nginx..."
tee /etc/nginx/sites-available/quickdoctor >/dev/null <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${SITE_DOMAIN} www.${SITE_DOMAIN};

    root ${WEB_ROOT};
    index index.html;

    location / {
        try_files \$uri \$uri.html \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/webhooks/stripe {
        proxy_pass http://127.0.0.1:5000/api/webhooks/stripe;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
NGINX

ln -sf /etc/nginx/sites-available/quickdoctor /etc/nginx/sites-enabled/quickdoctor
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx postgresql
systemctl reload nginx

echo ""
echo "============================================"
echo "System install done."
echo "DB password saved: ${SECRETS}"
echo ""
echo "Next — as user ${APP_USER} (web console or PuTTY):"
echo "  cd ~/quickdoctor"
echo "  git pull   # or clone first"
echo "  bash deploy/vps-bootstrap-app.sh"
echo "============================================"
