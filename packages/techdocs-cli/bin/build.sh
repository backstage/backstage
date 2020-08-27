#!/bin/bash

# Copyright 2020 Spotify AB
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -e

TECHDOCS_PREVIEW_SOURCE=../../plugins/techdocs/dist
TECHDOCS_PREVIEW_DEST=../../packages/techdocs-cli/dist/techdocs-preview-bundle

# Build the CLI
yarn run backstage-cli -- build --outputs cjs

# Create export of the TechDocs plugin
APP_CONFIG_techdocs_storageUrl='"http://localhost:3000/api"' yarn workspace @backstage/plugin-techdocs export

# Copy over export to techdocs-cli dist/ folder
cp -r $TECHDOCS_PREVIEW_SOURCE $TECHDOCS_PREVIEW_DEST

# Write to console
echo "[techdocs-cli]: Built the dist/ folder"
echo "[techdocs-cli]: Imported @backstage/plugin-techdocs dist/ folder into techdocs-preview-bundle/"
