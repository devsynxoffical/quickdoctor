#!/bin/bash
# Run on Ubuntu VPS as devuser (with sudo). Usage:
#   export SITE_DOMAIN="yourdomain.com"
#   bash deploy/vps-bootstrap.sh
set -euo pipefail

SITE_DOMAIN="${SITE_DOMAIN:-}"
if [ -z "$SITE_DOMAIN" ]; then
  echo "Set your domain first: export SITE_DOMAIN=yourdomain.com"
  exit 1
fi

APP_DIR="$HOME/quickdoctor"
WEB_ROOT="/var/www/quickdoctor-web"
DB_NAME="quickdoctor"
DB_USER="quickdoctor"
DB_PASS="${DB_PASS:-$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 48)}"

echo "==> Installing system packages..."
sudo apt-get update -y
sudo apt-get install -y curl git nginx postgresql postgresql-contrib

if ! command -v node >/dev/null || [ "$(node -v | sed 's/v//' | cut -d. -f1)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

sudo npm install -g pm2

echo "==> PostgreSQL database..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "==> Clone or update app..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull
else
  git clone https://github.com/devsynxoffical/quickdoctor.git "$APP_DIR"
  cd "$APP_DIR"
fi

echo "==> Backend..."
cd "$APP_DIR/backend"
cat > .env <<EOF
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}?schema=public"
JWT_SECRET="${JWT_SECRET}"
FRONTEND_URL=https://${SITE_DOMAIN},https://www.${SITE_DOMAIN}
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
RESEND_API_KEY=
EMAIL_FROM=QuickDoctor <noreply@${SITE_DOMAIN}>
EOF

npm ci
npx prisma generate
npx prisma db push
npx prisma db seed || true
npm run build

pm2 delete quickdoctor-api 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
sudo env PATH="$PATH" pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | bash || true

echo "==> Frontend..."
cd "$APP_DIR"
echo "NEXT_PUBLIC_API_URL=https://${SITE_DOMAIN}/api" > .env.production
npm ci
npm run build

sudo mkdir -p "$WEB_ROOT"
sudo rm -rf "${WEB_ROOT:?}"/*
sudo cp -r out/* "$WEB_ROOT/"
sudo chown -R www-data:www-data "$WEB_ROOT"

echo "==> Nginx..."
sudo tee /etc/nginx/sites-available/quickdoctor >/dev/null <<NGINX
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

sudo ln -sf /etc/nginx/sites-available/quickdoctor /etc/nginx/sites-enabled/quickdoctor
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "============================================"
echo "Deploy finished."
echo "Site:     http://${SITE_DOMAIN}"
echo "API:      http://${SITE_DOMAIN}/api (via nginx)"
echo "Health:   curl http://127.0.0.1:5000/health"
echo ""
echo "Save these secrets (also in ~/quickdoctor/backend/.env):"
echo "  DB_PASS=${DB_PASS}"
echo "  JWT_SECRET=(in .env)"
echo ""
echo "Next: sudo apt install -y certbot python3-certbot-nginx"
echo "      sudo certbot --nginx -d ${SITE_DOMAIN} -d www.${SITE_DOMAIN}"
echo "============================================"
