#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <SUPABASE_DATABASE_URL>" >&2
  exit 1
fi

SUPABASE_URL="$1"
API_DIR="$(cd "$(dirname "$0")/.." && pwd)/apps/api"

if [ ! -d "$API_DIR" ]; then
  echo "API directory not found at $API_DIR" >&2
  exit 1
fi

cd "$API_DIR"
cp -n .env.example .env || true
if grep -q '^DATABASE_URL=' .env; then
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$SUPABASE_URL|" .env
else
  echo "DATABASE_URL=$SUPABASE_URL" >> .env
fi

npm i
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts || true

echo "Supabase configured and database seeded."