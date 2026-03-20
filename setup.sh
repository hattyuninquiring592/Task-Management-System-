#!/bin/bash

# TaskFlow — One-command setup script
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "  ████████╗ █████╗ ███████╗██╗  ██╗███████╗██╗      ██████╗ ██╗    ██╗"
echo "     ██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝██║     ██╔═══██╗██║    ██║"
echo "     ██║   ███████║███████╗█████╔╝ █████╗  ██║     ██║   ██║██║ █╗ ██║"
echo "     ██║   ██╔══██║╚════██║██╔═██╗ ██╔══╝  ██║     ██║   ██║██║███╗██║"
echo "     ██║   ██║  ██║███████║██║  ██╗██║     ███████╗╚██████╔╝╚███╔███╔╝"
echo "     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ "
echo -e "${NC}"
echo -e "${GREEN}Task Management System — Setup Script${NC}"
echo "========================================="
echo ""

# ── Backend ──────────────────────────────────
echo -e "${YELLOW}[1/5] Installing backend dependencies...${NC}"
cd backend
npm install --silent

echo -e "${YELLOW}[2/5] Setting up backend .env...${NC}"
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  ✅ Created backend/.env from .env.example"
  echo "  ⚠️  Please update JWT secrets in backend/.env before production use!"
else
  echo "  ℹ️  backend/.env already exists, skipping."
fi

echo -e "${YELLOW}[3/5] Setting up database...${NC}"
npx prisma generate --silent
npx prisma migrate dev --name init --skip-seed 2>/dev/null || npx prisma db push
echo "  ✅ Database ready"

# ── Frontend ─────────────────────────────────
cd ../frontend
echo -e "${YELLOW}[4/5] Installing frontend dependencies...${NC}"
npm install --silent

echo -e "${YELLOW}[5/5] Setting up frontend .env...${NC}"
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "  ✅ Created frontend/.env.local"
else
  echo "  ℹ️  frontend/.env.local already exists, skipping."
fi

cd ..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "To start the application, open TWO terminal tabs:"
echo ""
echo -e "  ${BLUE}Terminal 1 (Backend):${NC}"
echo "    cd task-manager/backend && npm run dev"
echo ""
echo -e "  ${BLUE}Terminal 2 (Frontend):${NC}"
echo "    cd task-manager/frontend && npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser."
echo ""
