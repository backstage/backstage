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
import { paths as cliPaths } from '../../../lib/paths';
import { getPortPromise } from 'portfinder';
import { diff as justDiff } from 'just-diff';
import { SchemaInfo } from './types';
import { getPgSchemaInfo } from './getPgSchemaInfo';

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

  const { default: Knex } = await import('knex');
  const { default: EmbeddedPostgres } = await import('embedded-postgres');

  console.log(`DEBUG: knex=`, Knex);
  console.log(`DEBUG: EmbeddedPostgres=`, EmbeddedPostgres);

  const port = await getPortPromise({
    /*  startPort: 5433, stopPort: 6543  */
  });
  console.log(`DEBUG: port=`, port);

  const pg = new EmbeddedPostgres({
    databaseDir: './data/db',
    user: 'postgres',
    password: 'password',
    port,
    persistent: false,
    onError(_messageOrError) {
      // console.error('EmbeddedPostgres error:', messageOrError);
    },
    onLog(_message) {
      // console.log('EmbeddedPostgres log:', message);
    },
  });

  // Create the cluster config files
  await pg.initialise();

  // Start the server
  await pg.start();

  await pg.createDatabase('extractor');

  const knex = Knex({
    client: 'pg',
    connection: {
      host: 'localhost',
      port,
      user: 'postgres',
      password: 'password',
      database: 'extractor',
    },
  });

  const migrationsListResult = await knex.migrate.list({
    directory: migrationDir,
  });
  const migrations: string[] = migrationsListResult[1].map(
    (m: { file: string }) => m.file,
  );

  const schemaInfoBeforeMigration = new Map<string, SchemaInfo>();

  for (const migration of migrations) {
    console.log(`DEBUG: UP ${migration}`);
    const schemaInfo = await getPgSchemaInfo(knex);
    schemaInfoBeforeMigration.set(migration, schemaInfo);

    await knex.migrate.up({
      directory: migrationDir,
      name: migration,
    });
  }

  const schemaInfo = await getPgSchemaInfo(knex);
  console.log(`DEBUG: schemaInfo=`, JSON.stringify(schemaInfo, null, 2));

  for (const migration of migrations.toReversed()) {
    console.log(`DEBUG: DOWN ${migration}`);
    await knex.migrate.down({
      directory: migrationDir,
      name: migration,
    });
    const after = await getPgSchemaInfo(knex);
    const before = schemaInfoBeforeMigration.get(migration);
    if (!before) {
      throw new Error(`No previous result for migration ${migration}`);
    }

    const diff = justDiff(before, after);
    console.log(`DEBUG: diff=`, diff);
    if (diff.length !== 0) {
      console.log(`Migration ${migration} is not reversible`);
      await pg.stop();
      return;
    }
  }

  // Stop the server
  await pg.stop();
}
