# QuickDoctor.ie — VPS deploy

Domain: **quickdoctor.ie** → `195.201.90.178`

---

## Do NOT use the Hetzner web “Console” for the full script

That panel **cannot enter your sudo password**, so `bash deploy/vps-bootstrap.sh` fails with:

`sudo: a terminal is required to read the password`

Use **PuTTY** (recommended) or the **two-step web console** method below.

---

## Option A — PuTTY (recommended)

1. Download [PuTTY](https://www.putty.org/), connect to `195.201.90.178`, user `adminuser` (or `devuser` if that is your SSH user).
2. Paste:

```bash
export SITE_DOMAIN=quickdoctor.ie
git clone https://github.com/devsynxoffical/quickdoctor.git ~/quickdoctor 2>/dev/null || (cd ~/quickdoctor && git pull)
cd ~/quickdoctor
bash deploy/vps-bootstrap.sh
```

Enter your sudo password when asked. Wait 5–15 minutes.

---

## Option B — Hetzner web console (two steps)

Your VPS login is **`adminuser`** (not `devuser`). The web console often drops you in as `adminuser` — that is **not** root.

### Step 1 — KVM console as **root**

1. Hetzner Cloud → your server → **Console**
2. If you see a shell as `adminuser`, type **`logout`** or press Ctrl+D until you see:
   ```
   login:
   ```
3. Username: **`root`**  
   Password: your VPS **root** password (set at install, or reset in Hetzner panel)

Check:

```bash
whoami
```

Must print **`root`**. If it prints `adminuser`, you are on the wrong account.

Clone under `/root` (root cannot open `/home/adminuser` on some images):

```bash
cd ~
git clone https://github.com/devsynxoffical/quickdoctor.git quickdoctor 2>/dev/null || (cd quickdoctor && git pull)
cd ~/quickdoctor
export SITE_DOMAIN=quickdoctor.ie APP_USER=adminuser
bash deploy/vps-install-system.sh
```

`APP_USER=adminuser` puts secrets in `/home/adminuser/.quickdoctor-deploy-secrets` for step 2.

**Forgot root password?** Hetzner → server → **Rescue** → enable, reboot, use rescue password from panel, or reset root via support docs.

### Step 2 — Console as **adminuser**

Log out of root (`logout`), log in as **`adminuser`**.

```bash
cd ~/quickdoctor
git pull
bash deploy/vps-bootstrap-app.sh
```

No sudo in step 2.

---

## HTTPS

Use PuTTY or a console where sudo works:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d quickdoctor.ie -d www.quickdoctor.ie
```

---

## Verify

```bash
curl -s http://127.0.0.1:5000/health
pm2 status
```

Browser: https://quickdoctor.ie

---

## Demo logins (after seed)

| Role    | Email                   | Password    |
|---------|-------------------------|-------------|
| Patient | patient@quickdoctor.com | password123 |
| Doctor  | doctor@quickdoctor.com  | password123 |
| Admin   | admin@quickdoctor.com   | password123 |

---

## PM2 on reboot (optional, needs PuTTY + sudo)

```bash
sudo env PATH=$PATH pm2 startup systemd -u adminuser --hp /home/adminuser
pm2 save
```
