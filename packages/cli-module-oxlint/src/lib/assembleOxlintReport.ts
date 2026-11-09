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

import { createHash } from 'node:crypto';
import { relative, resolve, sep } from 'node:path';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';

const SARIF_SCHEMA =
  'https://docs.oasis-open.org/sarif/sarif/v2.1.0/errata01/os/schemas/sarif-schema-2.1.0.json';
const XML_PARSE_OPTIONS = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
  parseTagValue: false,
  htmlEntities: false,
  processEntities: true,
};
const XML_BUILD_OPTIONS = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  processEntities: true,
};

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

interface JsonReport {
  diagnostics: unknown[];
  number_of_files: number;
  number_of_rules: number | null;
  threads_count: number;
  start_time: number;
}

interface ReportPosition {
  line: number;
  byteColumn: number;
  codePointColumn: number;
  byteOffset: number;
}

interface ReportSpan {
  start: ReportPosition;
  end: ReportPosition;
  byteLength: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function reportPath(filePath: string, cwd: string): string {
  return relative(cwd, resolve(cwd, filePath)).split(sep).join('/');
}

function pathKey(filePath: string, cwd: string): string {
  const normalized = resolve(cwd, filePath).replace(/[\\/]+/g, '/');
  return process.platform === 'win32'
    ? normalized.toLocaleLowerCase('en-US')
    : normalized;
}

function samePath(left: string, right: string, cwd: string): boolean {
  return pathKey(left, cwd) === pathKey(right, cwd);
}

function offsetAt(source: string, line: number, column: number): number {
  const starts = [0];
  for (const match of source.matchAll(/\r\n|\r|\n|\u2028|\u2029/g)) {
    starts.push((match.index ?? 0) + match[0].length);
  }
  const start = starts[line - 1];
  if (start === undefined) {
    throw new Error(`Invalid line ${line} in suppression audit diagnostic`);
  }
  return Math.min(start + column, source.length);
}

function positionAt(source: string, offset: number): ReportPosition {
  const prefix = source.slice(0, offset);
  const lineParts = prefix.split(/\r\n|\r|\n|\u2028|\u2029/);
  const lineText = lineParts[lineParts.length - 1] ?? '';
  return {
    line: lineParts.length,
    byteColumn: Buffer.byteLength(lineText) + 1,
    codePointColumn: Array.from(lineText).length + 1,
    byteOffset: Buffer.byteLength(prefix),
  };
}

function reportSpan(diagnostic: AuditDiagnostic): ReportSpan | undefined {
  if (
    diagnostic.source === undefined ||
    diagnostic.line === undefined ||
    diagnostic.column === undefined
  ) {
    return undefined;
  }
  const startOffset =
    diagnostic.offset ??
    offsetAt(diagnostic.source, diagnostic.line, diagnostic.column);
  const endOffset = startOffset + (diagnostic.length ?? 0);
  if (
    !Number.isInteger(startOffset) ||
    !Number.isInteger(endOffset) ||
    startOffset < 0 ||
    endOffset > diagnostic.source.length
  ) {
    throw new Error('Invalid UTF-16 span in suppression audit diagnostic');
  }
  const start = positionAt(diagnostic.source, startOffset);
  const end = positionAt(diagnostic.source, endOffset);
  return {
    start,
    end,
    byteLength: Buffer.byteLength(
      diagnostic.source.slice(startOffset, endOffset),
    ),
  };
}

function isJsonReport(value: unknown): value is JsonReport {
  return (
    isRecord(value) &&
    Array.isArray(value.diagnostics) &&
    typeof value.number_of_files === 'number' &&
    (typeof value.number_of_rules === 'number' ||
      value.number_of_rules === null) &&
    typeof value.threads_count === 'number' &&
    typeof value.start_time === 'number'
  );
}

function parseJsonReport(output: string): JsonReport {
  const report: unknown = JSON.parse(output);
  if (!isJsonReport(report)) {
    throw new Error('Oxlint returned invalid JSON report metadata');
  }
  return report;
}

/**
 * Counts the warnings in one raw Oxlint group report, so warning thresholds
 * can be enforced across a whole run. Returns undefined when the report does
 * not expose a warning count.
 *
 * @param format - The Oxlint output format the report was produced with
 * @param output - The raw Oxlint report
 */
function countReportWarnings(
  format: string,
  output: string,
): number | undefined {
  if (!output.trim()) {
    return 0;
  }
  switch (format) {
    case 'json': {
      let report: unknown;
      try {
        report = JSON.parse(output);
      } catch {
        return undefined;
      }
      const diagnostics = (report as { diagnostics?: unknown })?.diagnostics;
      if (!Array.isArray(diagnostics)) {
        return undefined;
      }
      return diagnostics.filter(
        diagnostic =>
          (diagnostic as { severity?: unknown })?.severity === 'warning',
      ).length;
    }
    case 'sarif': {
      let report: unknown;
      try {
        report = JSON.parse(output);
      } catch {
        return undefined;
      }
      const runs = (report as { runs?: unknown })?.runs;
      if (!Array.isArray(runs)) {
        return undefined;
      }
      return runs.reduce((total, run) => {
        const results = (run as { results?: unknown })?.results;
        return Array.isArray(results)
          ? total +
              results.filter(
                result => (result as { level?: unknown })?.level === 'warning',
              ).length
          : total;
      }, 0);
    }
    case 'gitlab': {
      let report: unknown;
      try {
        report = JSON.parse(output);
      } catch {
        return undefined;
      }
      if (!Array.isArray(report)) {
        return undefined;
      }
      // The GitLab Code Quality formatter maps lint warnings to "major".
      return report.filter(
        issue => (issue as { severity?: unknown })?.severity === 'major',
      ).length;
    }
    case 'checkstyle': {
      const matches = output.match(/severity="warning"/g);
      return matches ? matches.length : 0;
    }
    case 'junit':
      // The JUnit formatter does not represent warnings.
      return 0;
    case 'default':
    case 'github': {
      // Both formatters print a "Found N warnings and M errors." summary.
      const match = /Found (\d+) warnings? and \d+ errors?/.exec(output);
      return match ? Number(match[1]) : undefined;
    }
    case 'stylish': {
      const match = /\(\d+ errors?, (\d+) warnings?\)/.exec(output);
      return match ? Number(match[1]) : undefined;
    }
    case 'unix': {
      // Each diagnostic line ends with an "[Error/...]" or "[Warning/...]" tag.
      const matches = output.match(/ \[Warning\//g);
      return matches ? matches.length : 0;
    }
    default:
      return undefined;
  }
}

function jsonDiagnostic(
  diagnostic: AuditDiagnostic,
  cwd: string,
): Record<string, unknown> {
  const span = reportSpan(diagnostic);
  return {
    message: diagnostic.message,
    code: diagnostic.code,
    severity: 'error',
    causes: [],
    ...(diagnostic.filePath
      ? { filename: reportPath(diagnostic.filePath, cwd) }
      : {}),
    labels: span
      ? [
          {
            span: {
              offset: span.start.byteOffset,
              length: span.byteLength,
              line: span.start.line,
              column: span.start.byteColumn,
            },
          },
        ]
      : [],
    related: [],
  };
}

function hasJsonDiagnostic(
  existing: unknown,
  diagnostic: AuditDiagnostic,
  cwd: string,
): boolean {
  if (
    !isRecord(existing) ||
    existing.code !== diagnostic.code ||
    existing.message !== diagnostic.message ||
    typeof existing.filename !== 'string' ||
    !diagnostic.filePath ||
    !samePath(existing.filename, diagnostic.filePath, cwd)
  ) {
    return false;
  }
  const span = reportSpan(diagnostic);
  const labels = existing.labels;
  return Boolean(
    span &&
      Array.isArray(labels) &&
      labels.some(
        label =>
          isRecord(label) &&
          isRecord(label.span) &&
          label.span.line === span.start.line &&
          label.span.column === span.start.byteColumn,
      ),
  );
}

function assembleJson(
  parsed: JsonReport[],
  diagnostics: AuditDiagnostic[],
  cwd: string,
): string {
  const report =
    parsed.length === 1
      ? { ...parsed[0], diagnostics: [...parsed[0].diagnostics] }
      : {
          diagnostics: parsed.flatMap(group => group.diagnostics),
          number_of_files: parsed.reduce(
            (total, group) => total + group.number_of_files,
            0,
          ),
          number_of_rules: null,
          threads_count: Math.max(
            0,
            ...parsed.map(group => group.threads_count),
          ),
          start_time: parsed.reduce(
            (total, group) => total + group.start_time,
            0,
          ),
          groups: parsed.map(
            ({ diagnostics: _diagnostics, ...metadata }) => metadata,
          ),
        };
  for (const diagnostic of diagnostics) {
    if (
      !report.diagnostics.some(existing =>
        hasJsonDiagnostic(existing, diagnostic, cwd),
      )
    ) {
      report.diagnostics.push(jsonDiagnostic(diagnostic, cwd));
    }
  }
  return JSON.stringify(report);
}

function parseSarifReport(output: string): Record<string, unknown> & {
  runs: unknown[];
} {
  const report: unknown = JSON.parse(output);
  if (!isRecord(report) || !Array.isArray(report.runs)) {
    throw new Error('Invalid SARIF document');
  }
  return report as Record<string, unknown> & { runs: unknown[] };
}

function sarifRule(code: string): Record<string, unknown> {
  return {
    id: code,
    name: code.slice(code.lastIndexOf('/') + 1),
    shortDescription: {
      text:
        code === 'backstage/no-unexplained-suppressions'
          ? 'Suppression directives require useful explanations'
          : 'Oxlint CLI audit failure',
    },
    defaultConfiguration: { level: 'error' },
  };
}

function hasSarifDiagnostic(
  existing: unknown,
  diagnostic: AuditDiagnostic,
  cwd: string,
): boolean {
  if (!isRecord(existing) || existing.ruleId !== diagnostic.code) {
    return false;
  }
  const message = existing.message;
  const locations = existing.locations;
  if (
    !isRecord(message) ||
    message.text !== diagnostic.message ||
    !Array.isArray(locations)
  ) {
    return false;
  }
  const span = reportSpan(diagnostic);
  return locations.some(location => {
    if (!isRecord(location) || !isRecord(location.physicalLocation)) {
      return false;
    }
    const physical = location.physicalLocation;
    const artifact = physical.artifactLocation;
    const region = physical.region;
    return Boolean(
      diagnostic.filePath &&
        isRecord(artifact) &&
        typeof artifact.uri === 'string' &&
        samePath(artifact.uri, diagnostic.filePath, cwd) &&
        (!span ||
          (isRecord(region) &&
            region.startLine === span.start.line &&
            region.startColumn === span.start.codePointColumn)),
    );
  });
}

function appendSarifDiagnostics(
  report: Record<string, unknown> & { runs: unknown[] },
  diagnostics: AuditDiagnostic[],
  cwd: string,
): void {
  if (diagnostics.length === 0) {
    return;
  }
  if (report.runs.length === 0) {
    report.runs.push({ tool: { driver: { name: 'oxlint', rules: [] } } });
  }
  const run = report.runs[0];
  if (!isRecord(run) || !isRecord(run.tool) || !isRecord(run.tool.driver)) {
    throw new Error('Invalid SARIF run tool metadata');
  }
  const driver = run.tool.driver;
  const rules = driver.rules === undefined ? [] : driver.rules;
  if (!Array.isArray(rules)) {
    throw new Error('Invalid SARIF driver rule list');
  }
  const results = run.results === undefined ? [] : run.results;
  if (!Array.isArray(results)) {
    throw new Error('Invalid SARIF result list');
  }

  for (const diagnostic of diagnostics) {
    if (results.some(result => hasSarifDiagnostic(result, diagnostic, cwd))) {
      continue;
    }
    let ruleIndex = rules.findIndex(
      rule => isRecord(rule) && rule.id === diagnostic.code,
    );
    if (ruleIndex === -1) {
      ruleIndex = rules.length;
      rules.push(sarifRule(diagnostic.code));
    }
    const span = reportSpan(diagnostic);
    const physicalLocation: Record<string, unknown> = {};
    if (diagnostic.filePath) {
      physicalLocation.artifactLocation = {
        uri: reportPath(diagnostic.filePath, cwd),
      };
    }
    if (span) {
      physicalLocation.region = {
        startLine: span.start.line,
        startColumn: span.start.codePointColumn,
        endLine: span.end.line,
        endColumn: span.end.codePointColumn,
      };
    }
    results.push({
      ruleId: diagnostic.code,
      ruleIndex,
      level: 'error',
      message: { text: diagnostic.message },
      ...(Object.keys(physicalLocation).length > 0
        ? { locations: [{ physicalLocation }] }
        : {}),
    });
  }
  driver.rules = rules;
  run.results = results;
}

function assembleSarif(
  parsed: Array<Record<string, unknown> & { runs: unknown[] }>,
  diagnostics: AuditDiagnostic[],
  cwd: string,
): string {
  const report =
    parsed.length === 1
      ? parsed[0]
      : {
          version: '2.1.0',
          $schema: SARIF_SCHEMA,
          runs: parsed.flatMap(group => group.runs),
        };
  appendSarifDiagnostics(report, diagnostics, cwd);
  return JSON.stringify(report);
}

function gitlabPath(filePath: string, cwd: string): string {
  return reportPath(filePath, cwd);
}

function gitlabDiagnostic(
  diagnostic: AuditDiagnostic,
  cwd: string,
): Record<string, unknown> {
  const span = reportSpan(diagnostic);
  const path = diagnostic.filePath
    ? gitlabPath(diagnostic.filePath, cwd)
    : 'oxlint-audit';
  const line = span?.start.line ?? diagnostic.line ?? 1;
  const endLine = span?.end.line ?? line;
  const fingerprint = createHash('sha256')
    .update(
      `${diagnostic.code}\0${path}\0${line}\0${span?.start.byteColumn ?? 0}\0${
        diagnostic.message
      }`,
    )
    .digest('hex');
  return {
    description: diagnostic.message,
    check_name: diagnostic.code,
    fingerprint,
    severity: 'critical',
    location: { path, lines: { begin: line, end: endLine } },
  };
}

function gitlabDiagnosticKey(diagnostic: AuditDiagnostic, cwd: string): string {
  const span = reportSpan(diagnostic);
  const path = pathKey(diagnostic.filePath ?? 'oxlint-audit', cwd);
  return `${diagnostic.code}\0${diagnostic.message}\0${path}\0${
    span?.start.line ?? diagnostic.line ?? 1
  }`;
}

function existingGitlabDiagnosticKey(
  value: unknown,
  cwd: string,
): string | undefined {
  if (
    !isRecord(value) ||
    typeof value.check_name !== 'string' ||
    typeof value.description !== 'string' ||
    !isRecord(value.location) ||
    typeof value.location.path !== 'string' ||
    !isRecord(value.location.lines) ||
    typeof value.location.lines.begin !== 'number'
  ) {
    return undefined;
  }
  return `${value.check_name}\0${value.description}\0${pathKey(
    value.location.path,
    cwd,
  )}\0${value.location.lines.begin}`;
}

function assembleGitlab(
  reports: string[],
  diagnostics: AuditDiagnostic[],
  cwd: string,
  errors: string[],
): string {
  const parsed: Record<string, unknown>[] = [];
  let validReports = 0;
  for (const [index, report] of reports.entries()) {
    if (!report) {
      errors.push(
        `Oxlint produced no GitLab report for config group ${index + 1}`,
      );
      continue;
    }
    try {
      const value: unknown = JSON.parse(report);
      if (!Array.isArray(value) || !value.every(isRecord)) {
        throw new Error('Invalid GitLab Code Quality document');
      }
      parsed.push(...value);
      validReports += 1;
    } catch (error) {
      errors.push(
        `Invalid Oxlint GitLab report from group ${index + 1}: ${String(
          error,
        )}`,
      );
    }
  }
  if (validReports === 0 && reports.length > 0) {
    return '';
  }
  const existingCounts = new Map<string, number>();
  for (const item of parsed) {
    const key = existingGitlabDiagnosticKey(item, cwd);
    if (key) {
      existingCounts.set(key, (existingCounts.get(key) ?? 0) + 1);
    }
  }
  const auditCounts = new Map<string, number>();
  for (const diagnostic of diagnostics) {
    const key = gitlabDiagnosticKey(diagnostic, cwd);
    auditCounts.set(key, (auditCounts.get(key) ?? 0) + 1);
  }
  const addedCounts = new Map<string, number>();
  for (const diagnostic of diagnostics) {
    const key = gitlabDiagnosticKey(diagnostic, cwd);
    const added = addedCounts.get(key) ?? 0;
    if (added + (existingCounts.get(key) ?? 0) < (auditCounts.get(key) ?? 0)) {
      parsed.push(gitlabDiagnostic(diagnostic, cwd));
    }
    addedCounts.set(key, added + 1);
  }
  return JSON.stringify(parsed);
}

function escapeGitHubProperty(value: string): string {
  return value
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A')
    .replace(/:/g, '%3A')
    .replace(/,/g, '%2C');
}

function escapeGitHubData(value: string): string {
  return value.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function textDiagnostic(
  diagnostic: AuditDiagnostic,
  format: string,
  cwd: string,
): string {
  const span = reportSpan(diagnostic);
  const filePath = diagnostic.filePath
    ? reportPath(diagnostic.filePath, cwd)
    : 'Oxlint suppression audit';
  const line = span?.start.line ?? diagnostic.line;
  const column =
    span?.start.byteColumn ??
    (diagnostic.column === undefined ? undefined : diagnostic.column + 1);
  const location =
    line === undefined
      ? filePath
      : `${filePath}:${line}${column === undefined ? '' : `:${column}`}`;

  if (format === 'github') {
    return `::error file=${escapeGitHubProperty(filePath)}${
      line === undefined ? '' : `,line=${line}`
    }${
      span
        ? `,endLine=${span.end.line},col=${span.start.byteColumn},endColumn=${span.end.byteColumn}`
        : ''
    },title=${escapeGitHubProperty(diagnostic.code)}::${escapeGitHubData(
      diagnostic.message,
    )}`;
  }
  if (format === 'unix') {
    return `${location}: ${diagnostic.message} [Error/${diagnostic.code}]`;
  }
  if (format === 'stylish') {
    return `${filePath}\n  ${line ?? 1}:${column ?? 1}  error  ${
      diagnostic.message
    }  ${diagnostic.code}`;
  }
  return `error ${diagnostic.code}: ${diagnostic.message}\n  --> ${location}`;
}

function alreadyReportedInText(
  output: string,
  diagnostic: AuditDiagnostic,
  cwd: string,
): boolean {
  const span = reportSpan(diagnostic);
  const filePath = diagnostic.filePath
    ? reportPath(diagnostic.filePath, cwd)
    : 'Oxlint suppression audit';
  return (
    output.includes(diagnostic.code) &&
    output.includes(diagnostic.message) &&
    output.includes(filePath) &&
    (!span || output.includes(`${span.start.line}:${span.start.byteColumn}`))
  );
}

function appendTextDiagnostics(
  reports: string[],
  diagnostics: AuditDiagnostic[],
  format: string,
  cwd: string,
): string {
  const nativeOutput = reports.filter(Boolean).join('\n');
  const added = diagnostics
    .filter(diagnostic => !alreadyReportedInText(nativeOutput, diagnostic, cwd))
    .map(diagnostic => textDiagnostic(diagnostic, format, cwd));
  if (added.length === 0) {
    return nativeOutput;
  }
  return [nativeOutput, ...added].filter(Boolean).join('\n');
}

function toArray(value: unknown): unknown[] {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function requireRecord(
  value: unknown,
  description: string,
): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`Invalid Oxlint XML report: expected ${description}`);
  }
  return value;
}

function parseXmlReport(output: string): Record<string, unknown> {
  if (/<!DOCTYPE\b|<!ENTITY\b/i.test(output)) {
    throw new Error(
      'Oxlint XML reports must not contain DTD or entity declarations',
    );
  }
  const validation = XMLValidator.validate(output);
  if (validation !== true) {
    throw new Error(`Invalid XML document: ${JSON.stringify(validation)}`);
  }
  const parsed: unknown = new XMLParser({
    ...XML_PARSE_OPTIONS,
    ignoreDeclaration: true,
    ignorePiTags: true,
  }).parse(output);
  return requireRecord(parsed, 'an XML document object');
}

function buildXmlReport(
  document: Record<string, unknown>,
  declaration: string,
  format: string,
): string {
  const output = `${declaration}${new XMLBuilder({
    ...XML_BUILD_OPTIONS,
    format: format === 'junit',
    indentBy: '    ',
  }).build(document)}`;
  if (XMLValidator.validate(output) !== true) {
    throw new Error('Could not build a valid merged XML report');
  }
  return output;
}

function checkstyleDiagnostic(
  diagnostic: AuditDiagnostic,
): Record<string, unknown> {
  const span = reportSpan(diagnostic);
  return {
    '@_line': String(span?.start.line ?? diagnostic.line ?? 1),
    '@_column': String(
      span?.start.byteColumn ??
        (diagnostic.column === undefined ? 1 : diagnostic.column + 1),
    ),
    '@_severity': 'error',
    '@_message': diagnostic.message,
    '@_source': diagnostic.code,
  };
}

function hasCheckstyleDiagnostic(
  existing: unknown,
  diagnostic: AuditDiagnostic,
): boolean {
  if (
    !isRecord(existing) ||
    existing['@_source'] !== diagnostic.code ||
    existing['@_message'] !== diagnostic.message
  ) {
    return false;
  }
  const span = reportSpan(diagnostic);
  return (
    span !== undefined &&
    Number(existing['@_line']) === span.start.line &&
    Number(existing['@_column']) === span.start.byteColumn
  );
}

function assembleCheckstyle(
  output: string,
  diagnostics: AuditDiagnostic[],
  cwd: string,
): string {
  const document = parseXmlReport(output);
  const root = requireRecord(document.checkstyle, '<checkstyle> root');
  if (diagnostics.length === 0) {
    return output;
  }
  const files = toArray(root.file).map(file => ({
    ...requireRecord(file, '<file> element'),
  }));
  for (const diagnostic of diagnostics) {
    const name = diagnostic.filePath
      ? reportPath(diagnostic.filePath, cwd)
      : 'Oxlint audit';
    let file = files.find(
      candidate =>
        typeof candidate['@_name'] === 'string' &&
        samePath(candidate['@_name'], name, cwd),
    );
    if (!file) {
      file = { '@_name': name };
      files.push(file);
    }
    const errors = toArray(file.error);
    const node = checkstyleDiagnostic(diagnostic);
    if (
      !errors.some(existing => hasCheckstyleDiagnostic(existing, diagnostic))
    ) {
      errors.push(node);
    }
    file.error = errors;
  }
  root.file = files;
  document.checkstyle = root;
  return buildXmlReport(
    document,
    '<?xml version="1.0" encoding="utf-8"?>',
    'checkstyle',
  );
}

function numericAttribute(value: unknown, name: string): number {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isSafeInteger(number) || number < 0) {
    throw new Error(`Invalid Oxlint JUnit count attribute ${name}`);
  }
  return number;
}

function assembleJunit(
  output: string,
  diagnostics: AuditDiagnostic[],
  cwd: string,
): string {
  const document = parseXmlReport(output);
  const root = requireRecord(document.testsuites, '<testsuites> root');
  if (diagnostics.length === 0) {
    return output;
  }
  const suites = toArray(root.testsuite).map(suite => ({
    ...requireRecord(suite, '<testsuite> element'),
  }));
  const tests = numericAttribute(root['@_tests'], 'tests');
  const failures = numericAttribute(root['@_failures'], 'failures');
  const grouped = new Map<string, AuditDiagnostic[]>();
  for (const diagnostic of diagnostics) {
    const suiteName = diagnostic.filePath
      ? reportPath(diagnostic.filePath, cwd)
      : 'Oxlint audit';
    let group = grouped.get(suiteName);
    if (!group) {
      group = [];
      grouped.set(suiteName, group);
    }
    group.push(diagnostic);
  }
  let addedTests = 0;
  let addedFailures = 0;
  for (const [name, group] of grouped) {
    const testCases: Record<string, unknown>[] = [];
    for (const diagnostic of group) {
      const span = reportSpan(diagnostic);
      const line = span?.start.line ?? diagnostic.line ?? 1;
      const column =
        span?.start.byteColumn ??
        (diagnostic.column === undefined ? 1 : diagnostic.column + 1);
      const testcaseName = `${diagnostic.code}:${line}:${column}`;
      const duplicate = suites.some(
        suite =>
          suite['@_name'] === name &&
          toArray(suite.testcase).some(
            testcase =>
              isRecord(testcase) && testcase['@_name'] === testcaseName,
          ),
      );
      if (duplicate) {
        continue;
      }
      testCases.push({
        '@_name': testcaseName,
        failure: {
          '@_message': diagnostic.message,
          '#text': `line ${line}, column ${column}: ${diagnostic.message}`,
        },
      });
      addedTests += 1;
      addedFailures += 1;
    }
    if (testCases.length > 0) {
      suites.push({
        '@_name': name,
        '@_tests': String(testCases.length),
        '@_disabled': '0',
        '@_errors': '0',
        '@_failures': String(testCases.length),
        testcase: testCases,
      });
    }
  }
  root['@_tests'] = String(tests + addedTests);
  root['@_failures'] = String(failures + addedFailures);
  root.testsuite = suites;
  document.testsuites = root;
  return buildXmlReport(
    document,
    '<?xml version="1.0" encoding="UTF-8"?>\n',
    'junit',
  );
}

function assembleXml(
  reports: string[],
  format: string,
  diagnostics: AuditDiagnostic[],
  cwd: string,
  errors: string[],
): string {
  const output = reports[0] ?? '';
  if (!output) {
    errors.push(`Oxlint produced no ${format} report for config group 1`);
    return output;
  }
  try {
    return format === 'checkstyle'
      ? assembleCheckstyle(output, diagnostics, cwd)
      : assembleJunit(output, diagnostics, cwd);
  } catch (error) {
    errors.push(`Could not merge Oxlint ${format} report: ${String(error)}`);
    return output;
  }
}

export function assembleOxlintReport(
  reports: string[],
  format: string,
  diagnostics: AuditDiagnostic[],
  cwd: string,
): {
  output: string;
  errors: string[];
  warningCounts: Array<number | undefined>;
} {
  const assembled = assembleOxlintReportOutput(
    reports,
    format,
    diagnostics,
    cwd,
  );
  return {
    ...assembled,
    warningCounts: reports.map(report => countReportWarnings(format, report)),
  };
}

function assembleOxlintReportOutput(
  reports: string[],
  format: string,
  diagnostics: AuditDiagnostic[],
  cwd: string,
): { output: string; errors: string[] } {
  const errors: string[] = [];
  if (format === 'json') {
    if (reports.length === 0) {
      return {
        output: assembleJson(
          [
            {
              diagnostics: [],
              number_of_files: 0,
              number_of_rules: 0,
              threads_count: 0,
              start_time: 0,
            },
          ],
          diagnostics,
          cwd,
        ),
        errors,
      };
    }
    const parsed: JsonReport[] = [];
    for (const [index, report] of reports.entries()) {
      if (!report) {
        errors.push(
          `Oxlint produced no JSON report for config group ${index + 1}`,
        );
        continue;
      }
      try {
        parsed.push(parseJsonReport(report));
      } catch (error) {
        errors.push(
          `Invalid Oxlint JSON report from group ${index + 1}: ${String(
            error,
          )}`,
        );
      }
    }
    return {
      output: parsed.length ? assembleJson(parsed, diagnostics, cwd) : '',
      errors,
    };
  }
  if (format === 'sarif') {
    if (reports.length === 0) {
      return {
        output: JSON.stringify({
          version: '2.1.0',
          $schema: SARIF_SCHEMA,
          runs: [],
        }),
        errors,
      };
    }
    const parsed: Array<Record<string, unknown> & { runs: unknown[] }> = [];
    for (const [index, report] of reports.entries()) {
      if (!report) {
        errors.push(
          `Oxlint produced no SARIF report for config group ${index + 1}`,
        );
        continue;
      }
      try {
        parsed.push(parseSarifReport(report));
      } catch (error) {
        errors.push(
          `Invalid Oxlint SARIF report from group ${index + 1}: ${String(
            error,
          )}`,
        );
      }
    }
    if (parsed.length === 0) {
      return { output: '', errors };
    }
    try {
      return { output: assembleSarif(parsed, diagnostics, cwd), errors };
    } catch (error) {
      errors.push(`Could not merge Oxlint SARIF report: ${String(error)}`);
      return { output: '', errors };
    }
  }
  if (format === 'gitlab') {
    return {
      output: assembleGitlab(reports, diagnostics, cwd, errors),
      errors,
    };
  }
  if (format === 'checkstyle' || format === 'junit') {
    return {
      output: assembleXml(reports, format, diagnostics, cwd, errors),
      errors,
    };
  }
  return {
    output: appendTextDiagnostics(reports, diagnostics, format, cwd),
    errors,
  };
}
