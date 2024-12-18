/*
 * Copyright 2024 The Backstage Authors
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

import fs from 'fs-extra';
import { paths as cliPaths } from '../../lib/paths';

interface SqlExtractionOptions {
  packageDirs: string[];
  isLocalBuild: boolean;
}

export async function runSqlExtraction(options: SqlExtractionOptions) {
  for (const packageDir of options.packageDirs) {
    const migrationDir = cliPaths.resolveTargetRoot(packageDir, 'migrations');
    if (!(await fs.pathExists(migrationDir))) {
      console.log(`No SQL migrations found in ${packageDir}`);
      continue;
    }

    console.log(`Extracting SQL migrations from ${packageDir}`);

    const migrationFiles = await fs.readdir(migrationDir, {
      withFileTypes: true,
    });

    const migrationTargets = migrationFiles
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    if (migrationFiles.some(entry => entry.isFile())) {
      migrationTargets.push('.');
    }

    for (const migrationTarget of migrationTargets) {
      await runSingleSqlExtraction(packageDir, migrationTarget, options);
    }
  }
}

async function runSingleSqlExtraction(
  targetDir: string,
  migrationPath: string,
  options: SqlExtractionOptions,
) {
  const migrationDir = cliPaths.resolveTargetRoot(
    targetDir,
    'migrations',
    migrationPath,
  );

  console.log(`Extracting SQL from ${migrationDir}`);

  const knex = await import('knex');
  const EmbeddedPostgres = await import('embedded-postgres');

  console.log(`DEBUG: knex=`, knex);
  console.log(`DEBUG: EmbeddedPostgres=`, EmbeddedPostgres);
}
