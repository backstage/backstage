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

describe('backstage-plugin', () => {
  const plugin = require('../backstage-plugin.js');

  it('should export 6 rules with the correct plugin name', () => {
    expect(Object.keys(plugin.rules)).toHaveLength(6);
    expect(plugin.meta.name).toBe('backstage');
  });

  it('should use createOnce for all rules (oxlint alternative API)', () => {
    for (const [, rule] of Object.entries(plugin.rules)) {
      expect(typeof rule.createOnce).toBe('function');
    }
  });

  it('no-top-level-material-ui-4-imports: reports top-level @material-ui/core import', () => {
    const reports = [];
    const context = { report: r => reports.push(r) };
    const visitors =
      plugin.rules['no-top-level-material-ui-4-imports'].createOnce(context);

    const node = {
      source: { value: '@material-ui/core' },
      specifiers: [
        {
          type: 'ImportSpecifier',
          imported: { type: 'Identifier', name: 'Button' },
          local: { name: 'Button' },
        },
        {
          type: 'ImportSpecifier',
          imported: { type: 'Identifier', name: 'makeStyles' },
          local: { name: 'makeStyles' },
        },
      ],
    };
    visitors.ImportDeclaration(node);
    expect(reports).toHaveLength(1);
    expect(reports[0].messageId).toBe('topLevelImport');

    // Test fixer produces correct deep imports
    const fixResult = [];
    const fixer = {
      replaceText: (_n, text) => {
        fixResult.push(text);
        return text;
      },
    };
    reports[0].fix(fixer);
    expect(fixResult[0]).toContain(
      "import Button from '@material-ui/core/Button'",
    );
    expect(fixResult[0]).toContain(
      "import { makeStyles } from '@material-ui/core/styles'",
    );
  });

  it('no-top-level-material-ui-4-imports: ignores deep imports', () => {
    const reports = [];
    const context = { report: r => reports.push(r) };
    const visitors =
      plugin.rules['no-top-level-material-ui-4-imports'].createOnce(context);
    visitors.ImportDeclaration({
      source: { value: '@material-ui/core/Button' },
      specifiers: [
        {
          type: 'ImportDefaultSpecifier',
          local: { name: 'Button' },
        },
      ],
    });
    expect(reports).toHaveLength(0);
  });

  it('no-top-level-material-ui-4-imports: ignores @material-ui/core/styles', () => {
    const reports = [];
    const context = { report: r => reports.push(r) };
    const visitors =
      plugin.rules['no-top-level-material-ui-4-imports'].createOnce(context);
    visitors.ImportDeclaration({
      source: { value: '@material-ui/core/styles' },
      specifiers: [
        {
          type: 'ImportSpecifier',
          imported: { type: 'Identifier', name: 'makeStyles' },
          local: { name: 'makeStyles' },
        },
      ],
    });
    expect(reports).toHaveLength(0);
  });

  it('no-undeclared-imports: throws in before() for nonexistent cwd', () => {
    const context = {
      getCwd: () => '/nonexistent',
      cwd: '/nonexistent',
      getPhysicalFilename: () => '/nonexistent/test.ts',
      report: () => {},
    };
    // With createOnce, the throw happens in before() instead of create(),
    // because per-file context access is deferred to hooks/visitors.
    const visitors = plugin.rules['no-undeclared-imports'].createOnce(context);
    expect(() => visitors.before()).toThrow();
  });
});
