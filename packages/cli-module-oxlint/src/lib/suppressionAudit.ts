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

import { readFileSync, readdirSync, type Dirent } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

const SUPPRESSION_RULE_ID = 'backstage/no-unexplained-suppressions';
const AUDIT_RULE_ID = 'backstage/oxlint-audit';
const RECEIPT_NAME =
  /^file-[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}\.json$/i;

interface SuppressionComment {
  value: string;
  loc: { start: { line: number; column: number } };
  range?: [number, number];
}

interface SuppressionIssue {
  message: string;
  line: number;
  column: number;
  offset?: number;
  length?: number;
}

interface SourceComment {
  type: string;
  value: string;
  loc: { start: { line: number; column: number } };
  range?: [number, number];
}

interface ParserOptions {
  filePath: string;
  loc: true;
  range: true;
  sourceType: 'module' | 'script';
  ecmaVersion: 'latest';
  allowReturnOutsideFunction: true;
  ecmaFeatures: { jsx: true };
}

interface TypeScriptParser {
  parseForESLint(
    source: string,
    options: ParserOptions,
  ): { ast: { comments?: unknown } };
}

interface AuditDiagnostic {
  code: string;
  message: string;
  filePath?: string;
  source?: string;
  line?: number;
  column?: number;
  offset?: number;
  length?: number;
}

export interface SuppressionAuditResult {
  diagnostics: AuditDiagnostic[];
  errors: string[];
  receiptCount: number;
  strict: boolean;
}

const suppressionAudit = require('../../config/lib/suppressionAudit') as {
  validateSuppressionComments(
    comments: SuppressionComment[],
  ): SuppressionIssue[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSourceComment(value: unknown): value is SourceComment {
  if (!isRecord(value) || typeof value.value !== 'string') {
    return false;
  }
  const loc = value.loc;
  if (!isRecord(loc) || !isRecord(loc.start)) {
    return false;
  }
  return (
    Number.isInteger(loc.start.line) &&
    Number(loc.start.line) > 0 &&
    Number.isInteger(loc.start.column) &&
    Number(loc.start.column) >= 0 &&
    (value.range === undefined ||
      (Array.isArray(value.range) &&
        value.range.length === 2 &&
        value.range.every(item => Number.isInteger(item) && Number(item) >= 0)))
  );
}

function isSuppressionIssue(value: unknown): value is SuppressionIssue {
  if (
    !isRecord(value) ||
    typeof value.message !== 'string' ||
    !Number.isInteger(value.line) ||
    Number(value.line) < 1 ||
    !Number.isInteger(value.column) ||
    Number(value.column) < 0
  ) {
    return false;
  }
  return (
    (value.offset === undefined && value.length === undefined) ||
    (Number.isInteger(value.offset) &&
      Number(value.offset) >= 0 &&
      Number.isInteger(value.length) &&
      Number(value.length) >= 0)
  );
}

function isTypeScriptParser(value: unknown): value is TypeScriptParser {
  return isRecord(value) && typeof value.parseForESLint === 'function';
}

let parserCache: TypeScriptParser | undefined;

function loadParser(): TypeScriptParser {
  if (!parserCache) {
    const parser: unknown = require('@typescript-eslint/parser');
    if (!isTypeScriptParser(parser)) {
      throw new Error(
        'Could not load @typescript-eslint/parser from the module installation',
      );
    }
    parserCache = parser;
  }
  return parserCache;
}

function parseComments(source: string, filePath: string): SourceComment[] {
  const comments: unknown = loadParser().parseForESLint(source, {
    filePath,
    loc: true,
    range: true,
    sourceType: /\.(?:cjs|cts)$/i.test(filePath) ? 'script' : 'module',
    ecmaVersion: 'latest',
    allowReturnOutsideFunction: true,
    ecmaFeatures: { jsx: true },
  }).ast.comments;
  if (!Array.isArray(comments) || !comments.every(isSourceComment)) {
    throw new Error(`Parser returned invalid comments for ${filePath}`);
  }
  return comments;
}

function isReceipt(value: unknown): value is { version: 1; filePath: string } {
  return (
    isRecord(value) &&
    value.version === 1 &&
    typeof value.filePath === 'string' &&
    isAbsolute(value.filePath)
  );
}

function canonicalPath(filePath: string): string {
  const normalized = resolve(filePath);
  return process.platform === 'win32'
    ? normalized.toLocaleLowerCase('en-US')
    : normalized;
}

function lineStartOffset(source: string, line: number): number {
  let offset = 0;
  for (let currentLine = 1; currentLine < line; currentLine += 1) {
    const match = /\r\n|\r|\n/.exec(source.slice(offset));
    if (!match || match.index === undefined) {
      return source.length;
    }
    offset += match.index + match[0].length;
  }
  return offset;
}

function auditError(
  diagnostics: AuditDiagnostic[],
  errors: string[],
  message: string,
  filePath?: string,
): void {
  errors.push(message);
  diagnostics.push({ code: AUDIT_RULE_ID, message, filePath });
}

export function auditSuppressionReceipts(
  auditDir: string,
  expectedFileCount?: number,
): SuppressionAuditResult {
  const diagnostics: AuditDiagnostic[] = [];
  const errors: string[] = [];
  let entries: Dirent<string>[];
  try {
    entries = readdirSync(auditDir, {
      withFileTypes: true,
      encoding: 'utf8',
    });
  } catch (error) {
    auditError(
      diagnostics,
      errors,
      `Could not read Oxlint audit directory ${auditDir}: ${String(error)}`,
      auditDir,
    );
    return { diagnostics, errors, receiptCount: 0, strict: false };
  }

  const markerEntry = entries.find(entry => entry.name === 'strict.json');
  const receiptEntries = entries.filter(entry => RECEIPT_NAME.test(entry.name));
  const unexpectedEntries = entries.filter(
    entry => entry.name !== 'strict.json' && !RECEIPT_NAME.test(entry.name),
  );
  for (const entry of unexpectedEntries) {
    auditError(
      diagnostics,
      errors,
      `Unexpected Oxlint audit entry: ${entry.name}`,
      resolve(auditDir, entry.name),
    );
  }

  if (!markerEntry) {
    if (receiptEntries.length > 0) {
      auditError(
        diagnostics,
        errors,
        'Oxlint wrote suppression audit receipts without a strict marker',
        auditDir,
      );
    }
    return { diagnostics, errors, receiptCount: 0, strict: false };
  }
  if (!markerEntry.isFile()) {
    auditError(
      diagnostics,
      errors,
      'Oxlint strict audit marker is not a regular file',
      resolve(auditDir, markerEntry.name),
    );
    return { diagnostics, errors, receiptCount: 0, strict: true };
  }

  const markerPath = resolve(auditDir, markerEntry.name);
  let marker: unknown;
  try {
    marker = JSON.parse(readFileSync(markerPath, 'utf8'));
  } catch (error) {
    auditError(
      diagnostics,
      errors,
      `Could not read Oxlint strict audit marker ${markerPath}: ${String(
        error,
      )}`,
      markerPath,
    );
    return { diagnostics, errors, receiptCount: 0, strict: true };
  }
  if (!isRecord(marker) || marker.version !== 1) {
    auditError(
      diagnostics,
      errors,
      `Invalid Oxlint strict audit marker ${markerPath}: expected version 1`,
      markerPath,
    );
    return { diagnostics, errors, receiptCount: 0, strict: true };
  }

  const seenPaths = new Set<string>();
  let receiptCount = 0;
  for (const entry of receiptEntries) {
    const receiptPath = resolve(auditDir, entry.name);
    if (!entry.isFile()) {
      auditError(
        diagnostics,
        errors,
        `Oxlint audit receipt is not a regular file: ${receiptPath}`,
        receiptPath,
      );
      continue;
    }

    let receipt: unknown;
    try {
      receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
    } catch (error) {
      auditError(
        diagnostics,
        errors,
        `Could not read Oxlint audit receipt ${receiptPath}: ${String(error)}`,
        receiptPath,
      );
      continue;
    }
    if (!isReceipt(receipt)) {
      auditError(
        diagnostics,
        errors,
        `Invalid Oxlint audit receipt ${receiptPath}: expected version 1 and an absolute filePath`,
        receiptPath,
      );
      continue;
    }

    const uniquePath = canonicalPath(receipt.filePath);
    if (seenPaths.has(uniquePath)) {
      continue;
    }
    seenPaths.add(uniquePath);
    receiptCount += 1;

    try {
      const source = readFileSync(receipt.filePath, 'utf8');
      const comments = parseComments(source, receipt.filePath);
      const issues: unknown =
        suppressionAudit.validateSuppressionComments(comments);
      if (!Array.isArray(issues) || !issues.every(isSuppressionIssue)) {
        throw new Error(
          `Suppression validator returned invalid issues for ${receipt.filePath}`,
        );
      }
      for (const issue of issues) {
        const offset =
          issue.offset ?? lineStartOffset(source, issue.line) + issue.column;
        const length = issue.length ?? 0;
        if (offset > source.length || offset + length > source.length) {
          throw new Error(
            `Suppression validator returned an out-of-range span for ${receipt.filePath}`,
          );
        }
        diagnostics.push({
          code: SUPPRESSION_RULE_ID,
          message: issue.message,
          filePath: receipt.filePath,
          source,
          line: issue.line,
          column: issue.column,
          offset,
          length,
        });
      }
    } catch (error) {
      auditError(
        diagnostics,
        errors,
        `Could not audit selected file ${receipt.filePath}: ${String(error)}`,
        receipt.filePath,
      );
    }
  }

  if (expectedFileCount !== undefined && receiptCount !== expectedFileCount) {
    auditError(
      diagnostics,
      errors,
      `Oxlint selected ${expectedFileCount} file(s) but produced ${receiptCount} suppression audit receipt(s)`,
      auditDir,
    );
  }

  return { diagnostics, errors, receiptCount, strict: true };
}
