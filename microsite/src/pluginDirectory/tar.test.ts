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
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { create } from 'tar';
import { parseTar } from './tar';

async function buildTarball(
  files: Record<string, string>,
): Promise<Uint8Array> {
  const root = await mkdtemp(join(tmpdir(), 'tar-fixture-'));
  try {
    const packageDirectory = join(root, 'package');
    await mkdir(packageDirectory);
    for (const [name, contents] of Object.entries(files)) {
      await writeFile(join(packageDirectory, name), contents, 'utf8');
    }

    const tarballPath = join(root, 'package.tar');
    await create({ cwd: root, file: tarballPath }, ['package']);
    return await readFile(tarballPath);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

describe('parseTar', () => {
  it('reads regular file entries by their archive path', async () => {
    const buffer = await buildTarball({
      'package.json': JSON.stringify({ name: 'example' }),
      'config.schema.json': JSON.stringify({ type: 'object' }),
    });

    const entries = parseTar(buffer);

    assert.equal(
      new TextDecoder().decode(entries.get('package/package.json')),
      JSON.stringify({ name: 'example' }),
    );
    assert.equal(
      new TextDecoder().decode(entries.get('package/config.schema.json')),
      JSON.stringify({ type: 'object' }),
    );
  });

  it('returns an empty map instead of throwing on a truncated buffer', () => {
    const entries = parseTar(new Uint8Array(10));
    assert.equal(entries.size, 0);
  });

  it('stops at the end-of-archive marker without producing spurious entries', async () => {
    const buffer = await buildTarball({ 'file.txt': 'hello' });
    const padded = new Uint8Array(buffer.length + 1024);
    padded.set(buffer);

    const entries = parseTar(padded);

    assert.equal(entries.size, 1);
    assert.equal(
      new TextDecoder().decode(entries.get('package/file.txt')),
      'hello',
    );
  });
});
