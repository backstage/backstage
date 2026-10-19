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

import { spawn } from 'node:child_process';
import {
  closeSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { ExitCodeError } from '@backstage/cli-common';
import { assembleOxlintReport } from './assembleOxlintReport';
import {
  auditSuppressionReceipts,
  type SuppressionAuditResult,
} from './suppressionAudit';
import { resolveOxlintBin, resolveOxlintConfig } from './oxlint';

const XML_FORMATS = new Set(['checkstyle', 'junit']);

// Oxlint parallelizes linting across all available cores itself, so process
// level concurrency mainly overlaps startup and TypeScript program loading.
// The cap keeps the memory footprint of concurrent type-aware runs bounded.
const MAX_CONCURRENT_OXLINT = 4;

export interface OxlintTarget {
  configDir: string;
  directories: string[];
  /**
   * Fail when the target produces more than this number of warnings, as
   * declared by the package's own lint script. Takes the strictest value
   * when several targets share a configuration group.
   */
  maxWarnings?: number;
}

export interface OxlintExecutionOptions {
  targets: OxlintTarget[];
  cwd: string;
  /** Command name used in error messages, for example `repo lint`. */
  command: string;
  fix?: boolean;
  format: string;
  outputFile?: string;
  maxWarnings?: number;
  oxlintBin?: string;
}

interface ConfigGroup {
  configPath?: string;
  directories: string[];
  maxWarnings?: number;
}

interface GroupResult {
  output: string;
  status: number | null;
  signal: string | null;
  error?: Error;
  stderr: string;
  auditDir: string;
}

function groupTargets(targets: OxlintTarget[]): ConfigGroup[] {
  const groups = new Map<string | undefined, ConfigGroup>();
  for (const target of targets) {
    const configPath = resolveOxlintConfig(target.configDir);
    let group = groups.get(configPath);
    if (!group) {
      group = { configPath, directories: [] };
      groups.set(configPath, group);
    }
    group.directories.push(...target.directories);
    if (target.maxWarnings !== undefined) {
      group.maxWarnings =
        group.maxWarnings === undefined
          ? target.maxWarnings
          : Math.min(group.maxWarnings, target.maxWarnings);
    }
  }
  return [...groups.values()];
}

function makeArgs(
  group: ConfigGroup,
  options: OxlintExecutionOptions,
): string[] {
  const args: string[] = [];
  if (group.configPath) {
    args.push('-c', group.configPath);
  }
  if (options.fix) {
    args.push('--fix');
  }
  if (options.format && options.format !== 'default') {
    args.push('--format', options.format);
  }
  args.push(...group.directories);
  return args;
}

function reportedFileCount(format: string, output: string): number | undefined {
  if (format !== 'json' || !output) {
    return undefined;
  }
  try {
    const report: unknown = JSON.parse(output);
    if (
      typeof report === 'object' &&
      report !== null &&
      !Array.isArray(report) &&
      Number.isSafeInteger((report as Record<string, unknown>).number_of_files)
    ) {
      return Number((report as Record<string, unknown>).number_of_files);
    }
  } catch {
    // The report assembler reports malformed JSON with the other group errors.
  }
  return undefined;
}

/** Empty report seed used when no config groups are selected at all. */
function emptyReport(format: string): string[] {
  if (format === 'checkstyle') {
    return [
      '<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3"></checkstyle>',
    ];
  }
  if (format === 'junit') {
    return [
      '<?xml version="1.0" encoding="UTF-8"?><testsuites name="Oxlint" tests="0" failures="0" errors="0"></testsuites>',
    ];
  }
  return [];
}

function writeStream(
  stream: NodeJS.WriteStream,
  output: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.write(output, error => (error ? reject(error) : resolve()));
  });
}

function runOxlintGroup(
  group: ConfigGroup,
  index: number,
  tempDir: string,
  options: OxlintExecutionOptions,
  oxlintBin: string,
): Promise<GroupResult> {
  return new Promise(resolve => {
    const outputPath = join(tempDir, `${index}.stdout`);
    const result: GroupResult = {
      output: '',
      status: null,
      signal: null,
      stderr: '',
      auditDir: '',
    };
    try {
      result.auditDir = mkdtempSync(join(tempDir, `${index}.audit-`));
    } catch (error) {
      resolve({
        ...result,
        error: new Error(
          `Could not create Oxlint audit directory: ${String(error)}`,
        ),
      });
      return;
    }

    let outputFd: number | undefined;
    try {
      outputFd = openSync(outputPath, 'w');
    } catch (error) {
      resolve({
        ...result,
        error: new Error(
          `Could not create Oxlint output file: ${String(error)}`,
        ),
      });
      return;
    }

    const child = spawn(
      process.execPath,
      [oxlintBin, ...makeArgs(group, options)],
      {
        cwd: options.cwd,
        env: {
          ...process.env,
          BACKSTAGE_OXLINT_AUDIT_DIR: result.auditDir,
        },
        stdio: ['ignore', outputFd, 'pipe'],
      },
    );

    child.stderr?.on('data', (chunk: Buffer | string) => {
      result.stderr += chunk.toString();
    });
    child.on('error', (error: Error) => {
      result.error = error;
    });
    child.on('close', (status, signal) => {
      closeSync(outputFd);
      result.status = status;
      result.signal = signal;
      try {
        result.output = readFileSync(outputPath, 'utf8');
      } catch (error) {
        result.error = result.error ?? new Error(String(error));
      }
      resolve(result);
    });
  });
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let index = 0;
  const workers = Array.from(
    { length: Math.max(1, Math.min(limit, items.length)) },
    async () => {
      while (index < items.length) {
        const current = items[index];
        index += 1;
        await worker(current);
      }
    },
  );
  await Promise.all(workers);
}

export async function executeOxlint(
  options: OxlintExecutionOptions,
): Promise<void> {
  const groups = groupTargets(options.targets);
  // Without a config Oxlint falls back to its built-in defaults, which skips
  // every Backstage rule, so a package that hasn't migrated would pass.
  const unconfigured = groups
    .filter(group => !group.configPath)
    .flatMap(group => group.directories);
  if (unconfigured.length) {
    throw new Error(
      `No Oxlint config file found for ${unconfigured.join(', ')}; ` +
        'add a .oxlintrc.js beside the package.json, as described in the @backstage/cli-module-oxlint README',
    );
  }
  if (groups.length > 1 && XML_FORMATS.has(options.format)) {
    throw new Error(
      `The ${options.command} command requires exactly one config group for ${options.format} output, but found ${groups.length}; use JSON, SARIF, or a text format instead.`,
    );
  }

  const oxlintBin = options.oxlintBin ?? resolveOxlintBin();
  const tempDir = mkdtempSync(join(tmpdir(), 'backstage-oxlint-'));
  const warnings: string[] = [];
  const errors: string[] = [];
  const auditDiagnostics: SuppressionAuditResult['diagnostics'] = [];
  let failed = false;

  try {
    if (groups.length === 0) {
      const assembled = assembleOxlintReport(
        emptyReport(options.format),
        options.format,
        [],
        options.cwd,
      );
      if (assembled.errors.length) {
        throw new Error(assembled.errors.join('\n'));
      }
      if (options.outputFile !== undefined) {
        writeFileSync(
          resolve(options.cwd, options.outputFile),
          assembled.output,
        );
      } else if (assembled.output) {
        await writeStream(process.stdout, assembled.output);
      }
      return;
    }

    const results: Array<GroupResult | undefined> = Array.from({
      length: groups.length,
    });
    await runWithConcurrency(
      groups.map((group, index) => ({ group, index })),
      MAX_CONCURRENT_OXLINT,
      async ({ group, index }) => {
        results[index] = await runOxlintGroup(
          group,
          index,
          tempDir,
          options,
          oxlintBin,
        );
      },
    );

    const reports: string[] = [];
    for (const [index] of groups.entries()) {
      const result = results[index]!;
      reports.push(result.output);

      if (result.error || result.status === null || result.signal) {
        failed = true;
        const errorCode = (result.error as NodeJS.ErrnoException | undefined)
          ?.code;
        errors.push(
          result.error
            ? `Oxlint could not start (${errorCode ?? 'unknown'}): ${
                result.error.message
              }`
            : result.signal
            ? `Oxlint was terminated by ${result.signal}`
            : 'Oxlint returned no exit status',
        );
      } else if (result.status !== 0) {
        failed = true;
        // Ordinary lint findings are already in the report; only surface
        // exit codes that the report does not explain.
        if (result.status !== 1 || !result.output.trim()) {
          errors.push(`Oxlint exited with code ${result.status}`);
        }
      }
      if (result.status !== 0 && result.stderr.trim()) {
        errors.push(result.stderr.trim());
      }

      let audit: SuppressionAuditResult;
      try {
        audit = auditSuppressionReceipts(
          result.auditDir,
          reportedFileCount(options.format, result.output),
        );
      } catch (error) {
        const message = `Could not validate Oxlint audit directory ${
          result.auditDir
        }: ${String(error)}`;
        audit = {
          diagnostics: [{ code: 'backstage/oxlint-audit', message }],
          errors: [message],
          receiptCount: 0,
          strict: false,
        };
      }
      auditDiagnostics.push(...audit.diagnostics);
      if (audit.diagnostics.length > 0) {
        failed = true;
      }
      errors.push(...audit.errors);
    }

    const assembled = assembleOxlintReport(
      reports,
      options.format,
      auditDiagnostics,
      options.cwd,
    );

    // Warning thresholds apply across the whole run, not per config group.
    for (const [index, group] of groups.entries()) {
      const warningCount = assembled.warningCounts[index];
      if (
        group.maxWarnings !== undefined &&
        warningCount !== undefined &&
        warningCount > group.maxWarnings
      ) {
        failed = true;
        errors.push(
          `Oxlint found ${warningCount} warning(s) in ${group.directories.join(
            ', ',
          )}, exceeding the package threshold of ${group.maxWarnings}`,
        );
      }
    }
    if (options.maxWarnings !== undefined && options.maxWarnings !== -1) {
      if (assembled.warningCounts.every(count => count !== undefined)) {
        const total = assembled.warningCounts.reduce(
          (sum, count) => sum + (count ?? 0),
          0,
        );
        if (total > options.maxWarnings) {
          failed = true;
          errors.push(
            `Oxlint found ${total} warning(s), exceeding the maximum of ${options.maxWarnings}`,
          );
        }
      } else {
        warnings.push(
          `The ${options.format} report does not expose warning counts; --max-warnings could not be verified`,
        );
      }
    }

    if (assembled.errors.length) {
      failed = true;
      errors.push(...assembled.errors);
    }

    if (options.outputFile !== undefined) {
      writeFileSync(resolve(options.cwd, options.outputFile), assembled.output);
    } else if (assembled.output) {
      await writeStream(process.stdout, assembled.output);
    }
    if (warnings.length) {
      await writeStream(process.stderr, `${warnings.join('\n')}\n`);
    }
    if (errors.length) {
      await writeStream(process.stderr, `${errors.join('\n')}\n`);
    }
    if (failed) {
      throw new ExitCodeError(1, 'oxlint');
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}
