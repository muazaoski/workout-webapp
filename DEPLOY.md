# Workout Counter - VPS Deployment Guide
# Works alongside your existing froggame setup

## Quick Deploy

### On Your VPS:

```bash
# SSH into VPS
ssh debian@51.79.161.63
sudo -i

# Clone workout app
cd /opt/apps
git clone https://github.com/muazaoski/workout-webapp.git
cd workout-webapp

# Create .env with secure secrets
cat > .env << EOF
DB_PASSWORD=$(openssl rand -base64 32 | tr -d '=+/')
JWT_SECRET=$(openssl rand -base64 64 | tr -d '=+/')
EOF

# Start the containers
docker compose up -d --build

# Run database setup
docker compose exec api npx prisma migrate deploy
docker compose exec api npx tsx prisma/seed.ts
```

### Add to Froggame's Caddyfile:

```bash
# Edit froggame's Caddyfile
nano /opt/apps/froggame/Caddyfile
```

Add this block:
```
workout.muazaoski.online {
    handle /api/* {
        reverse_proxy workout-api:3001
    }
    
    handle {
        reverse_proxy workout-frontend:80
    }
}
```

Then restart Caddy:
```bash
cd /opt/apps/froggame
docker compose restart caddy
```

---

## DNS Configuration (Cloudflare)

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | workout | 51.79.161.63 | **DNS only** (gray cloud) |

---

## Updating After Code Changes

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

## Common Commands

```bash
# View logs
docker compose logs -f
docker compose logs -f api
docker compose logs -f frontend

# Restart
docker compose restart

# Full rebuild
docker compose down
docker compose build --no-cache
docker compose up -d

# Database shell
docker compose exec db psql -U workout -d workout_db
```

---

## File Locations

| Path | Purpose |
|------|---------|
| `/opt/apps/workout-webapp/` | Main app directory |
| `/opt/apps/workout-webapp/.env` | Environment variables |
| `/opt/apps/froggame/Caddyfile` | Reverse proxy config (shared) |

---

## Architecture

```
Traffic Flow:
User → Caddy (from froggame, port 443) 
     → workout-frontend:80 (static files)
     → workout-api:3001 (/api/* requests)
     → workout-db:5432 (PostgreSQL)
```

Both apps share the same Caddy instance for HTTPS.

---

## Troubleshooting

### Containers not connecting?
```bash
# Check network
docker network ls
docker network inspect froggame_default

# Make sure workout containers are on the network
docker compose down
docker compose up -d
```

### Database issues?
```bash
# Reset database
docker compose down -v  # WARNING: Deletes all data!
docker compose up -d
docker compose exec api npx prisma migrate deploy
docker compose exec api npx tsx prisma/seed.ts
```

---

🎉 **Done!** App at: https://workout.muazaoski.online
