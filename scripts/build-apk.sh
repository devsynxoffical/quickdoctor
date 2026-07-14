#!/usr/bin/env bash
# Rebuild the website-wrapper Android APK into public/downloads/quickdoctor.apk
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/android-webview"
OUT="$ROOT/public/downloads/quickdoctor.apk"

export JAVA_HOME="${JAVA_HOME:-/Applications/Android Studio.app/Contents/jbr/Contents/Home}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/build-tools/35.0.0:$PATH"

if [ ! -f "$APP/local.properties" ]; then
  echo "sdk.dir=$ANDROID_HOME" > "$APP/local.properties"
fi

KEYSTORE="$APP/quickdoctor-release.jks"
if [ ! -f "$KEYSTORE" ]; then
  keytool -genkeypair -v -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 \
    -alias quickdoctor \
    -keystore "$KEYSTORE" \
    -storepass quickdoctor123 \
    -keypass quickdoctor123 \
    -dname "CN=QuickDoctor, OU=Mobile, O=QuickDoctor Medical Services ltd, L=Limerick, C=IE"
fi

cd "$APP"
./gradlew :app:assembleRelease --no-daemon

UNSIGNED="$APP/app/build/outputs/apk/release/app-release-unsigned.apk"
zipalign -f -p 4 "$UNSIGNED" /tmp/quickdoctor-aligned.apk
apksigner sign --ks "$KEYSTORE" --ks-key-alias quickdoctor \
  --ks-pass pass:quickdoctor123 --key-pass pass:quickdoctor123 \
  --out "$OUT" /tmp/quickdoctor-aligned.apk
apksigner verify "$OUT"
ls -lah "$OUT"
echo "APK ready: $OUT"
