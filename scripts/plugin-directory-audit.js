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

const { resolve } = require('node:path');
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

async function main(args) {
  const rootPath = resolve(__dirname, '..');
  const pluginDataPath = resolve(rootPath, 'microsite/data/plugins');

  const auditMode = args.includes('--audit');

  console.log(__dirname, rootPath, pluginDataPath);
  if (auditMode) {
    console.log('Running in AUDIT mode - will update plugin YAML files');
  }

  const pluginDataFiles = fs.readdirSync(pluginDataPath);

  const pluginsData = [];
  const updatedPlugins = [];

  for (const pluginDataFile of pluginDataFiles) {
    const pluginDataFilePath = resolve(pluginDataPath, pluginDataFile);
    const pluginDataYaml = yaml.load(
      fs.readFileSync(pluginDataFilePath, { encoding: 'utf-8' }),
    );

    console.log(
      `Auditing - ${pluginDataYaml.title} by ${pluginDataYaml.author} - ${pluginDataYaml.npmPackageName}`,
    );

    const npmPackage = await getNpmPackage(pluginDataYaml.npmPackageName);
    const age = getAge(npmPackage.time?.modified);

    const pluginData = {
      npmPackageName: pluginDataYaml.npmPackageName,
      npmCreated: npmPackage.time?.created,
      npmModified: npmPackage.time?.modified,
      age: age,
      currentStatus: pluginDataYaml.status,
    };

    // Update plugin YAML if in audit mode
    if (auditMode) {
      let newStatus = pluginDataYaml.status;
      let statusChanged = false;

      // If status is inactive, change to archived
      if (pluginDataYaml.status === 'inactive') {
        newStatus = 'archived';
        statusChanged = true;
      }
      // If age > 365 and status is active, change to inactive
      else if (age > 365 && pluginDataYaml.status === 'active') {
        newStatus = 'inactive';
        statusChanged = true;
      }

      if (statusChanged) {
        pluginDataYaml.status = newStatus;
        pluginDataYaml.age = age;

        // Write updated YAML back to file
        const yamlContent = yaml.dump(pluginDataYaml, {
          lineWidth: -1,
          quotingType: "'",
          forceQuotes: false,
        });
        fs.writeFileSync(pluginDataFilePath, `---\n${yamlContent}`);

        updatedPlugins.push({
          file: pluginDataFile,
          plugin: pluginDataYaml.title,
          oldStatus: pluginData.currentStatus,
          newStatus: newStatus,
          age: age,
        });

        console.log(
          `  ✓ Updated ${pluginDataFile}: ${pluginData.currentStatus} → ${newStatus} (age: ${age} days)`,
        );
      }

      pluginData.newStatus = newStatus;
    }

    pluginsData.push(pluginData);
  }

  console.table(pluginsData);

  if (auditMode && updatedPlugins.length > 0) {
    console.log('\n=== Summary of Updates ===');
    console.table(updatedPlugins);
    console.log(`\nTotal plugins updated: ${updatedPlugins.length}`);
  } else if (auditMode) {
    console.log('\nNo plugins required updates.');
  }
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
