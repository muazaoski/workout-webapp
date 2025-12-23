# Workout Counter - VPS Deployment Guide

## Quick Deploy

SSH into your VPS and run:

```bash
curl -fsSL https://raw.githubusercontent.com/muazaoski/workout-webapp/master/deploy.sh | bash
```

Or manually:

```bash
# Clone the repo
git clone https://github.com/muazaoski/workout-webapp.git /opt/workout-webapp
cd /opt/workout-webapp

# Create environment file
cp .env.example .env
nano .env  # Edit with secure values

# Start with Docker
docker compose up -d --build

# Run migrations
docker compose exec api npx prisma migrate deploy
docker compose exec api npx tsx prisma/seed.ts
```

## Configure Cloudflare Tunnel

1. **Install cloudflared** (if not installed):
   ```bash
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared.deb
   ```

2. **Login to Cloudflare**:
   ```bash
   cloudflared tunnel login
   ```

3. **Create tunnel** (if you don't have one):
   ```bash
   cloudflared tunnel create workout-tunnel
   ```

4. **Create config** at `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: YOUR_TUNNEL_ID
   credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json
   
   ingress:
     - hostname: workout.muazaoski.online
       service: http://localhost:3000
     - service: http_status:404
   ```

5. **Route DNS**:
   ```bash
   cloudflared tunnel route dns workout-tunnel workout.muazaoski.online
   ```

6. **Run tunnel as service**:
   ```bash
   sudo cloudflared service install
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_PASSWORD` | PostgreSQL password | `workout_password` |
| `JWT_SECRET` | JWT signing secret | (random) |

## Updating

```bash
cd /opt/workout-webapp
git pull origin master
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
```

## Troubleshooting

### View logs
```bash
docker compose logs -f
docker compose logs api -f
docker compose logs db -f
```

### Restart services
```bash
docker compose restart
```

### Reset database
```bash
docker compose down -v  # WARNING: Deletes all data
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
docker compose exec api npx tsx prisma/seed.ts
```
