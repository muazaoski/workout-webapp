#!/bin/bash
# Workout Webapp Deployment Script for Debian VPS
# Run this on your VPS to deploy the application

set -e

APP_DIR="/opt/workout-webapp"
REPO_URL="https://github.com/muazaoski/workout-webapp.git"

echo "🚀 Starting Workout Webapp Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "⚠️  Docker installed. You may need to log out and back in for group changes."
fi

# Install Docker Compose plugin if not present
if ! docker compose version &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    sudo apt install -y docker-compose-plugin
fi

# Install git if not present
if ! command -v git &> /dev/null; then
    sudo apt install -y git
fi

# Clone or update repo
if [ -d "$APP_DIR" ]; then
    echo "📥 Updating existing installation..."
    cd $APP_DIR
    git pull origin master
else
    echo "📥 Cloning repository..."
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Create .env file if it doesn't exist
if [ ! -f "$APP_DIR/.env" ]; then
    echo "🔧 Creating environment file..."
    cat > $APP_DIR/.env << EOF
# Database password - CHANGE THIS!
DB_PASSWORD=$(openssl rand -base64 32 | tr -d '=+/')

# JWT Secret - CHANGE THIS!
JWT_SECRET=$(openssl rand -base64 64 | tr -d '=+/')
EOF
    echo "✅ Created .env with random secrets"
fi

# Build and start containers
echo "🏗️ Building and starting Docker containers..."
cd $APP_DIR
docker compose down --remove-orphans 2>/dev/null || true
docker compose up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Run database migrations
echo "🗃️ Running database migrations..."
docker compose exec -T api npx prisma migrate deploy || {
    echo "⚠️ Migration failed, trying to push schema..."
    docker compose exec -T api npx prisma db push
}

# Seed database
echo "🌱 Seeding database with default exercises..."
docker compose exec -T api npx tsx prisma/seed.ts || echo "⚠️ Seeding skipped (may already be done)"

# Check status
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Container status:"
docker compose ps
echo ""
echo "🌐 Your app should be running at:"
echo "   - Frontend: http://$(curl -s ifconfig.me):3000"
echo "   - API: http://$(curl -s ifconfig.me):3001/api/health"
echo ""
echo "🔧 To set up Cloudflare Tunnel for workout.muazaoski.online:"
echo "   cloudflared tunnel route dns <TUNNEL_NAME> workout.muazaoski.online"
echo "   cloudflared tunnel run <TUNNEL_NAME>"
echo ""
echo "📝 Useful commands:"
echo "   docker compose logs -f        # View logs"
echo "   docker compose restart        # Restart services"
echo "   docker compose down           # Stop services"
