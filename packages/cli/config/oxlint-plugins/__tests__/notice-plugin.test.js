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

describe('notice-plugin', () => {
  const plugin = require('../notice-plugin.js');

  it('should export the correct plugin structure', () => {
    expect(plugin.meta.name).toBe('notice');
    expect(plugin.rules.notice).toBeDefined();
    expect(typeof plugin.rules.notice.createOnce).toBe('function');
  });

  it('should report missing copyright header', () => {
    const reports = [];
    const context = {
      getSourceCode: () => ({ getText: () => 'const x = 1;' }),
      report: r => reports.push(r),
    };
    const visitors = plugin.rules.notice.createOnce(context);
    visitors.Program({});
    expect(reports).toHaveLength(1);
    expect(reports[0].message).toMatch(/copyright header/i);
  });

  it('should not report valid copyright header', () => {
    const reports = [];
    const validSource =
      '/*\n * Copyright 2026 The Backstage Authors\n *\n * Licensed under the Apache License, Version 2.0';
    const context = {
      getSourceCode: () => ({ getText: () => validSource }),
      report: r => reports.push(r),
    };
    const visitors = plugin.rules.notice.createOnce(context);
    visitors.Program({});
    expect(reports).toHaveLength(0);
  });

  it('should provide a fixer that prepends the header', () => {
    const reports = [];
    const context = {
      getSourceCode: () => ({ getText: () => 'const x = 1;' }),
      report: r => reports.push(r),
    };
    const visitors = plugin.rules.notice.createOnce(context);
    visitors.Program({});
    expect(reports).toHaveLength(1);
    expect(typeof reports[0].fix).toBe('function');

    const fixResult = [];
    const fixer = {
      insertTextBeforeRange: (_range, text) => {
        fixResult.push(text);
        return text;
      },
    };
    reports[0].fix(fixer);
    expect(fixResult).toHaveLength(1);
    expect(fixResult[0]).toContain('Copyright');
    expect(fixResult[0]).toContain('Apache License, Version 2.0');
  });

  it('should not report valid header after a shebang', () => {
    const reports = [];
    const validSource =
      '#!/usr/bin/env node\n/*\n * Copyright 2026 The Backstage Authors\n *\n * Licensed under the Apache License, Version 2.0';
    const context = {
      getSourceCode: () => ({ getText: () => validSource }),
      report: r => reports.push(r),
    };
    const visitors = plugin.rules.notice.createOnce(context);
    visitors.Program({});
    expect(reports).toHaveLength(0);
  });

  it('should insert header after shebang, not before it', () => {
    const reports = [];
    const source = '#!/usr/bin/env node\nconst x = 1;';
    const context = {
      getSourceCode: () => ({ getText: () => source }),
      report: r => reports.push(r),
    };
    const visitors = plugin.rules.notice.createOnce(context);
    visitors.Program({});
    expect(reports).toHaveLength(1);

    const ranges = [];
    const fixer = {
      insertTextBeforeRange: (range, text) => {
        ranges.push({ range, text });
        return text;
      },
    };
    reports[0].fix(fixer);
    expect(ranges).toHaveLength(1);
    expect(ranges[0].range[0]).toBe('#!/usr/bin/env node\n'.length);
  });
});
