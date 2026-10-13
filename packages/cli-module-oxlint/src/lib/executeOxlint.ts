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

import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
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

export interface OxlintTarget {
  configDir: string;
  directories: string[];
}

export interface OxlintExecutionOptions {
  targets: OxlintTarget[];
  cwd: string;
  fix?: boolean;
  format: string;
  outputFile?: string;
  maxWarnings?: number;
  oxlintBin?: string;
}

interface ConfigGroup {
  configPath?: string;
  directories: string[];
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
  if (options.maxWarnings !== undefined && options.maxWarnings !== -1) {
    args.push('--max-warnings', String(options.maxWarnings));
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

function writeStream(
  stream: NodeJS.WriteStream,
  output: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.write(output, error => (error ? reject(error) : resolve()));
  });
}

export async function executeOxlint(
  options: OxlintExecutionOptions,
): Promise<void> {
  const groups = groupTargets(options.targets);
  if (groups.length !== 1 && XML_FORMATS.has(options.format)) {
    throw new Error(
      `The repo lint command requires exactly one config group for ${options.format} output, but found ${groups.length}; use JSON, SARIF, or a text format instead.`,
    );
  }

  const oxlintBin = options.oxlintBin ?? resolveOxlintBin();
  const tempDir = mkdtempSync(join(tmpdir(), 'backstage-oxlint-'));
  const reports: string[] = [];
  const errors: string[] = [];
  const auditDiagnostics: SuppressionAuditResult['diagnostics'] = [];
  let failed = false;

  try {
    for (const [index, group] of groups.entries()) {
      const outputPath = join(tempDir, `${index}.stdout`);
      let auditDir: string;
      try {
        auditDir = mkdtempSync(join(tempDir, `${index}.audit-`));
      } catch (error) {
        reports.push('');
        failed = true;
        errors.push(
          `Could not create Oxlint audit directory: ${String(error)}`,
        );
        continue;
      }

      let output = '';
      let result: SpawnSyncReturns<string | Buffer> | undefined;
      try {
        const outputFd = openSync(outputPath, 'w');
        try {
          result = spawnSync(
            process.execPath,
            [oxlintBin, ...makeArgs(group, options)],
            {
              cwd: options.cwd,
              env: {
                ...process.env,
                BACKSTAGE_OXLINT_AUDIT_DIR: auditDir,
              },
              stdio: ['inherit', outputFd, 'inherit'],
            },
          );
        } finally {
          closeSync(outputFd);
        }
        output = readFileSync(outputPath, 'utf8');
      } catch (error) {
        failed = true;
        errors.push(
          `Could not execute oxlint for ${group.directories.join(
            ', ',
          )}: ${String(error)}`,
        );
      }
      reports.push(output);

      if (result) {
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
        }
        if (result.status !== 0) {
          failed = true;
          if (typeof result.status === 'number') {
            errors.push(`Oxlint exited with code ${result.status}`);
          }
        }
      }

      let audit: SuppressionAuditResult;
      try {
        audit = auditSuppressionReceipts(
          auditDir,
          reportedFileCount(options.format, output),
        );
      } catch (error) {
        const message = `Could not validate Oxlint audit directory ${auditDir}: ${String(
          error,
        )}`;
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
    if (assembled.errors.length) {
      failed = true;
      errors.push(...assembled.errors);
    }

    if (options.outputFile !== undefined) {
      writeFileSync(resolve(options.cwd, options.outputFile), assembled.output);
    } else if (assembled.output) {
      await writeStream(process.stdout, assembled.output);
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
