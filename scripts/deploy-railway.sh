#!/usr/bin/env bash
# Deploy Backstage to Railway.
#
# Usage:
#   ./scripts/deploy-railway.sh           # build + deploy
#   ./scripts/deploy-railway.sh --skip-build  # deploy using existing dist artifacts
#
# Requires: railway CLI (`brew install railway`) and `railway link` already run in this repo.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SKIP_BUILD=false
for arg in "$@"; do
  [[ "$arg" == "--skip-build" ]] && SKIP_BUILD=true
done

# ── 1. Resolve Railway project from the linked config ────────────────────────
RAILWAY_CONFIG="$HOME/.railway/config.json"
if [[ ! -f "$RAILWAY_CONFIG" ]]; then
  echo "ERROR: No Railway config found at $RAILWAY_CONFIG. Run 'railway link' first." >&2
  exit 1
fi

PROJECT_ID=$(python3 -c "
import json, sys
c = json.load(open('$RAILWAY_CONFIG'))
p = c.get('projects', {}).get('$ROOT', {})
print(p.get('project', ''))
")
SERVICE_ID=$(python3 -c "
import json, sys
c = json.load(open('$RAILWAY_CONFIG'))
p = c.get('projects', {}).get('$ROOT', {})
print(p.get('service', ''))
")
ENVIRONMENT_ID=$(python3 -c "
import json, sys
c = json.load(open('$RAILWAY_CONFIG'))
p = c.get('projects', {}).get('$ROOT', {})
print(p.get('environment', ''))
")

if [[ -z "$PROJECT_ID" || -z "$SERVICE_ID" || -z "$ENVIRONMENT_ID" ]]; then
  echo "ERROR: Could not read project/service/environment IDs from $RAILWAY_CONFIG." >&2
  echo "       Make sure you have run 'railway link' inside this repository." >&2
  exit 1
fi

echo "→ Project:     $PROJECT_ID"
echo "→ Service:     $SERVICE_ID"
echo "→ Environment: $ENVIRONMENT_ID"

# ── 2. Build backend artifacts ────────────────────────────────────────────────
if [[ "$SKIP_BUILD" == false ]]; then
  echo ""
  echo "→ Building backend artifacts…"
  cd "$ROOT"
  yarn build:backend
else
  echo ""
  echo "→ Skipping build (--skip-build)"
fi

# Verify artifacts exist
if [[ ! -f "$ROOT/packages/backend/dist/bundle.tar.gz" || ! -f "$ROOT/packages/backend/dist/skeleton.tar.gz" ]]; then
  echo "ERROR: dist artifacts not found. Run without --skip-build." >&2
  exit 1
fi

# ── 3. Assemble staging directory ─────────────────────────────────────────────
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

echo ""
echo "→ Assembling staging directory…"

# Yarn (needed for `yarn workspaces focus --production` inside Docker)
cp "$ROOT/.yarnrc.yml"  "$STAGE/"
cp "$ROOT/yarn.lock"    "$STAGE/"
cp "$ROOT/package.json" "$STAGE/"
mkdir -p "$STAGE/.yarn/releases" "$STAGE/.yarn/patches"
cp -r "$ROOT/.yarn/releases/." "$STAGE/.yarn/releases/"
cp -r "$ROOT/.yarn/patches/."  "$STAGE/.yarn/patches/"

# Pre-built backend artifacts
mkdir -p "$STAGE/packages/backend/dist"
cp "$ROOT/packages/backend/dist/skeleton.tar.gz" "$STAGE/packages/backend/dist/"
cp "$ROOT/packages/backend/dist/bundle.tar.gz"   "$STAGE/packages/backend/dist/"

# Frontend app config (served by the backend at runtime)
mkdir -p "$STAGE/packages/app"
cp "$ROOT/packages/app/app-config.yaml" "$STAGE/packages/app/"

# App configs and catalog
cp "$ROOT/app-config.yaml"         "$STAGE/"
cp "$ROOT/app-config.railway.yaml" "$STAGE/"
cp "$ROOT/catalog-blitzy-sandbox.yaml" "$STAGE/"

# Docker / Railway config
cp "$ROOT/Dockerfile.railway"            "$STAGE/Dockerfile.railway"
cp "$ROOT/Dockerfile.railway.dockerignore" "$STAGE/.dockerignore"
cp "$ROOT/railway.toml"                  "$STAGE/"

echo "   Staging size: $(du -sh "$STAGE" | cut -f1)"

# ── 4. Deploy ─────────────────────────────────────────────────────────────────
echo ""
echo "→ Deploying to Railway…"
cd "$STAGE"
railway up \
  --project     "$PROJECT_ID" \
  --service     "$SERVICE_ID" \
  --environment "$ENVIRONMENT_ID" \
  --no-gitignore \
  --ci

echo ""
echo "✓ Deployment complete."
