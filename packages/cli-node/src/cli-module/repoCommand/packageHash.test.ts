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

import { createPackageHasher } from './packageHash';

function node(name: string, deps: string[] = []) {
  const n: any = {
    name,
    packageJson: { name },
    dir: `/repo/${name}`,
    allLocalDependencies: new Map(),
    _deps: deps,
  };
  return n;
}

describe('createPackageHasher', () => {
  const files: Record<string, Record<string, string>> = {
    a: { 'src/index.ts': 'a1' },
    b: { 'src/index.ts': 'b1' },
    c: { 'src/index.ts': 'c1' },
  };
  const nodes = new Map([
    ['a', node('a', ['b'])],
    ['b', node('b', ['c'])],
    ['c', node('c')],
  ]);
  for (const n of nodes.values()) {
    for (const dep of n._deps) {
      n.allLocalDependencies.set(dep, nodes.get(dep));
    }
  }
  const graph: any = {
    get: (name: string) => nodes.get(name),
    collectPackageNames: (
      start: string[],
      edges: (n: any) => Iterable<string>,
    ) => {
      const result = new Set<string>();
      const queue = [...start];
      while (queue.length) {
        const name = queue.shift()!;
        if (!result.has(name)) {
          result.add(name);
          queue.push(...edges(nodes.get(name)));
        }
      }
      return result;
    },
  };
  const deps = {
    listFiles: async (dir: string) => Object.keys(files[dir.split('/')[2]]),
    readFile: async (file: string) => {
      const [, , name, ...rest] = file.split('/');
      const content = files[name]?.[rest.join('/')];
      if (content === undefined) {
        throw Object.assign(new Error('missing'), { code: 'ENOENT' });
      }
      return Buffer.from(content);
    },
  };
  const lockfile: any = {
    getDependencyTreeHash: (name: string) => `lock-${name}`,
  };

  const hash = (name: string, args: string[] = [], target = 'test') =>
    createPackageHasher({
      graph,
      lockfile,
      target: { name: target, packageCommand: ['package', 'test'] },
      deps,
    })({ pkg: nodes.get(name), scriptArgs: [] } as any, args);

  it('changes with its own contents, transitive dependencies, args and target', async () => {
    const base = await hash('a');
    expect(await hash('a')).toBe(base);

    expect(await hash('a', ['--x'])).not.toBe(base);
    expect(await hash('a', [], 'other')).not.toBe(base);
    // Only the package itself matters for a package without dependents
    const cBase = await hash('c');

    files.c['src/index.ts'] = 'c2';
    expect(await hash('a')).not.toBe(base);
    expect(await hash('c')).not.toBe(cBase);
    files.c['src/index.ts'] = 'c1';

    files.a['src/new.ts'] = 'uncommitted';
    expect(await hash('a')).not.toBe(base);
    expect(await hash('c')).toBe(cBase);
  });
});
