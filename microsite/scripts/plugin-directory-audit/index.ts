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
import { resolve } from 'node:path';
import type {
  NpmSnapshot,
  PluginManifest,
} from '../../src/pluginDirectory/manifest';
import { auditManifest, type AuditDependencies } from './audit';
import { GitHubSnapshotClient } from './githubClient';
import { writeLatestBackstageVersionFile } from './latestBackstageVersionStore';
import { readManifestFiles, writeManifestFile } from './manifestStore';
import { fetchNpmSnapshot } from './npmClient';

export interface AuditOutput {
  log(message: string): void;
  warn(message: string): void;
  table(rows: readonly unknown[]): void;
}

export interface AuditCommandOptions {
  directory: string;
  // Omitted in tests to skip touching anything outside the manifest
  // directory; the real CLI always provides it.
  latestBackstageVersionPath?: string;
  dependencies: AuditDependencies;
  output: AuditOutput;
}

export interface AuditCommandResult {
  changedFiles: number;
  writtenFiles: number;
  warnings: string[];
}

interface AuditTableRow {
  npmPackageName: string;
  latestVersion?: string;
  lastPublishedAt?: string;
  age?: number;
  currentStatus: PluginManifest['status'];
  newStatus: PluginManifest['status'];
  npmSnapshot: NpmSnapshot['status'];
  backstageSnapshot: NonNullable<
    PluginManifest['snapshot']
  >['backstage']['status'];
}

interface UpdatedPluginRow {
  file: string;
  plugin: string;
  oldStatus: PluginManifest['status'];
  newStatus: PluginManifest['status'];
  oldStaleSince?: string;
  newStaleSince?: string;
  age?: number;
}

interface AuditedFile {
  tableRow: AuditTableRow;
  updatedRow?: UpdatedPluginRow;
  changed: boolean;
}

// Bounds how many plugins are audited (and, in audit mode, written) at once.
// GitHub responses for shared repositories (e.g. backstage/backstage) are
// memoized per-repo in GitHubSnapshotClient, so concurrency mainly buys
// parallelism across the npm registry and distinct GitHub repositories.
const AUDIT_CONCURRENCY = 8;

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    for (;;) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) {
        return;
      }
      results[index] = await fn(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  );
  return results;
}

export async function runAuditCommand(
  args: readonly string[],
  options: AuditCommandOptions,
): Promise<AuditCommandResult> {
  if (args.length > 1 || (args.length === 1 && args[0] !== '--audit')) {
    throw new Error(`Unknown arguments: ${args.join(' ')}`);
  }

  const auditMode = args[0] === '--audit';
  const files = await readManifestFiles(options.directory);
  const warningsByFile: string[][] = new Array(files.length);
  const writeFailures: Error[] = [];
  let writtenFiles = 0;

  const auditedFiles = await mapWithConcurrency(
    files,
    AUDIT_CONCURRENCY,
    async (file, index): Promise<AuditedFile> => {
      options.output.log(
        `Auditing - ${file.manifest.title} by ${file.manifest.author} - ${file.manifest.npmPackageName}`,
      );

      // Isolate failures to this plugin: an unexpected error while shaping
      // this row (or writing its file) must not reject the surrounding
      // Promise.all and drop results for every other plugin already in
      // flight.
      try {
        const result = await auditManifest(
          file.manifest,
          options.dependencies,
        );
        warningsByFile[index] = result.warnings;

        const npm = result.manifest.snapshot?.packages.find(
          packageSnapshot =>
            packageSnapshot.npmPackageName === result.manifest.npmPackageName,
        )?.npm;
        let age: number | undefined;
        if (npm && npm.status !== 'unavailable') {
          age = Math.round(
            (options.dependencies.now().getTime() -
              new Date(npm.lastPublishedAt).getTime()) /
              (1000 * 60 * 60 * 24),
          );
        }

        const tableRow: AuditTableRow = {
          npmPackageName: result.manifest.npmPackageName,
          latestVersion:
            npm?.status === 'unavailable' ? undefined : npm?.latestVersion,
          lastPublishedAt:
            npm?.status === 'unavailable' ? undefined : npm?.lastPublishedAt,
          age,
          currentStatus: file.manifest.status,
          newStatus: result.manifest.status,
          npmSnapshot: npm?.status ?? 'unavailable',
          backstageSnapshot: result.manifest.snapshot!.backstage.status,
        };

        const updatedRow: UpdatedPluginRow | undefined =
          file.manifest.status !== result.manifest.status
            ? {
                file: file.filename,
                plugin: result.manifest.title,
                oldStatus: file.manifest.status,
                newStatus: result.manifest.status,
                oldStaleSince: file.manifest.staleSince,
                newStaleSince: result.manifest.staleSince,
                age,
              }
            : undefined;

        // Writing this file overlaps with auditing the rest of the plugins
        // rather than waiting for every audit to finish first.
        if (result.changed && auditMode) {
          try {
            await writeManifestFile({ ...file, manifest: result.manifest });
            writtenFiles += 1;
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error);
            writeFailures.push(
              new Error(`Failed to write ${file.filename}: ${message}`),
            );
          }
        }

        return { tableRow, updatedRow, changed: result.changed };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        warningsByFile[index] = [
          `Failed to audit ${file.filename}: ${message}`,
        ];
        return {
          tableRow: {
            npmPackageName: file.manifest.npmPackageName,
            currentStatus: file.manifest.status,
            newStatus: file.manifest.status,
            npmSnapshot: 'unavailable',
            backstageSnapshot: 'unavailable',
          },
          changed: false,
        };
      }
    },
  );

  options.output.table(auditedFiles.map(file => file.tableRow));

  const updatedRows = auditedFiles
    .map(file => file.updatedRow)
    .filter((row): row is UpdatedPluginRow => row !== undefined);

  if (auditMode && updatedRows.length > 0) {
    options.output.log('=== Summary of Updates ===');
    options.output.table(updatedRows);
    options.output.log(`Total plugins updated: ${updatedRows.length}`);
  } else if (auditMode) {
    options.output.log('No plugins required updates.');
  }

  const warnings = warningsByFile.flat();
  for (const warning of warnings) {
    options.output.warn(warning);
  }

  if (auditMode && options.latestBackstageVersionPath) {
    try {
      const version =
        await options.dependencies.github.fetchLatestBackstageVersion();
      if (version) {
        await writeLatestBackstageVersionFile(
          options.latestBackstageVersionPath,
          {
            version,
            checkedAt: options.dependencies.now().toISOString(),
            sourceUrl: `https://github.com/backstage/backstage/releases/tag/v${version}`,
          },
        );
      } else {
        options.output.warn(
          'Could not determine the latest Backstage release version.',
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      options.output.warn(
        `Failed to update the latest Backstage version: ${message}`,
      );
    }
  }

  if (writeFailures.length > 0) {
    throw new AggregateError(
      writeFailures,
      `Failed to write ${writeFailures.length} plugin manifest${
        writeFailures.length === 1 ? '' : 's'
      }.`,
    );
  }

  return {
    changedFiles: auditedFiles.filter(file => file.changed).length,
    writtenFiles,
    warnings,
  };
}

async function main(args: readonly string[]): Promise<void> {
  await runAuditCommand(args, {
    directory: resolve(process.cwd(), 'data/plugins'),
    latestBackstageVersionPath: resolve(
      process.cwd(),
      'data/latest-backstage-version.yaml',
    ),
    dependencies: {
      fetchNpm: fetchNpmSnapshot,
      github: new GitHubSnapshotClient({ token: process.env.GITHUB_TOKEN }),
      now: () => new Date(),
    },
    output: console,
  });
}

if (require.main === module) {
  main(process.argv.slice(2)).catch(error => {
    console.error(error instanceof Error ? error.stack : error);
    process.exitCode = 1;
  });
}
