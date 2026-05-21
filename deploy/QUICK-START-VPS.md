# QuickDoctor.ie — VPS one-shot deploy

Domain: **quickdoctor.ie** (DNS → `195.201.90.178`)

## 1. Connect with PuTTY

- Host: `195.201.90.178`
- User: `devuser`
- Use your password (change it after deploy — do not share in chat)

## 2. Paste this entire block in the SSH terminal

```bash
export SITE_DOMAIN=quickdoctor.ie

git clone https://github.com/devsynxoffical/quickdoctor.git ~/quickdoctor 2>/dev/null || (cd ~/quickdoctor && git pull)
cd ~/quickdoctor
bash deploy/vps-bootstrap.sh
```

Wait 5–15 minutes (npm install + builds).

## 3. HTTPS (SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d quickdoctor.ie -d www.quickdoctor.ie
```

Follow prompts (email, agree, redirect HTTP→HTTPS: **Yes**).

## 4. Verify

```bash
curl -s http://127.0.0.1:5000/health
pm2 status
```

In browser:

- https://quickdoctor.ie
- https://quickdoctor.ie/api (may 404 on root — normal; use `/health` on server)

## 5. Demo logins (if you ran seed)

| Role    | Email                     | Password    |
|---------|---------------------------|-------------|
| Patient | patient@quickdoctor.com   | password123 |
| Doctor  | doctor@quickdoctor.com  | password123 |
| Admin   | admin@quickdoctor.com   | password123 |

Change these in production.

## 6. Secrets file on server

After bootstrap, DB password is printed once. Also see:

```bash
cat ~/quickdoctor/backend/.env
```

Add Stripe keys when ready:

```bash
nano ~/quickdoctor/backend/.env
pm2 restart quickdoctor-api
```

## 7. Change VPS password (important)

```bash
passwd
```

Also change password in your hosting panel (Hetzner/etc.).
