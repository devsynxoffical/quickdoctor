# QuickDoctor.ie — VPS deploy

Domain: **quickdoctor.ie** → `195.201.90.178`

---

## Do NOT use the Hetzner web “Console” for the full script

That panel **cannot enter your sudo password**, so `bash deploy/vps-bootstrap.sh` fails with:

`sudo: a terminal is required to read the password`

Use **PuTTY** (recommended) or the **two-step web console** method below.

---

## Option A — PuTTY (recommended)

1. Download [PuTTY](https://www.putty.org/), connect to `195.201.90.178`, user `devuser`.
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

You already cloned the repo to `~/quickdoctor`. **Pull latest** (new scripts):

### Step 1 — Console as **root**

In Hetzner: open console → log in as **`root`** (not `devuser`).

Check you are root (must print `root`):

```bash
whoami
```

Root often **cannot** `cd` into `/home/devuser/...` on hardened VPS images. Clone under `/root` instead:

```bash
cd ~
git clone https://github.com/devsynxoffical/quickdoctor.git quickdoctor 2>/dev/null || (cd quickdoctor && git pull)
cd ~/quickdoctor
export SITE_DOMAIN=quickdoctor.ie
bash deploy/vps-install-system.sh
```

### Step 2 — Console as **devuser**

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
sudo env PATH=$PATH pm2 startup systemd -u devuser --hp /home/devuser
pm2 save
```
