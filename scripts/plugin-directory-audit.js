#!/usr/bin/env node
/* eslint-disable @backstage/no-undeclared-imports */
/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This script is used to audit the list of plugins in the Plugin Directory: https://backstage.io/plugins

// Read all the plugin YAML files in microsite/data/plugins
// Build up an nice object to work with
// validate the NPM package and pull down: latest version, created, modified
// validate the docs still load
// output: title, author, latest version, created, modified, docs status, time since last update

// https://registry.npmjs.com/@backstage-community/plugin-azure-devops-backend

const { resolve } = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function main() {
  const rootPath = resolve(__dirname, '..');
  const pluginDataPath = resolve(rootPath, 'microsite/data/plugins');

  const pluginDataFiles = fs.readdirSync(pluginDataPath);

  const pluginData = [];
  for (const pluginDataFile of pluginDataFiles) {
    const pluginDataYaml = yaml.load(
      fs.readFileSync(pluginDataFile, { encoding: 'utf-8' }),
    );
    pluginData.push(pluginDataYaml);
  }

  console.table(pluginData);
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
