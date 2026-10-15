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

import { execFileSync } from 'node:child_process';
import { ModuleFormat, rollup } from 'rollup';
import { cjsNamedImports } from './cjsNamedImports';

async function build(source: string, format: ModuleFormat = 'es') {
  const bundle = await rollup({
    input: 'entry',
    external: id => id !== 'entry',
    plugins: [
      {
        name: 'virtual-entry',
        resolveId: id => (id === 'entry' ? id : null),
        load: id => (id === 'entry' ? source : null),
      },
    ],
  });
  const { output } = await bundle.generate({
    format,
    plugins: [cjsNamedImports()],
  });
  return output[0].code;
}

describe('cjsNamedImports', () => {
  it('should rewrite named imports and re-exports of packages', async () => {
    const code = await build(`
      import def, { get, merge as m, 'odd-name' as odd } from 'lodash';
      import { join } from 'node:path';
      import { readFile } from 'fs';
      import { local } from './local';
      import * as ns from 'ns-pkg';
      export { Router, static as serveStatic } from 'express';
      export { local as other } from './local';
      console.log(def, get, m, odd, join, readFile, local, ns);
    `);

    expect(code).toContain(
      `import def, * as __cjsInterop0 from "lodash"; const get = ("get" in __cjsInterop0 ? __cjsInterop0["get"] : __cjsInterop0.default?.["get"]), merge = ("merge" in __cjsInterop0 ? __cjsInterop0["merge"] : __cjsInterop0.default?.["merge"]), oddName = ("odd-name" in __cjsInterop0 ? __cjsInterop0["odd-name"] : __cjsInterop0.default?.["odd-name"]);`,
    );
    expect(code).toContain(
      `import * as __cjsInterop1 from "express"; const __cjsInterop1_0 = ("Router" in __cjsInterop1 ? __cjsInterop1["Router"] : __cjsInterop1.default?.["Router"]), __cjsInterop1_1 = ("static" in __cjsInterop1 ? __cjsInterop1["static"] : __cjsInterop1.default?.["static"]); export { __cjsInterop1_0 as Router, __cjsInterop1_1 as serveStatic };`,
    );
    // Built-in modules, relative imports, and namespace imports are unchanged
    expect(code).toContain(`import { join } from 'node:path';`);
    expect(code).toContain(`import { readFile } from 'fs';`);
    expect(code).toMatch(/^import { local } from '[^']+local';$/m);
    expect(code).toContain(`import * as ns from 'ns-pkg';`);
    expect(code).toMatch(/^export { local as other } from '[^']+local';$/m);
  });

  it('should not modify CommonJS output', async () => {
    const code = await build(
      `import { get } from 'lodash'; console.log(get);`,
      'cjs',
    );
    expect(code).not.toContain('__cjsInterop');
    expect(code).toContain(`require('lodash')`);
  });

  it('should load named exports from CommonJS and ES modules', async () => {
    const code = await build(`
      import { get } from 'lodash';
      import { readJson } from 'fs-extra';
      import { rollup } from 'rollup';
      console.log(JSON.stringify([typeof get, typeof readJson, typeof rollup]));
    `);
    const output = execFileSync('node', ['--input-type=module', '-e', code], {
      cwd: __dirname,
      encoding: 'utf8',
    });
    expect(JSON.parse(output)).toEqual(['function', 'function', 'function']);
  });
});
