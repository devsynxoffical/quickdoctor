#!/bin/bash
# Run as adminuser in PuTTY or Hetzner KVM (full console, not "Execute command" box).
# Prompts for your sudo password — then runs vps-install-system.sh as root.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export SITE_DOMAIN="${SITE_DOMAIN:-quickdoctor.ie}"
export APP_USER="${APP_USER:-adminuser}"

if [ "$(id -u)" -eq 0 ]; then
  exec bash "$SCRIPT_DIR/vps-install-system.sh"
fi

echo "==> Will run system install as root (sudo password may be asked)..."
echo "    SITE_DOMAIN=${SITE_DOMAIN}  APP_USER=${APP_USER}"
echo ""

if ! sudo SITE_DOMAIN="$SITE_DOMAIN" APP_USER="$APP_USER" bash "$SCRIPT_DIR/vps-install-system.sh"; then
  echo ""
  echo "sudo failed. Try one of these:"
  echo ""
  echo "  A) KVM login screen → username root → root password"
  echo "     export SITE_DOMAIN=quickdoctor.ie APP_USER=adminuser"
  echo "     bash /home/adminuser/quickdoctor/deploy/vps-install-system.sh"
  echo ""
  echo "  B) As adminuser:  su -   (enter root password), then same export + bash as above"
  echo ""
  echo "  C) PuTTY: ssh adminuser@195.201.90.178  then run this script again"
  exit 1
fi
