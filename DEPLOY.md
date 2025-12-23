# Workout Counter - VPS Deployment Guide

## VPS Details
- **IP:** 51.79.161.63
- **User:** debian
- **Domain:** workout.muazaoski.online
- **App Directory:** /opt/apps/workout-webapp

---

## Quick Connect

```bash
ssh debian@51.79.161.63
sudo -i
cd /opt/apps/workout-webapp
```

---

## ⚠️ IMPORTANT: Use `docker compose` (with SPACE)

```bash
# ✅ Correct
docker compose up -d

# ❌ Wrong
docker-compose up -d
```

---

## 🚀 First Time Deployment

### 1. Clone Repository

```bash
sudo -i
cd /opt/apps
git clone https://github.com/muazaoski/workout-webapp.git
cd workout-webapp
```

### 2. Create Environment File

```bash
cat > .env << EOF
DB_PASSWORD=$(openssl rand -base64 32 | tr -d '=+/')
JWT_SECRET=$(openssl rand -base64 64 | tr -d '=+/')
EOF
```

### 3. Build and Start

```bash
docker compose up -d --build
```

### 4. Setup Database

```bash
docker compose exec api npx prisma db push
docker compose exec api npx tsx prisma/seed.ts
```

### 5. Add to Froggame's Caddyfile

```bash
nano /opt/apps/froggame/Caddyfile
```

Add this block at the end:
```
workout.muazaoski.online {
    reverse_proxy 172.17.0.1:3080
}
```

Save (`Ctrl+O`, Enter, `Ctrl+X`)

### 6. Restart Froggame's Caddy

```bash
cd /opt/apps/froggame
docker compose restart caddy
```

### 7. Add DNS in Cloudflare

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | workout | 51.79.161.63 | **DNS only** (gray cloud) |

---

## 🔄 Updating After Code Changes

### On Local Machine (Windows):

```powershell
npm run build
git add .
git commit -m "Your message"
git push
```

### On VPS:

```bash
sudo -i
cd /opt/apps/workout-webapp

# Pull and rebuild
git fetch origin
git reset --hard origin/master
docker compose build --no-cache
docker compose up -d

# Check status
docker compose ps
docker compose logs -f
```

---

## 📊 Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f frontend
docker compose logs -f db

# Last 100 lines
docker compose logs --tail=100
```

---

## Common Commands

```bash
# View running containers
docker compose ps

# Stop everything
docker compose down

# Restart (quick, no rebuild)
docker compose restart

# Rebuild after code changes
docker compose down
docker compose build --no-cache
docker compose up -d

# Database shell
docker compose exec db psql -U workout -d workout_db

# Run migrations
docker compose exec api npx prisma db push

# Re-seed database
docker compose exec api npx tsx prisma/seed.ts
```

---

## Troubleshooting

### 502 Bad Gateway?
Check if containers are running:
```bash
docker compose ps
curl http://localhost:3080
```

### Database issues?
```bash
# Reset database (WARNING: deletes all data!)
docker compose down -v
docker compose up -d
docker compose exec api npx prisma db push
docker compose exec api npx tsx prisma/seed.ts
```

### Caddy syntax errors?
```bash
cd /opt/apps/froggame
docker compose logs caddy --tail=20
```

### Changes not appearing?
```bash
git fetch origin
git reset --hard origin/master
docker compose build --no-cache
docker compose up -d
```

---

## Architecture

```
Traffic Flow:
User → Froggame's Caddy (port 443) 
     → workout-caddy (port 3080) 
     → workout-frontend:80 / workout-api:3001
     → workout-db:5432

File Locations:
/opt/apps/workout-webapp/     - App directory
/opt/apps/workout-webapp/.env - Environment variables
/opt/apps/froggame/Caddyfile  - Reverse proxy config (shared)
```

---

## 🎉 Done!

App accessible at: **https://workout.muazaoski.online**
