#!/usr/bin/env bash
# Builds the lazy demo plugins as module federation remotes and copies them
# into the dynamic plugins root that the example backend serves them from.
set -euo pipefail

root="$(cd "$(dirname "$0")/../../.." && pwd)"
target="$root/packages/backend/dist/dynamic-plugins-root"

rm -rf "$target"
for name in lazy-demo lazy-scorecard; do
  plugin="$root/plugins/$name"
  (cd "$plugin" && yarn backstage-cli package build --module-federation)
  mkdir -p "$target/$name"
  cp "$plugin/package.json" "$target/$name/package.json"
  cp -R "$plugin/dist" "$target/$name/dist"
done
