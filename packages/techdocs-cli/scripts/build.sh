#!/bin/bash

# Copyright 2020 The Backstage Authors
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

# Build the TechDocs CLI
npx backstage-cli -- build --outputs cjs

# Make sure to do `yarn run build` in packages/embedded-techdocs before building here.

EMBEDDED_TECHDOCS_APP_PATH=../embedded-techdocs-app
TECHDOCS_PREVIEW_SOURCE=$EMBEDDED_TECHDOCS_APP_PATH/dist
TECHDOCS_PREVIEW_DEST=dist/techdocs-preview-bundle

# Build the embedded-techdocs-app
pushd $EMBEDDED_TECHDOCS_APP_PATH >/dev/null
yarn build
popd >/dev/null

cp -r $TECHDOCS_PREVIEW_SOURCE $TECHDOCS_PREVIEW_DEST

# Write to console
echo "[techdocs-cli]: Built the dist/ folder"
echo "[techdocs-cli]: Imported @backstage/plugin-techdocs dist/ folder into techdocs-preview-bundle/"
