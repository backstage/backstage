#!/bin/bash

# Copyright 2021 The Backstage Authors
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

SCRIPT_DIR=$(dirname $0)
TECHDOCS_CLI_DIR="$SCRIPT_DIR"/..
TECHDOCS_CLI_EMBEDDED_APP_DIR="$TECHDOCS_CLI_DIR"/../embedded-techdocs-app

compile_and_build_cli() {
  echo "📄 Compiling..."
  yarn workspace @techdocs/cli tsc > /dev/null
  echo "📦️ Building..."
  pushd $TECHDOCS_CLI_DIR > /dev/null
  npx backstage-cli build --outputs cjs > /dev/null
  popd > /dev/null
}

build_and_embed_app() {
  echo "🚚 Embedding app..."
  if [ "$TECHDOCS_CLI_DEV_MODE" = "true" ] ; then
    yarn workspace embedded-techdocs-app build:dev > /dev/null
  else
    yarn workspace embedded-techdocs-app build > /dev/null
  fi
  cp -r "$TECHDOCS_CLI_EMBEDDED_APP_DIR"/dist "$TECHDOCS_CLI_DIR"/dist/techdocs-preview-bundle > /dev/null
}

compile_and_build_cli
build_and_embed_app
echo "🏁 Ready!"
