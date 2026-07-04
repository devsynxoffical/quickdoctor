#!/bin/bash
# Run on the VPS:
#   export ZOOM_ACCOUNT_ID=... ZOOM_CLIENT_ID=... ZOOM_CLIENT_SECRET=...
#   export STRIPE_SECRET_KEY=... STRIPE_WEBHOOK_SECRET=...
#   bash deploy/configure-integrations.sh

set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/quickdoctor}"
if [ -d /root/quickdoctor ]; then APP_DIR=/root/quickdoctor; fi

ENV_FILE="$APP_DIR/backend/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

set_var() {
  local key="$1"
  local val="$2"
  if [ -z "$val" ]; then return; fi
  if grep -q "^${key}=" "$ENV_FILE"; then
    sed -i.bak "s|^${key}=.*|${key}=${val}|" "$ENV_FILE"
  else
    echo "${key}=${val}" >> "$ENV_FILE"
  fi
}

echo "==> Updating integration env vars in $ENV_FILE"
set_var "ZOOM_ACCOUNT_ID" "${ZOOM_ACCOUNT_ID:-}"
set_var "ZOOM_CLIENT_ID" "${ZOOM_CLIENT_ID:-}"
set_var "ZOOM_CLIENT_SECRET" "${ZOOM_CLIENT_SECRET:-}"
set_var "STRIPE_SECRET_KEY" "${STRIPE_SECRET_KEY:-}"
set_var "STRIPE_WEBHOOK_SECRET" "${STRIPE_WEBHOOK_SECRET:-}"
set_var "FRONTEND_URL" "${FRONTEND_URL:-https://quickdoctor.ie,https://www.quickdoctor.ie}"
set_var "NODE_ENV" "production"
rm -f "${ENV_FILE}.bak"

cd "$APP_DIR/backend"
npm run verify-integrations || true

if command -v pm2 >/dev/null; then
  pm2 restart quickdoctor-api
  pm2 save
fi

echo "Done. Webhook URL: https://quickdoctor.ie/api/webhooks/stripe"
