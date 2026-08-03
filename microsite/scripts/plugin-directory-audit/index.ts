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
import type { PluginManifest } from '../../src/pluginDirectory/manifest';
import { auditManifest, type AuditDependencies } from './audit';
import { GitHubSnapshotClient } from './githubClient';
import {
  readManifestFiles,
  writeManifestFile,
  type ManifestFile,
} from './manifestStore';
import { fetchNpmSnapshot } from './npmClient';

export interface AuditOutput {
  log(message: string): void;
  warn(message: string): void;
  table(rows: readonly unknown[]): void;
}

export interface AuditCommandOptions {
  directory: string;
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
  npmSnapshot: NonNullable<PluginManifest['snapshot']>['npm']['status'];
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

export async function runAuditCommand(
  args: readonly string[],
  options: AuditCommandOptions,
): Promise<AuditCommandResult> {
  if (
    args.length > 1 ||
    (args.length === 1 && args[0] !== '--audit')
  ) {
    throw new Error(`Unknown arguments: ${args.join(' ')}`);
  }

  const auditMode = args[0] === '--audit';
  const files = await readManifestFiles(options.directory);
  const tableRows: AuditTableRow[] = [];
  const changedFiles: ManifestFile[] = [];
  const updatedRows: UpdatedPluginRow[] = [];
  const warnings: string[] = [];

  for (const file of files) {
    options.output.log(
      `Auditing - ${file.manifest.title} by ${file.manifest.author} - ${file.manifest.npmPackageName}`,
    );
    const result = await auditManifest(file.manifest, options.dependencies);
    warnings.push(...result.warnings);

    const npm = result.manifest.snapshot?.npm;
    let age: number | undefined;
    if (npm && npm.status !== 'unavailable') {
      age = Math.round(
        (options.dependencies.now().getTime() -
          new Date(npm.lastPublishedAt).getTime()) /
          (1000 * 60 * 60 * 24),
      );
    }

    tableRows.push({
      npmPackageName: result.manifest.npmPackageName,
      latestVersion: npm?.status === 'unavailable' ? undefined : npm?.latestVersion,
      lastPublishedAt:
        npm?.status === 'unavailable' ? undefined : npm?.lastPublishedAt,
      age,
      currentStatus: file.manifest.status,
      newStatus: result.manifest.status,
      npmSnapshot: result.manifest.snapshot!.npm.status,
      backstageSnapshot: result.manifest.snapshot!.backstage.status,
    });

    if (result.changed) {
      changedFiles.push({
        ...file,
        manifest: result.manifest,
      });
    }

    if (file.manifest.status !== result.manifest.status) {
      updatedRows.push({
        file: file.filename,
        plugin: result.manifest.title,
        oldStatus: file.manifest.status,
        newStatus: result.manifest.status,
        oldStaleSince: file.manifest.staleSince,
        newStaleSince: result.manifest.staleSince,
        age,
      });
    }
  }

  options.output.table(tableRows);

  if (auditMode && updatedRows.length > 0) {
    options.output.log('=== Summary of Updates ===');
    options.output.table(updatedRows);
    options.output.log(`Total plugins updated: ${updatedRows.length}`);
  } else if (auditMode) {
    options.output.log('No plugins required updates.');
  }

  for (const warning of warnings) {
    options.output.warn(warning);
  }

  let writtenFiles = 0;
  const writeFailures: Error[] = [];
  if (auditMode) {
    for (const file of changedFiles) {
      try {
        await writeManifestFile(file);
        writtenFiles += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        writeFailures.push(
          new Error(`Failed to write ${file.filename}: ${message}`),
        );
      }
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
    changedFiles: changedFiles.length,
    writtenFiles,
    warnings,
  };
}

async function main(args: readonly string[]): Promise<void> {
  await runAuditCommand(args, {
    directory: resolve(process.cwd(), 'data/plugins'),
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
