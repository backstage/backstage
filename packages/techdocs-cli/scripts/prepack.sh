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
TECHDOCS_CLI_EMBEDDED_APP_DIR="$TECHDOCS_CLI_DIR"/../techdocs-cli-embedded-app

echo "🚚 Copying embedded app into dist/embedded-app"
rm -rf "$TECHDOCS_CLI_DIR"/dist/embedded-app
cp -r "$TECHDOCS_CLI_EMBEDDED_APP_DIR"/dist "$TECHDOCS_CLI_DIR"/dist/embedded-app
echo "🏁 Finished copying embedded app into dist/embedded-app!"
