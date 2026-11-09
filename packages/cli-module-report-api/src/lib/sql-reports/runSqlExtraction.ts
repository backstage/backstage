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

import fs, { readJson } from 'fs-extra';
import { relative as relativePath } from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import { diff as justDiff } from 'just-diff';
import { SchemaInfo } from './types';
import { getPgSchemaInfo } from './getPgSchemaInfo';
import { generateSqlReport } from './generateSqlReport';
import type { Knex } from 'knex';
import {
  FormattedReport,
  formatReports,
  restoreReport,
} from '../formatReports';
import { logApiReportInstructions } from '../logApiReportInstructions';
import { logReportDiff } from '../logReportDiff';

interface SqlExtractionOptions {
  packageDirs: string[];
  isLocalBuild: boolean;
}

/** A generated SQL report, before it has been formatted. */
interface SqlReport {
  packageDir: string;
  reportPath: string;
  content: string;
}

export async function runSqlExtraction(options: SqlExtractionOptions) {
  const { default: Knex } = await import('knex');
  const { default: ClientPgLite } = await import('knex-pglite');

  // Since we're passing this as the client we need to replace the `config.client` with `pg` afterwards
  class WrappedClientPgLite extends ClientPgLite {
    constructor(config: any) {
      super({ ...config, client: 'pg' });
    }
  }

  let dbIndex = 1;
  const reports = new Array<SqlReport>();

  for (const packageDir of options.packageDirs) {
    const migrationDir = targetPaths.resolveRoot(packageDir, 'migrations');
    if (!(await fs.pathExists(migrationDir))) {
      console.log(`No SQL migrations found in ${packageDir}`);
      continue;
    }

    const { name: pkgName } = await readJson(
      targetPaths.resolveRoot(packageDir, 'package.json'),
    );

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
      const database = `extractor-${dbIndex++}`;

      const knex = Knex({
        client: WrappedClientPgLite,
        dialect: 'postgres',
        connection: {
          database,
        },
      });

      await knex.raw('CREATE DATABASE ??', [database]);

      reports.push(
        await runSingleSqlExtraction(
          packageDir,
          migrationTarget,
          pkgName,
          knex,
        ),
      );
    }
  }

  await updateSqlReports(reports, options);
}

/**
 * Formats all generated reports in one batch, and then either updates the
 * committed reports, or fails if any of them are out of date.
 */
async function updateSqlReports(
  reports: SqlReport[],
  options: SqlExtractionOptions,
) {
  const formattedReports = await formatReports(
    reports.map(report => ({
      path: report.reportPath,
      content: report.content,
    })),
  );

  if (!options.isLocalBuild) {
    // CI builds never change the committed reports
    await Promise.all(formattedReports.map(report => restoreReport(report)));
  }

  const outdatedReports = new Array<FormattedReport>();

  for (const [index, { packageDir }] of reports.entries()) {
    const report = formattedReports[index];
    if (report.existing === report.formatted) {
      continue;
    }
    if (options.isLocalBuild) {
      console.warn(`SQL report changed for ${packageDir}`);
    } else {
      outdatedReports.push(report);
    }
  }

  if (outdatedReports.length > 0) {
    logApiReportInstructions();
    for (const { path, existing, formatted } of outdatedReports) {
      logReportDiff(
        relativePath(targetPaths.rootDir, path),
        existing,
        formatted,
      );
    }
    logApiReportInstructions();

    throw new Error(
      `Report ${outdatedReports
        .map(({ path }) => path)
        .join(', ')} is out of date`,
    );
  }
}

async function runSingleSqlExtraction(
  targetDir: string,
  migrationTarget: string,
  pkgName: string,
  knex: Knex,
): Promise<SqlReport> {
  const migrationDir = targetPaths.resolveRoot(
    targetDir,
    'migrations',
    migrationTarget,
  );

  const reportName =
    migrationTarget === '.' ? pkgName : `${pkgName}/${migrationTarget}`;

  console.log(`Generating SQL report for ${reportName}`);

  const migrationsListResult = await knex.migrate.list({
    directory: migrationDir,
  });
  const migrations: string[] = migrationsListResult[1].map(
    (m: { file: string }) => m.file,
  );

  const schemaInfoBeforeMigration = new Map<string, SchemaInfo>();

  for (const migration of migrations) {
    const schemaInfo = await getPgSchemaInfo(knex);
    schemaInfoBeforeMigration.set(migration, schemaInfo);

    await knex.migrate.up({
      directory: migrationDir,
      name: migration,
    });
  }

  const schemaInfo = await getPgSchemaInfo(knex);

  let failedDownMigration: string | undefined = undefined;
  for (const migration of migrations.toReversed()) {
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
    if (diff.length !== 0) {
      console.log(
        `Migration ${migration} is not reversible: ${JSON.stringify(
          diff,
          null,
          2,
        )}`,
      );
      failedDownMigration = migration;
      break;
    }
  }
  const reportPath = targetPaths.resolveRoot(
    targetDir,
    `report${migrationTarget === '.' ? '' : `-${migrationTarget}`}.sql.md`,
  );
  return {
    packageDir: targetDir,
    reportPath,
    content: generateSqlReport({
      reportName,
      failedDownMigration,
      schemaInfo,
    }),
  };
}
