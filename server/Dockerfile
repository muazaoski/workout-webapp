FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy built files
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package*.json ./

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "dist/index.js"]
