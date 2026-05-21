# QuickDoctor — VPS deployment

Assumes Ubuntu 22/24, domain DNS already points to your VPS, and SSH access as a sudo user.

**Recommended layout**

| Service    | How it runs                          | Public URL              |
|-----------|--------------------------------------|-------------------------|
| Frontend  | Static files from `out/` (nginx)     | `https://yourdomain.com` |
| Backend   | Node + PM2 on `127.0.0.1:5000`     | `https://yourdomain.com/api` |
| Postgres  | Local or Docker on the VPS           | not public              |

---

## 1. Prepare the VPS

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx

# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 (keeps API running after reboot)
sudo npm install -g pm2

# PostgreSQL (option A — native)
sudo apt install -y postgresql postgresql-contrib

# OR use Docker only for DB (option B — from project backend folder)
# sudo apt install -y docker.io docker-compose-plugin
```

### Create database (native Postgres)

```bash
sudo -u postgres psql
```

```sql
CREATE USER quickdoctor WITH PASSWORD 'STRONG_PASSWORD_HERE';
CREATE DATABASE quickdoctor OWNER quickdoctor;
\q
```

---

## 2. Upload the project

**Option A — Git (recommended)**

```bash
cd /var/www
sudo mkdir -p quickdoctor && sudo chown $USER:$USER quickdoctor
cd quickdoctor
git clone YOUR_REPO_URL .
```

**Option B — ZIP from your PC**

Copy the project to the server (exclude `node_modules`, `.next`, `backend/node_modules`):

```powershell
# From your Windows machine (example with scp)
scp -r "d:\DEVSYNX- Projects\QuickDoctor" user@YOUR_VPS_IP:/var/www/quickdoctor
```

On the server:

```bash
cd /var/www/quickdoctor
```

---

## 3. Backend setup

```bash
cd /var/www/quickdoctor/backend
cp .env.example .env
nano .env
```

Example production `.env`:

```env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://quickdoctor:STRONG_PASSWORD_HERE@127.0.0.1:5432/quickdoctor?schema=public"
JWT_SECRET="generate-a-long-random-string-at-least-32-chars"
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
RESEND_API_KEY=
EMAIL_FROM=QuickDoctor <noreply@yourdomain.com>
```

Install, migrate DB, build, start:

```bash
npm ci
npx prisma generate
npx prisma db push
npx prisma db seed   # optional demo users; skip in real production if you prefer

npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # run the command it prints, then pm2 save again
```

Check API locally on the server:

```bash
curl http://127.0.0.1:5000/health
```

---

## 4. Frontend build (static export)

The app is configured for **static export** (`out/` folder). Set the API URL **before** building (it is baked into the JS).

```bash
cd /var/www/quickdoctor
nano .env.production
```

```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

Build:

```bash
npm ci
npm run build
```

If the build fails on dynamic routes (e.g. `/doctors/[id]`), either add doctor IDs to `generateStaticParams` or switch to Node hosting (see **Appendix B** below).

Copy static site for nginx:

```bash
sudo mkdir -p /var/www/quickdoctor-web
sudo cp -r out/* /var/www/quickdoctor-web/
sudo chown -R www-data:www-data /var/www/quickdoctor-web
```

---

## 5. Nginx (domain + API proxy)

```bash
sudo nano /etc/nginx/sites-available/quickdoctor
```

Use the example in `deploy/nginx-quickdoctor.conf` (replace `yourdomain.com`).

Enable site and SSL:

```bash
sudo ln -s /etc/nginx/sites-available/quickdoctor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 6. Post-deploy checklist

- [ ] `https://yourdomain.com` loads the site
- [ ] On the server: `curl http://127.0.0.1:5000/health` returns `"status":"ok"`
- [ ] Login works (CORS: `FRONTEND_URL` must match the exact browser origin, including `https://`)
- [ ] Stripe webhook endpoint: `https://yourdomain.com/api/webhooks/stripe` (raw body — already mounted before JSON parser)
- [ ] Change default seed passwords if you ran `prisma db seed`
- [ ] Firewall: `sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable`

---

## 7. Updates (redeploy)

```bash
cd /var/www/quickdoctor
git pull   # or upload new files

# Backend
cd backend
npm ci
npx prisma generate
npx prisma db push
npm run build
pm2 restart quickdoctor-api

# Frontend
cd ..
export $(grep -v '^#' .env.production | xargs)  # load NEXT_PUBLIC_API_URL
npm ci
npm run build
sudo cp -r out/* /var/www/quickdoctor-web/
```

---

## Appendix A — Docker Postgres only on VPS

```bash
cd /var/www/quickdoctor/backend
docker compose up -d
# DATABASE_URL in .env:
# postgresql://user:password@127.0.0.1:5432/quickdoctor?schema=public
```

---

## Appendix B — Run Next.js with Node instead of static export

If you need full dynamic SSR or build issues with `output: "export"`:

1. In `next.config.ts`, remove `output: "export"` and the `images.unoptimized` block if you use the image optimizer.
2. Build with `NEXT_PUBLIC_API_URL=https://yourdomain.com/api`
3. Run `pm2 start npm --name quickdoctor-web -- start` on port 3000
4. Nginx: `location / { proxy_pass http://127.0.0.1:3000; }` and keep `/api` proxy to port 5000

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| CORS errors | `FRONTEND_URL` in backend `.env` must equal the site URL (e.g. `https://yourdomain.com`, no trailing slash) |
| API 502 | `pm2 logs quickdoctor-api`, check Postgres `DATABASE_URL` |
| Blank page / old API URL | Rebuild frontend after changing `NEXT_PUBLIC_API_URL` |
| Stripe webhook fails | Use HTTPS; set webhook URL to `/api/webhooks/stripe`; verify `STRIPE_WEBHOOK_SECRET` |
