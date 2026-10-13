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

import { spawnSync } from 'node:child_process';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, relative, resolve, sep } from 'node:path';

const rootDir = resolve(__dirname, '../../../..');
const runnerSource = `
const path = require('node:path');
const root = process.env.BACKSTAGE_TEST_ROOT;
require(path.join(root, 'packages/cli/config/nodeTransform.cjs'));
if (process.env.OXLINT_NODE_PATH) process.execPath = process.env.OXLINT_NODE_PATH;
const { createCliModule } = require(path.join(root, 'packages/cli-node/src/cli-module/createCliModule.ts'));
const { runCli } = require(path.join(root, 'packages/cli-node/src/cli-module/runCli.ts'));
const { executeOxlint } = require(path.join(root, 'packages/cli-module-oxlint/src/lib/executeOxlint.ts'));
const cliPlugin = createCliModule({
  packageJson: { name: '@backstage/oxlint-dispatcher-test' },
  init: async registry => registry.addCommand({
    path: ['lint'],
    description: 'Run Oxlint fixture',
    execute: async () => executeOxlint({
      targets: JSON.parse(process.env.OXLINT_TARGETS),
      cwd: root,
      format: process.env.OXLINT_FORMAT || 'json',
      fix: process.env.OXLINT_FIX === 'true',
      oxlintBin: process.env.OXLINT_BIN || undefined,
    }),
  }),
});
runCli({ modules: [cliPlugin], name: 'oxlint-test-cli' });
`;
const fixtureLauncher = `
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
(async () => {
  const mode = process.env.OXLINT_MODE;
  if (mode === 'signal') {
    process.kill(process.pid, 'SIGTERM');
    return;
  }
  if (mode === 'invalid') {
    process.stdout.write('not JSON', () => { process.exitCode = 0; });
    return;
  }
  if (mode === 'empty') {
    process.exitCode = 1;
    return;
  }

  const auditDir = process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
  if (process.env.OXLINT_AUDIT_PATHS_FILE) {
    fs.appendFileSync(process.env.OXLINT_AUDIT_PATHS_FILE, auditDir + '\\n');
  }
  const auditFiles = JSON.parse(process.env.OXLINT_AUDIT_FILES || '[]');
  const strict = mode === 'audit' ||
    (mode === 'mixed' && process.argv.includes(process.env.OXLINT_STRICT_TARGET));
  if (strict) {
    const auditState = process.env.OXLINT_AUDIT_STATE;
    if (auditState !== 'receipt-without-marker') {
      fs.writeFileSync(
        path.join(auditDir, 'strict.json'),
        JSON.stringify({ version: auditState === 'invalid-marker' ? 2 : 1 }),
      );
    }
    await Promise.all((auditState === 'missing-receipts' ? [] : auditFiles).map(filePath =>
      fs.promises.writeFile(
        path.join(auditDir, 'file-' + randomUUID() + '.json'),
        auditState === 'invalid-json'
          ? 'not JSON'
          : JSON.stringify({
              version: 1,
              filePath: auditState === 'missing-file'
                ? path.join(auditDir, 'missing-source.js')
                : filePath,
            }),
      ),
    ));
    if (process.env.OXLINT_FINAL_SOURCE !== undefined) {
      fs.writeFileSync(process.env.OXLINT_FIX_FILE, process.env.OXLINT_FINAL_SOURCE);
    }
  }

  const size = Number(process.env.OXLINT_MESSAGE_SIZE || 0);
  const format = process.env.OXLINT_FORMAT || 'json';
  const message = mode === 'large' ? 'x'.repeat(size) : 'fixture diagnostic';
  const numberOfFiles = mode === 'audit' || mode === 'mixed'
    ? new Set(auditFiles).size
    : 1;
  let report;
  if (format === 'json') {
    report = JSON.stringify({
      diagnostics: mode === 'large'
        ? [{ message }]
        : [{ message, code: 'fixture/native', severity: 'warning', filename: 'native.js', labels: [], related: [] }],
      number_of_files: numberOfFiles,
      number_of_rules: 1,
      threads_count: 1,
      start_time: 0.01,
    });
  } else if (format === 'sarif') {
    report = JSON.stringify({
      version: '2.1.0',
      $schema: 'https://example.test/sarif-schema.json',
      runs: [{ tool: { driver: { name: 'oxlint', rules: [] } }, results: [] }],
    });
  } else if (format === 'gitlab') {
    report = JSON.stringify([{
      description: 'fixture diagnostic',
      check_name: 'fixture/native',
      fingerprint: 'fixture-native',
      severity: 'major',
      location: { path: 'native.js', lines: { begin: 1, end: 1 } },
    }]);
  } else if (format === 'checkstyle') {
    report = '<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3"><file name="native.js"><error line="1" column="1" severity="warning" message="Native &amp; warning" source="fixture/native" /></file></checkstyle>';
  } else if (format === 'junit') {
    report = '<?xml version="1.0" encoding="UTF-8"?><testsuites name="Oxlint" tests="1" failures="1" errors="0"><testsuite name="native.js" tests="1" disabled="0" errors="0" failures="1"><testcase name="fixture/native"><failure message="Native warning">line 1, column 1</failure></testcase></testsuite></testsuites>';
  } else {
    report = 'native ' + format + ' report\\n';
  }
  if (process.env.OXLINT_CUSTOM_REPORT !== undefined) {
    report = process.env.OXLINT_CUSTOM_REPORT;
  }
  process.stdout.write(report, () => {
    process.exitCode = Number(process.env.OXLINT_EXIT_CODE || 0);
  });
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
`;

function createWorkspace() {
  const dir = mkdtempSync(join(tmpdir(), 'oxlint-dispatcher-'));
  const runner = join(dir, 'runner.cjs');
  const launcher = join(dir, 'oxlint-fixture.cjs');
  writeFileSync(runner, runnerSource);
  writeFileSync(launcher, fixtureLauncher);
  return { dir, runner, launcher };
}

function runDispatcher(
  workspace: ReturnType<typeof createWorkspace>,
  options: {
    targets?: { configDir: string; directories: string[] }[];
    mode?: string;
    launcher?: string | null;
    exitCode?: number;
    messageSize?: number;
    nodePath?: string;
    format?: string;
    fix?: boolean;
    auditFiles?: string[];
    auditPathFile?: string;
    inheritedAuditDir?: string;
    finalSource?: string;
    auditState?: string;
    strictTarget?: string;
    nativeReport?: string;
  } = {},
) {
  const result = spawnSync(process.execPath, [workspace.runner, 'lint'], {
    cwd: rootDir,
    encoding: 'utf8',
    maxBuffer: 128 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      BACKSTAGE_TEST_ROOT: rootDir,
      OXLINT_TARGETS: JSON.stringify(
        options.targets ?? [
          { configDir: workspace.dir, directories: [workspace.dir] },
        ],
      ),
      OXLINT_BIN:
        options.launcher === null ? '' : options.launcher ?? workspace.launcher,
      OXLINT_MODE: options.mode ?? 'report',
      OXLINT_EXIT_CODE: String(options.exitCode ?? 0),
      OXLINT_MESSAGE_SIZE: String(options.messageSize ?? 0),
      OXLINT_NODE_PATH: options.nodePath ?? '',
      OXLINT_FORMAT: options.format ?? 'json',
      OXLINT_FIX: String(options.fix ?? false),
      OXLINT_AUDIT_FILES: JSON.stringify(options.auditFiles ?? []),
      OXLINT_AUDIT_PATHS_FILE: options.auditPathFile ?? '',
      OXLINT_FIX_FILE: options.auditFiles?.[0] ?? '',
      OXLINT_FINAL_SOURCE: options.finalSource,
      OXLINT_AUDIT_STATE: options.auditState ?? '',
      OXLINT_STRICT_TARGET: options.strictTarget ?? '',
      OXLINT_CUSTOM_REPORT: options.nativeReport,
      BACKSTAGE_OXLINT_AUDIT_DIR: options.inheritedAuditDir ?? '',
    },
  });
  return {
    status: result.status,
    signal: result.signal,
    stdout: result.stdout ?? '',
    stdoutBytes: Buffer.byteLength(result.stdout ?? ''),
    stderr: result.stderr ?? '',
  };
}

describe('Oxlint through runCli subprocess', () => {
  it('fails blanket and self-suppression bypasses and replaces inherited audit paths', () => {
    const workspace = createWorkspace();
    const sourceFile = join(workspace.dir, 'selected.js');
    const auditPathFile = join(workspace.dir, 'audit-paths.txt');
    writeFileSync(
      sourceFile,
      '/* oxlint-disable * -- no reason */\n/* oxlint-disable backstage/no-unexplained-suppressions -- self */\n',
    );
    writeFileSync(auditPathFile, '');
    try {
      const result = runDispatcher(workspace, {
        mode: 'audit',
        auditFiles: [sourceFile],
        auditPathFile,
        inheritedAuditDir: workspace.dir,
      });

      expect(result.status).toBe(1);
      const report = JSON.parse(result.stdout);
      const diagnostics = report.diagnostics.filter(
        (diagnostic: { code?: string }) =>
          diagnostic.code === 'backstage/no-unexplained-suppressions',
      );
      expect(diagnostics).toHaveLength(2);
      expect(
        diagnostics.map(
          (diagnostic: { filename: string }) => diagnostic.filename,
        ),
      ).toEqual([
        relative(rootDir, sourceFile).split(sep).join('/'),
        relative(rootDir, sourceFile).split(sep).join('/'),
      ]);
      expect(readFileSync(auditPathFile, 'utf8').trim()).not.toBe(
        workspace.dir,
      );
      expect(result.stderr).toContain("Command 'oxlint' exited with code 1");
    } finally {
      rmSync(workspace.dir, { recursive: true, force: true });
    }
  });

  it('accepts URL explanations without scanning ignored files or comment-like text', () => {
    const workspace = createWorkspace();
    const selectedFile = join(workspace.dir, 'selected.jsx');
    const ignoredFile = join(workspace.dir, 'ignored.js');
    writeFileSync(
      selectedFile,
      [
        `const text = 'eslint-disable * -- TODO';`,
        'const template = `oxlint-disable * -- TODO`;',
        'const element = <p>eslint-disable * -- TODO</p>;',
        '// eslint-disable-next-line no-console -- https://example.com/issues/123',
        'console.log("x");',
      ].join('\n'),
    );
    writeFileSync(ignoredFile, '/* eslint-disable * -- no reason */');
    try {
      const result = runDispatcher(workspace, {
        mode: 'audit',
        auditFiles: [selectedFile],
      });

      expect(result.status).toBe(0);
      const report = JSON.parse(result.stdout);
      expect(
        report.diagnostics.some(
          (diagnostic: { code?: string }) =>
            diagnostic.code === 'backstage/no-unexplained-suppressions',
        ),
      ).toBe(false);
    } finally {
      rmSync(workspace.dir, { recursive: true, force: true });
    }
  });

  it('deduplicates concurrent receipts and allows a strict empty selection', () => {
    const workspace = createWorkspace();
    const sourceFile = join(workspace.dir, 'selected.js');
    writeFileSync(
      sourceFile,
      '// eslint-disable-next-line no-console\nconsole.log("x");',
    );
    try {
      const duplicate = runDispatcher(workspace, {
        mode: 'audit',
        auditFiles: [sourceFile, sourceFile],
      });
      expect(duplicate.status).toBe(1);
      expect(
        JSON.parse(duplicate.stdout).diagnostics.filter(
          (diagnostic: { code?: string }) =>
            diagnostic.code === 'backstage/no-unexplained-suppressions',
        ),
      ).toHaveLength(1);

      const empty = runDispatcher(workspace, { mode: 'audit' });
      expect(empty.status).toBe(0);
      expect(
        JSON.parse(empty.stdout).diagnostics.some(
          (diagnostic: { code?: string }) =>
            diagnostic.code === 'backstage/oxlint-audit',
        ),
      ).toBe(false);
    } finally {
      rmSync(workspace.dir, { recursive: true, force: true });
    }
  });

  it('validates final post-fix contents after collecting receipts', () => {
    const workspace = createWorkspace();
    const sourceFile = join(workspace.dir, 'selected.js');
    writeFileSync(
      sourceFile,
      '// eslint-disable-next-line no-console -- https://example.com/issue\nconsole.log("x");',
    );
    try {
      const result = runDispatcher(workspace, {
        mode: 'audit',
        fix: true,
        auditFiles: [sourceFile],
        finalSource: '/* oxlint-disable * -- no reason */',
      });

      expect(result.status).toBe(1);
      expect(readFileSync(sourceFile, 'utf8')).toBe(
        '/* oxlint-disable * -- no reason */',
      );
      expect(
        JSON.parse(result.stdout).diagnostics.some(
          (diagnostic: { code?: string }) =>
            diagnostic.code === 'backstage/no-unexplained-suppressions',
        ),
      ).toBe(true);
    } finally {
      rmSync(workspace.dir, { recursive: true, force: true });
    }
  });

  it('keeps mixed compatibility and strict groups isolated', () => {
    const workspace = createWorkspace();
    const compatibilityDir = join(workspace.dir, 'compatibility');
    const strictDir = join(workspace.dir, 'strict');
    const sourceFile = join(strictDir, 'selected.js');
    const auditPathFile = join(workspace.dir, 'audit-paths.txt');
    mkdirSync(compatibilityDir);
    mkdirSync(strictDir);
    writeFileSync(
      join(compatibilityDir, 'oxlint.config.mts'),
      'export default {};',
    );
    writeFileSync(join(strictDir, 'oxlint.config.mts'), 'export default {};');
    writeFileSync(sourceFile, '/* oxlint-disable * -- no reason */');
    writeFileSync(auditPathFile, '');
    try {
      const result = runDispatcher(workspace, {
        mode: 'mixed',
        targets: [
          { configDir: compatibilityDir, directories: [compatibilityDir] },
          { configDir: strictDir, directories: [strictDir] },
        ],
        auditFiles: [sourceFile],
        auditPathFile,
        inheritedAuditDir: workspace.dir,
        strictTarget: strictDir,
      });

      expect(result.status).toBe(1);
      const report = JSON.parse(result.stdout);
      expect(report.groups).toHaveLength(2);
      expect(
        report.diagnostics.filter(
          (diagnostic: { code?: string }) =>
            diagnostic.code === 'backstage/no-unexplained-suppressions',
        ),
      ).toHaveLength(1);
      const auditDirs = readFileSync(auditPathFile, 'utf8')
        .trim()
        .split(/\r?\n/);
      expect(auditDirs).toHaveLength(2);
      expect(new Set(auditDirs).size).toBe(2);
      expect(auditDirs).not.toContain(workspace.dir);
    } finally {
      rmSync(workspace.dir, { recursive: true, force: true });
    }
  });

  it.each([
    'invalid-json',
    'invalid-marker',
    'receipt-without-marker',
    'missing-file',
    'missing-receipts',
  ])('fails closed on malformed audit state: %s', auditState => {
    const workspace = createWorkspace();
    const sourceFile = join(workspace.dir, 'selected.js');
    writeFileSync(sourceFile, '/* oxlint-disable * -- no reason */');
    try {
      const result = runDispatcher(workspace, {
        mode: 'audit',
        auditFiles: [sourceFile],
        auditState,
        exitCode: 1,
      });

      expect(result.status).toBe(1);
      expect(JSON.parse(result.stdout).diagnostics).toContainEqual(
        expect.objectContaining({ code: 'backstage/oxlint-audit' }),
      );
      expect(result.stderr).toContain('audit');
    } finally {
      rmSync(workspace.dir, { recursive: true, force: true });
    }
  });

  it.each([
    ['malformed XML', '<checkstyle><file name="native.js">'],
    [
      'external entity declaration',
      '<!DOCTYPE checkstyle [<!ENTITY external SYSTEM "file:///not-read">]><checkstyle version="4.3"><file name="native.js" /></checkstyle>',
    ],
  ])(
    'fails closed on %s without replacing native output',
    (_name, nativeReport) => {
      const workspace = createWorkspace();
      const sourceFile = join(workspace.dir, 'selected.js');
      writeFileSync(sourceFile, '/* oxlint-disable * -- no reason */');
      try {
        const result = runDispatcher(workspace, {
          mode: 'audit',
          auditFiles: [sourceFile],
          format: 'checkstyle',
          nativeReport,
        });

        expect(result.status).toBe(1);
        expect(result.stdout).toBe(nativeReport);
        expect(result.stderr).toContain(
          'Could not merge Oxlint checkstyle report',
        );
      } finally {
        rmSync(workspace.dir, { recursive: true, force: true });
      }
    },
  );

  it.each([
    'json',
    'sarif',
    'gitlab',
    'checkstyle',
    'junit',
    'default',
    'stylish',
    'unix',
    'github',
  ])('merges unsuppressible audit errors into valid %s output', format => {
    const workspace = createWorkspace();
    const sourceFile = join(workspace.dir, 'selected.js');
    const source =
      format === 'gitlab'
        ? 'const marker = "🙂"; /* oxlint-disable * -- no reason */ /* oxlint-disable * -- no reason */'
        : 'const marker = "🙂"; /* oxlint-disable * -- no reason */';
    writeFileSync(sourceFile, source);
    const issueOffset = source.indexOf('oxlint-disable');
    const lineStart = source.lastIndexOf('\n', issueOffset) + 1;
    const expectedByteColumn =
      Buffer.byteLength(source.slice(lineStart, issueOffset)) + 1;
    const expectedCodePointColumn =
      Array.from(source.slice(lineStart, issueOffset)).length + 1;
    const expectedByteOffset = Buffer.byteLength(source.slice(0, issueOffset));
    try {
      const result = runDispatcher(workspace, {
        mode: 'audit',
        auditFiles: [sourceFile],
        format,
      });

      expect(result.status).toBe(1);
      if (format === 'json') {
        const report = JSON.parse(result.stdout);
        expect(report.diagnostics).toContainEqual(
          expect.objectContaining({
            code: 'backstage/no-unexplained-suppressions',
            severity: 'error',
          }),
        );
        expect(report.number_of_rules).toBe(1);
        const diagnostic = report.diagnostics.find(
          (item: { code?: string }) =>
            item.code === 'backstage/no-unexplained-suppressions',
        );
        expect(diagnostic.labels[0].span).toMatchObject({
          offset: expectedByteOffset,
          column: expectedByteColumn,
        });
      } else if (format === 'sarif') {
        const report = JSON.parse(result.stdout);
        expect(report.version).toBe('2.1.0');
        const diagnostic = report.runs[0].results.find(
          (item: { ruleId?: string }) =>
            item.ruleId === 'backstage/no-unexplained-suppressions',
        );
        expect(diagnostic.locations[0].physicalLocation.region).toMatchObject({
          startColumn: expectedCodePointColumn,
        });
      } else if (format === 'gitlab') {
        const report = JSON.parse(result.stdout);
        expect(
          report.filter(
            (item: { check_name?: string }) =>
              item.check_name === 'backstage/no-unexplained-suppressions',
          ),
        ).toHaveLength(2);
        expect(report[0].check_name).toBe('fixture/native');
      } else if (format === 'checkstyle' || format === 'junit') {
        expect(XMLValidator.validate(result.stdout)).toBe(true);
        const report = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: '@_',
        }).parse(result.stdout);
        if (format === 'checkstyle') {
          type XmlError = { '@_source'?: string; '@_column'?: string };
          const files: Array<{ error: XmlError | XmlError[] }> = Array.isArray(
            report.checkstyle.file,
          )
            ? report.checkstyle.file
            : [report.checkstyle.file];
          expect(
            files.flatMap(file =>
              Array.isArray(file.error) ? file.error : [file.error],
            ),
          ).toContainEqual(
            expect.objectContaining({
              '@_source': 'backstage/no-unexplained-suppressions',
              '@_severity': 'error',
            }),
          );
          expect(JSON.stringify(report)).toContain('fixture/native');
          expect(JSON.stringify(report)).toContain('Native & warning');
          const errors = files.flatMap(file =>
            Array.isArray(file.error) ? file.error : [file.error],
          );
          expect(
            errors.find(
              (error: { '@_source'?: string }) =>
                error['@_source'] === 'backstage/no-unexplained-suppressions',
            )?.['@_column'],
          ).toBe(String(expectedByteColumn));
        } else {
          expect(report.testsuites['@_tests']).toBe('2');
          expect(report.testsuites['@_failures']).toBe('2');
          expect(JSON.stringify(report)).toContain('fixture/native');
        }
      } else {
        expect(result.stdout).toContain(
          'backstage/no-unexplained-suppressions',
        );
        expect(result.stdout).toContain('native');
      }
      expect(result.stderr).toContain("Command 'oxlint' exited with code 1");
    } finally {
      rmSync(workspace.dir, { recursive: true, force: true });
    }
  });

  it.each([0, 1])(
    'pipes complete 65 MiB reports before runCli exits with code %i',
    fixtureExitCode => {
      const workspace = createWorkspace();
      const messageSize = 65 * 1024 * 1024;
      try {
        const result = runDispatcher(workspace, {
          mode: 'large',
          messageSize,
          exitCode: fixtureExitCode,
        });

        expect(result.status).toBe(fixtureExitCode);
        expect(result.stdoutBytes).toBe(68_157_548);
        expect(JSON.parse(result.stdout).diagnostics[0].message).toHaveLength(
          messageSize,
        );
      } finally {
        rmSync(workspace.dir, { recursive: true, force: true });
      }
    },
    60000,
  );

  it('preserves nested-config JSON with null rule counts and exits nonzero for findings', () => {
    const workspace = createWorkspace();
    const nested = join(workspace.dir, 'child');
    try {
      writeFileSync(join(workspace.dir, 'root.js'), 'debugger;\n');
      mkdirSync(nested);
      writeFileSync(join(nested, 'child.js'), 'debugger;\n');
      writeFileSync(
        join(nested, '.oxlintrc.json'),
        JSON.stringify({ rules: { 'no-debugger': 'error' } }),
      );

      const result = runDispatcher(workspace, {
        launcher: null,
        targets: [
          {
            configDir: workspace.dir,
            directories: [
              join(workspace.dir, 'root.js'),
              join(nested, 'child.js'),
            ],
          },
        ],
      });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("Command 'oxlint' exited with code 1");
      const report = JSON.parse(result.stdout);

      const noDebuggerDiagnostics = report.diagnostics.filter(
        (diagnostic: { code: string }) =>
          diagnostic.code === 'eslint(no-debugger)',
      );
      expect(noDebuggerDiagnostics).toHaveLength(2);
      expect(
        noDebuggerDiagnostics
          .map((diagnostic: { filename: string }) =>
            basename(diagnostic.filename),
          )
          .sort(),
      ).toEqual(['child.js', 'root.js']);
      expect(report.number_of_files).toBe(2);
      expect(report.number_of_rules).toBeNull();
    } finally {
      rmSync(workspace.dir, { recursive: true, force: true });
    }
  });

  it('audits native-selected files from the strict factory and reports failures', () => {
    const workspace = createWorkspace();
    const packageDir = mkdtempSync(join(tmpdir(), 'oxlint-strict-package-'));
    const sourceDir = join(packageDir, 'src');
    const sourceFile = join(sourceDir, 'index.js');
    const configFile = join(packageDir, '.oxlintrc.js');

    try {
      mkdirSync(sourceDir, { recursive: true });
      writeFileSync(
        join(packageDir, 'package.json'),
        JSON.stringify({
          name: '@internal/oxlint-strict-e2e',
          backstage: { role: 'node-library' },
        }),
      );
      symlinkSync(
        join(rootDir, 'node_modules'),
        join(packageDir, 'node_modules'),
        process.platform === 'win32' ? 'junction' : 'dir',
      );
      writeFileSync(
        sourceFile,
        '/* eslint-disable * -- TODO */\nexport const answer = 42;\n',
      );
      writeFileSync(
        configFile,
        "module.exports = require('@backstage/cli-module-oxlint/oxlint-factory')(__dirname, { preset: 'strict' });\n",
      );

      const result = runDispatcher(workspace, {
        launcher: null,
        targets: [{ configDir: packageDir, directories: [sourceDir] }],
      });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain("Command 'oxlint' exited with code 1");
      const report = JSON.parse(result.stdout);
      const diagnostics = report.diagnostics.filter(
        (diagnostic: { code?: string }) =>
          diagnostic.code === 'backstage/no-unexplained-suppressions',
      );
      expect(diagnostics).toHaveLength(1);
      expect(diagnostics[0].filename).toBe(
        relative(rootDir, sourceFile).split(sep).join('/'),
      );
      expect(report.number_of_files).toBe(1);
    } finally {
      rmSync(packageDir, { recursive: true, force: true });
      rmSync(workspace.dir, { recursive: true, force: true });
    }
  });

  it('exits nonzero through runCli when spawnSync returns null status and ENOENT', () => {
    const workspace = createWorkspace();
    try {
      const result = runDispatcher(workspace, {
        nodePath: join(workspace.dir, 'missing-node.exe'),
      });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain('ENOENT');
      expect(result.stdout).toBe('');
    } finally {
      rmSync(workspace.dir, { recursive: true, force: true });
    }
  });

  it.each([
    [
      'launcher failure',
      'missing-launcher.cjs',
      undefined,
      'exited with code 1',
    ],
    ['signal termination', undefined, 'signal', 'exited with code 1'],
    ['invalid JSON', undefined, 'invalid', 'Invalid Oxlint JSON report'],
    ['empty failed report', undefined, 'empty', 'no JSON report'],
  ])(
    'exits nonzero through runCli for %s',
    (_name, launcherName, mode, diagnostic) => {
      const workspace = createWorkspace();
      try {
        const result = runDispatcher(workspace, {
          launcher: launcherName
            ? join(workspace.dir, launcherName)
            : workspace.launcher,
          mode,
        });

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(diagnostic);
        expect(result.stdout).not.toContain('"diagnostics":[]');
        if (mode === 'invalid' || mode === 'empty') {
          expect(result.stdout).toBe('');
        }
      } finally {
        rmSync(workspace.dir, { recursive: true, force: true });
      }
    },
  );
});
