#!/usr/bin/env node
/*
 * Copyright 2026 The Backstage Authors
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

const fs = require('fs-extra');
const { resolve, join } = require('node:path');
const yaml = require('js-yaml');
const z = require('zod');

const configSchema = z.object({
  title: z.string(),
  author: z.string(),
  authorUrl: z.string().url(),
  category: z.string(),
  description: z.string(),
  documentation: z.string().url(),
  iconUrl: z.string().optional(),
  npmPackageName: z.string(),
  addedDate: z.coerce.date(),
  order: z.number().optional(),
  status: z.enum(['active', 'inactive', 'archived']),
  staleSince: z.coerce.date().optional(),
});

async function main() {
  const rootPath = resolve(__dirname, '..');
  const pluginDirectoryPath = resolve(rootPath, 'microsite', 'data', 'plugins');

  const pluginDirectoryFiles = await fs.readdir(pluginDirectoryPath);

  let hasErrors = false;
  for (const pluginDirectoryFile of pluginDirectoryFiles) {
    const pluginDirectoryFilePath = join(
      pluginDirectoryPath,
      pluginDirectoryFile,
    );

    if (!pluginDirectoryFile.toLocaleLowerCase().includes('.yaml')) {
      hasErrors = true;
      console.log(
        `${pluginDirectoryFilePath}: The '.yaml' extension is missing`,
      );
    }

    const pluginDataYaml = yaml.load(
      fs.readFileSync(pluginDirectoryFilePath, { encoding: 'utf-8' }),
    );

    try {
      configSchema.parse(pluginDataYaml);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(
          `${pluginDirectoryFilePath}: YAML data validation failed`,
          error.errors,
        );
      } else {
        console.log(
          `${pluginDirectoryFilePath}: An unexpected error occurred`,
          error,
        );
      }
      hasErrors = true;
    }
  }
  if (hasErrors) {
    throw new Error(
      'There was an error verifying the Plugin Directory data files, review the output for guidance on what corrections are needed',
    );
  }
}

main().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
