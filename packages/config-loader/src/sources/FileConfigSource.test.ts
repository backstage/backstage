/*
 * Copyright 2023 The Backstage Authors
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

import os from 'os';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { FileConfigSource } from './FileConfigSource';
import { readN } from './__testUtils__/testUtils';

const tmpDirs = new Array<string>();

async function tmpFiles(files: Record<string, string>) {
  const tmpDir = await fs.mkdtemp(
    resolvePath(os.tmpdir(), 'backstage-unit-test-fixture-'),
  );
  tmpDirs.push(tmpDir);

  for (const [name, content] of Object.entries(files)) {
    await fs.writeFile(resolvePath(tmpDir, name), content, 'utf8');
  }

  return {
    resolve(...paths: string[]) {
      return resolvePath(tmpDir, ...paths);
    },
    write: async (name: string, content: string) => {
      await fs.writeFile(resolvePath(tmpDir, name), content, 'utf8');
    },
  };
}

describe('FileConfigSource', () => {
  afterEach(async () => {
    for (const tmpDir of tmpDirs) {
      await fs.remove(tmpDir);
    }
  });

  it('should read a config file', async () => {
    const tmp = await tmpFiles({ 'a.yaml': 'a: 1' });

    const source = FileConfigSource.create({ path: tmp.resolve('a.yaml') });

    await expect(readN(source, 1)).resolves.toEqual([
      [{ data: { a: 1 }, context: 'a.yaml', path: tmp.resolve('a.yaml') }],
    ]);
  });

  it('should watch config files', async () => {
    const tmp = await tmpFiles({ 'a.yaml': 'a: 1' });

    const source = FileConfigSource.create({ path: tmp.resolve('a.yaml') });

    setTimeout(() => {
      tmp.write('a.yaml', 'a: 2');
    }, 10);

    await expect(readN(source, 2)).resolves.toEqual([
      [{ data: { a: 1 }, context: 'a.yaml', path: tmp.resolve('a.yaml') }],
      [{ data: { a: 2 }, context: 'a.yaml', path: tmp.resolve('a.yaml') }],
    ]);
  });

  it('should include files', async () => {
    const tmp = await tmpFiles({
      'a.yaml': 'a: { $include: x.yaml }',
      'x.yaml': '3',
    });

    const source = FileConfigSource.create({ path: tmp.resolve('a.yaml') });

    await expect(readN(source, 1)).resolves.toEqual([
      [{ data: { a: 3 }, context: 'a.yaml', path: tmp.resolve('a.yaml') }],
    ]);
  });

  it('should include with substitution', async () => {
    const tmp = await tmpFiles({
      'a.yaml': 'a: { $include: "${MY_FILE}.yaml" } ',
      'x.yaml': '4',
    });

    const source = FileConfigSource.create({
      path: tmp.resolve('a.yaml'),
      substitutionFunc: async name => (name === 'MY_FILE' ? 'x' : undefined),
    });

    await expect(readN(source, 1)).resolves.toEqual([
      [{ data: { a: 4 }, context: 'a.yaml', path: tmp.resolve('a.yaml') }],
    ]);
  });

  it('should substitute in include', async () => {
    const tmp = await tmpFiles({
      'a.yaml': 'a: { $include: x.yaml }',
      'x.yaml': '${MY_VALUE}',
    });

    const source = FileConfigSource.create({
      path: tmp.resolve('a.yaml'),
      substitutionFunc: async name => (name === 'MY_VALUE' ? '5' : undefined),
    });

    await expect(readN(source, 1)).resolves.toEqual([
      [{ data: { a: '5' }, context: 'a.yaml', path: tmp.resolve('a.yaml') }],
    ]);
  });

  it('should watch included files', async () => {
    const tmp = await tmpFiles({
      'a.yaml': 'a: { $include: x.yaml }',
      'x.yaml': '${MY_VALUE}',
    });

    const source = FileConfigSource.create({
      path: tmp.resolve('a.yaml'),
      substitutionFunc: async name => (name === 'MY_VALUE' ? '6' : '7'),
    });

    setTimeout(() => {
      tmp.write('x.yaml', '${MY_OTHER_VALUE}');
    }, 10);

    await expect(readN(source, 2)).resolves.toEqual([
      [{ data: { a: '6' }, context: 'a.yaml', path: tmp.resolve('a.yaml') }],
      [{ data: { a: '7' }, context: 'a.yaml', path: tmp.resolve('a.yaml') }],
    ]);
  });

  it('should watch referenced files', async () => {
    const tmp = await tmpFiles({
      'a.yaml': 'a: { $file: x.txt }',
      'x.txt': '8',
    });

    const source = FileConfigSource.create({
      path: tmp.resolve('a.yaml'),
    });

    setTimeout(() => {
      tmp.write('x.txt', '9');
    }, 10);

    await expect(readN(source, 2)).resolves.toEqual([
      [{ data: { a: '8' }, context: 'a.yaml', path: tmp.resolve('a.yaml') }],
      [{ data: { a: '9' }, context: 'a.yaml', path: tmp.resolve('a.yaml') }],
    ]);
  });

  it('should ignore empty files', async () => {
    const tmp = await tmpFiles({
      'a.yaml': '',
    });

    const source = FileConfigSource.create({
      path: tmp.resolve('a.yaml'),
    });

    await expect(readN(source, 1)).resolves.toEqual([[]]);
  });

  it('should error on file', async () => {
    const tmp = await tmpFiles({});

    const source = FileConfigSource.create({
      path: tmp.resolve('not-found.yaml'),
    });

    await expect(readN(source, 1)).rejects.toThrow(
      `Config file "${tmp.resolve('not-found.yaml')}" does not exist`,
    );
  });

  it('should error on missing include', async () => {
    const tmp = await tmpFiles({
      'a.yaml': 'a: { $include: not-found.yaml } ',
    });

    const source = FileConfigSource.create({
      path: tmp.resolve('a.yaml'),
    });

    await expect(readN(source, 1)).rejects.toThrow(
      `Failed to read config file at "${tmp.resolve(
        'a.yaml',
      )}", error at .a, failed to include "${tmp.resolve(
        'not-found.yaml',
      )}", file does not exist`,
    );
  });

  it('should refuse relative paths', async () => {
    expect(() =>
      FileConfigSource.create({
        path: 'a.yaml',
      }),
    ).toThrow('Config load path is not absolute: "a.yaml"');
  });
});
