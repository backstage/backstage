#!/bin/bash

# Script to create a symlinked css directory for development

# Exit on error
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Ensure target CSS directory exists
mkdir -p "$PACKAGE_ROOT/css"

# Remove any existing content in the css directory
rm -rf "$PACKAGE_ROOT/css/"*

echo "Creating symlinks for CSS files..."

# Create symlinks for each CSS file
for cssFile in "$PACKAGE_ROOT/src/css/"*.css; do
  filename=$(basename "$cssFile")
  ln -sf "../src/css/$filename" "$PACKAGE_ROOT/css/$filename"
  echo "- Linked: $filename"
done

echo "Setup complete. CSS files are now accessible from both paths:"
echo "- @backstage/canon/src/css/..."
echo "- @backstage/canon/css/..."

