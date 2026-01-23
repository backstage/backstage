#!/usr/bin/env node
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

/* eslint-disable @backstage/no-undeclared-imports */

// This script is used to audit the list of plugins in the Plugin Directory: https://backstage.io/plugins

const { resolve } = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

async function getNpmPackage(npmPackageName) {
  const response = await fetch(`https://registry.npmjs.com/${npmPackageName}`);
  const json = await response.json();
  return json;
}

function getAge(npmModified) {
  const ageDif = Date.now() - new Date(npmModified).getTime();
  return Math.round(ageDif / (1000 * 60 * 60 * 24));
}

async function main() {
  const rootPath = resolve(__dirname, '..');
  const pluginDataPath = resolve(rootPath, 'microsite/data/plugins');

  console.log(__dirname, rootPath, pluginDataPath);

  const pluginDataFiles = fs.readdirSync(pluginDataPath);

  const pluginsData = [];
  for (const pluginDataFile of pluginDataFiles) {
    const pluginDataFilePath = resolve(pluginDataPath, pluginDataFile);
    const pluginDataYaml = yaml.load(
      fs.readFileSync(pluginDataFilePath, { encoding: 'utf-8' }),
    );

    console.log(
      `Auditing - ${pluginDataYaml.title} by ${pluginDataYaml.author} - ${pluginDataYaml.npmPackageName}`,
    );

    const npmPackage = await getNpmPackage(pluginDataYaml.npmPackageName);

    const pluginData = {
      npmPackageName: pluginDataYaml.npmPackageName,
      npmCreated: npmPackage.time?.created,
      npmModified: npmPackage.time?.modified,
      age: getAge(npmPackage.time?.modified),
    };

    pluginsData.push(pluginData);
  }

  console.table(pluginsData);
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
