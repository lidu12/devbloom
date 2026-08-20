# DevBloom Academy - Deployment Guide 🚀

This document provides step-by-step instructions for deploying **DevBloom Academy** to various hosting platforms (Render, Railway, Docker, Linux VPS, Vercel/Netlify).

---

## 📋 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [Environment Variables](#-environment-variables)
3. [Local Production Test](#-local-production-test)
4. [Deployment Options](#-deployment-options)
   - [Option A: Render (Recommended)](#option-a-render-recommended)
   - [Option B: Railway](#option-b-railway)
   - [Option C: Docker Container](#option-c-docker-container)
   - [Option D: Ubuntu Linux VPS (PM2 + Nginx)](#option-d-ubuntu-linux-vps-pm2--nginx)
5. [Verification & Health Check](#-verification--health-check)

---

## 🏗 Architecture Overview

DevBloom Academy is a unified full-stack web application:
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express (`server.ts`)
- **Database**: Local JSON storage (`data/db.json`)
- **AI Integration**: Google Gemini API (`@google/genai`)

When built (`npm run build`), Vite compiles the React SPA into static assets inside `dist/`, and `esbuild` bundles `server.ts` into `dist/server.cjs`. In production mode (`NODE_ENV=production`), Express serves both the REST API and the frontend SPA assets.

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `GEMINI_API_KEY` | **Yes** (for AI features) | *None* | Google Gemini API Key for Bloom AI Mentor & Project Reviewer |
| `NODE_ENV` | Yes | `production` | Set to `production` when deployed |
| `PORT` | No | `3000` | Port for the Express server to listen on |

---

## 🧪 Local Production Test

Before deploying, verify the production build locally:

```bash
# 1. Install dependencies
npm install

# 2. Build frontend and backend bundles
npm run build

# 3. Start the production server
NODE_ENV=production GEMINI_API_KEY="your_api_key_here" npm start
```

Visit `http://localhost:3000` to confirm everything is running properly.

---

## 🌐 Deployment Options

### Option A: Render (Recommended)

Render provides seamless support for Node.js web services with optional persistent disks.

1. **Push your code to GitHub**:
   Make sure your code is pushed to your GitHub repository:
   `https://github.com/lidu12/devbloom.git`

2. **Create a Web Service on Render**:
   - Log into [Render Dashboard](https://dashboard.render.com/).
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository `lidu12/devbloom`.

3. **Configure Settings**:
   - **Name**: `devbloom-academy`
   - **Environment**: `Node`
   - **Region**: Select closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Add Environment Variables**:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: `your_gemini_api_key_here`

5. **(Optional) Attach Persistent Disk**:
   - Go to **Disks** in Render dashboard.
   - Mount path: `/app/data` (to persist `db.json` across deploys).

6. Click **Deploy Web Service**.

---

### Option B: Railway

Railway offers single-click deployments with automatic environment variable injection.

1. Go to [Railway Dashboard](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select `lidu12/devbloom`.
4. Add **Variables**:
   - `GEMINI_API_KEY` = `your_gemini_api_key_here`
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
5. Railway will automatically detect Node.js, run `npm run build`, and execute `npm start`.

---

### Option C: Docker Container

You can package and deploy DevBloom Academy using Docker.

#### 1. Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and production node_modules
COPY package*.json ./
RUN npm ci --only=production

# Copy built dist files and data directory from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
```

#### 2. Build & Run Docker Container:

```bash
# Build the Docker image
docker build -t devbloom-academy .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e GEMINI_API_KEY="your_api_key_here" \
  -e NODE_ENV="production" \
  -v devbloom-data:/app/data \
  --name devbloom \
  devbloom-academy
```

---

### Option D: Ubuntu Linux VPS (PM2 + Nginx)

For self-hosting on AWS EC2, DigitalOcean droplet, or any Linux VPS:

#### 1. Clone & Build
```bash
git clone https://github.com/lidu12/devbloom.git /var/www/devbloom
cd /var/www/devbloom
npm install
npm run build
```

#### 2. Setup PM2 Process Manager
```bash
# Install PM2 globally
sudo npm install -g pm2

# Create ecosystem configuration or start directly
GEMINI_API_KEY="your_api_key" NODE_ENV=production pm2 start dist/server.cjs --name "devbloom"

# Save PM2 process list to start on boot
pm2 save
pm2 startup
```

#### 3. Configure Nginx Reverse Proxy (`/etc/nginx/sites-available/devbloom`)
```nginx
server {
    listen 80;
    server_name yourdomain.com; # or server IP

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site and reload nginx
sudo ln -s /etc/nginx/sites-available/devbloom /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🩺 Verification & Health Check

After deployment, verify that the application and API server are functioning correctly:

1. **Web App**: Open your deployment URL in a web browser.
2. **Health Check Endpoint**: Query the API health check:
   ```bash
   curl https://your-app-url.com/api/health
   ```
   **Expected Response**:
   ```json
   {
     "status": "ok",
     "geminiAvailable": true
   }
   ```

---

## 📌 Summary of Git Commands to Commit Deployment Guide

To push this deployment guide to your GitHub repository, run:

```bash
git add DEPLOYMENT.md
git commit -m "docs: add comprehensive deployment guide"
git push origin main
```
