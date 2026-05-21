#!/bin/bash
# Full deploy with sudo (PuTTY/SSH). Web console → use install-system + bootstrap-app instead.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export SITE_DOMAIN="${SITE_DOMAIN:-quickdoctor.ie}"

if ! sudo -n true 2>/dev/null; then
  echo ""
  echo "ERROR: sudo needs a password — the hosting web console cannot type it."
  echo ""
  echo "Option A — PuTTY (one command after ssh devuser@195.201.90.178):"
  echo "  cd ~/quickdoctor && git pull && bash deploy/vps-bootstrap.sh"
  echo ""
  echo "Option B — Web console (two logins):"
  echo "  1) Console as ROOT:"
  echo "     cd /home/devuser/quickdoctor && bash deploy/vps-install-system.sh"
  echo "  2) Console as devuser:"
  echo "     cd ~/quickdoctor && bash deploy/vps-bootstrap-app.sh"
  echo ""
  exit 1
fi

sudo SITE_DOMAIN="$SITE_DOMAIN" APP_USER="${USER}" bash "$SCRIPT_DIR/vps-install-system.sh"
bash "$SCRIPT_DIR/vps-bootstrap-app.sh"
