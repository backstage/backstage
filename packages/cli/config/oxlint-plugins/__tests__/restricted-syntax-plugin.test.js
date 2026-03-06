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

describe('restricted-syntax-plugin', () => {
  const plugin = require('../restricted-syntax-plugin.js');

  it('should export 5 rules with the correct plugin name', () => {
    expect(Object.keys(plugin.rules)).toHaveLength(5);
    expect(plugin.meta.name).toBe('restricted-syntax');
  });

  it('should use createOnce for all rules (oxlint alternative API)', () => {
    for (const [, rule] of Object.entries(plugin.rules)) {
      expect(typeof rule.createOnce).toBe('function');
    }
  });

  it('no-bare-to-lower-case: reports toLowerCase() with no args', () => {
    const reports = [];
    const context = { report: r => reports.push(r) };
    const visitors = plugin.rules['no-bare-to-lower-case'].createOnce(context);
    visitors.CallExpression({
      arguments: [],
      callee: {
        type: 'MemberExpression',
        property: { type: 'Identifier', name: 'toLowerCase' },
      },
    });
    expect(reports).toHaveLength(1);
    expect(reports[0].message).toMatch(/toLocaleLowerCase/);
  });

  it('no-bare-to-lower-case: ignores toLowerCase() with args', () => {
    const reports = [];
    const context = { report: r => reports.push(r) };
    const visitors = plugin.rules['no-bare-to-lower-case'].createOnce(context);
    visitors.CallExpression({
      arguments: ['en-US'],
      callee: {
        type: 'MemberExpression',
        property: { type: 'Identifier', name: 'toLowerCase' },
      },
    });
    expect(reports).toHaveLength(0);
  });

  it('no-bare-to-upper-case: reports toUpperCase() with no args', () => {
    const reports = [];
    const context = { report: r => reports.push(r) };
    const visitors = plugin.rules['no-bare-to-upper-case'].createOnce(context);
    visitors.CallExpression({
      arguments: [],
      callee: {
        type: 'MemberExpression',
        property: { type: 'Identifier', name: 'toUpperCase' },
      },
    });
    expect(reports).toHaveLength(1);
    expect(reports[0].message).toMatch(/toLocaleUpperCase/);
  });

  it('no-react-default-import: reports default import from react', () => {
    const reports = [];
    const context = { report: r => reports.push(r) };
    const visitors =
      plugin.rules['no-react-default-import'].createOnce(context);
    visitors.ImportDeclaration({
      source: { value: 'react' },
      specifiers: [{ type: 'ImportDefaultSpecifier' }],
    });
    expect(reports).toHaveLength(1);
    expect(reports[0].message).toMatch(/named imports/i);
  });

  it('no-react-default-import: allows named import from react', () => {
    const reports = [];
    const context = { report: r => reports.push(r) };
    const visitors =
      plugin.rules['no-react-default-import'].createOnce(context);
    visitors.ImportDeclaration({
      source: { value: 'react' },
      specifiers: [{ type: 'ImportSpecifier', imported: { name: 'useState' } }],
    });
    expect(reports).toHaveLength(0);
  });

  it('no-react-default-import: reports namespace import from react', () => {
    const reports = [];
    const context = { report: r => reports.push(r) };
    const visitors =
      plugin.rules['no-react-default-import'].createOnce(context);
    visitors.ImportDeclaration({
      source: { value: 'react' },
      specifiers: [{ type: 'ImportNamespaceSpecifier' }],
    });
    expect(reports).toHaveLength(1);
  });

  it('no-winston-default-import: reports default import from winston', () => {
    const reports = [];
    const context = { report: r => reports.push(r) };
    const visitors =
      plugin.rules['no-winston-default-import'].createOnce(context);
    visitors.ImportDeclaration({
      source: { value: 'winston' },
      specifiers: [{ type: 'ImportDefaultSpecifier' }],
    });
    expect(reports).toHaveLength(1);
    expect(reports[0].message).toMatch(/\* as winston/);
  });

  it('no-dirname-in-src: reports __dirname in src files', () => {
    const reports = [];
    const context = {
      report: r => reports.push(r),
      getPhysicalFilename: () => '/repo/packages/foo/src/index.ts',
    };
    const visitors = plugin.rules['no-dirname-in-src'].createOnce(context);
    visitors.Identifier({ name: '__dirname' });
    expect(reports).toHaveLength(1);
    expect(reports[0].message).toMatch(/resolvePackagePath/);
  });

  it('no-dirname-in-src: ignores __dirname in test files', () => {
    const reports = [];
    const context = {
      report: r => reports.push(r),
      getPhysicalFilename: () => '/repo/packages/foo/src/index.test.ts',
    };
    const visitors = plugin.rules['no-dirname-in-src'].createOnce(context);
    visitors.Identifier({ name: '__dirname' });
    expect(reports).toHaveLength(0);
  });

  it('no-dirname-in-src: ignores __dirname outside src', () => {
    const reports = [];
    const context = {
      report: r => reports.push(r),
      getPhysicalFilename: () => '/repo/packages/foo/config/setup.js',
    };
    const visitors = plugin.rules['no-dirname-in-src'].createOnce(context);
    visitors.Identifier({ name: '__dirname' });
    expect(reports).toHaveLength(0);
  });
});
