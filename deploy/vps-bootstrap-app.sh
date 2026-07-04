#!/bin/bash
# Run as devuser — NO sudo required (use after vps-install-system.sh as root).
set -euo pipefail

APP_DIR="$HOME/quickdoctor"
WEB_ROOT="/var/www/quickdoctor-web"
SECRETS="$HOME/.quickdoctor-deploy-secrets"

if [ ! -f "$SECRETS" ]; then
  echo "Missing ${SECRETS}"
  echo "Run deploy/vps-install-system.sh as ROOT first."
  exit 1
fi

# shellcheck disable=SC1090
source "$SECRETS"
SITE_DOMAIN="${SITE_DOMAIN:-quickdoctor.ie}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -base64 48)}"

echo "==> Clone or update app..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull
else
  git clone https://github.com/devsynxoffical/quickdoctor.git "$APP_DIR"
  cd "$APP_DIR"
fi

echo "==> Backend..."
cd "$APP_DIR/backend"

# Preserve integration secrets across redeploys
OLD_ENV="$APP_DIR/backend/.env"
read_old() {
  if [ -f "$OLD_ENV" ]; then
    grep -E "^${1}=" "$OLD_ENV" 2>/dev/null | head -1 | cut -d= -f2- || true
  fi
}
SAVED_STRIPE_KEY="$(read_old STRIPE_SECRET_KEY)"
SAVED_STRIPE_WEBHOOK="$(read_old STRIPE_WEBHOOK_SECRET)"
SAVED_ZOOM_ACCOUNT="$(read_old ZOOM_ACCOUNT_ID)"
SAVED_ZOOM_CLIENT="$(read_old ZOOM_CLIENT_ID)"
SAVED_ZOOM_SECRET="$(read_old ZOOM_CLIENT_SECRET)"
SAVED_RESEND="$(read_old RESEND_API_KEY)"

cat > .env <<EOF
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://quickdoctor:${DB_PASS}@127.0.0.1:5432/quickdoctor?schema=public"
JWT_SECRET="${JWT_SECRET}"
FRONTEND_URL=https://${SITE_DOMAIN},https://www.${SITE_DOMAIN}
STRIPE_SECRET_KEY=${SAVED_STRIPE_KEY}
STRIPE_WEBHOOK_SECRET=${SAVED_STRIPE_WEBHOOK}
ZOOM_ACCOUNT_ID=${SAVED_ZOOM_ACCOUNT}
ZOOM_CLIENT_ID=${SAVED_ZOOM_CLIENT}
ZOOM_CLIENT_SECRET=${SAVED_ZOOM_SECRET}
RESEND_API_KEY=${SAVED_RESEND}
EMAIL_FROM="QuickDoctor <noreply@${SITE_DOMAIN}>"
EOF

npm ci
npx prisma generate
npx prisma db push
npx prisma db seed || true
npm run build

pm2 delete quickdoctor-api 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

echo "==> Frontend..."
cd "$APP_DIR"
echo "NEXT_PUBLIC_API_URL=https://${SITE_DOMAIN}/api" > .env.production
npm ci
npm run build

rm -rf "${WEB_ROOT:?}"/*
cp -r out/* "$WEB_ROOT/"

echo ""
echo "============================================"
echo "App deploy finished."
echo "Site:   http://${SITE_DOMAIN}"
echo "Health: curl http://127.0.0.1:5000/health"
echo "PM2:    pm2 status"
echo ""
echo "Optional (needs real SSH/PuTTY for sudo password):"
echo "  sudo env PATH=\$PATH pm2 startup systemd -u \$USER --hp \$HOME"
echo "  sudo apt install -y certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d ${SITE_DOMAIN} -d www.${SITE_DOMAIN}"
echo "============================================"
