/*
 * Copyright 2020 The Backstage Authors
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

import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { TarArchiveResponse } from './TarArchiveResponse';
import { MockDirectory } from '@backstage/backend-test-utils';

const archiveData = fs.readFileSync(
  resolvePath(__filename, '../../__fixtures__/mock-main.tar.gz'),
);

describe('TarArchiveResponse', () => {
  const sourceDir = MockDirectory.create();
  const targetDir = MockDirectory.create();

  beforeAll(() => {
    sourceDir.setContent({ 'test-archive.tar.gz': archiveData });
  });
  beforeEach(() => {
    targetDir.clear();
  });

  it('should read files', async () => {
    const stream = fs.createReadStream(
      sourceDir.resolve('test-archive.tar.gz'),
    );

    const res = new TarArchiveResponse(stream, '', targetDir.path, 'etag');
    const files = await res.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
        lastModifiedAt: undefined,
      },
      {
        path: 'docs/index.md',
        content: expect.any(Function),
        lastModifiedAt: undefined,
      },
    ]);
    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents.map(c => c.toString('utf8').trim())).toEqual([
      'site_name: Test',
      '# Test',
    ]);
  });

  it('should read files with filter', async () => {
    const stream = fs.createReadStream(
      sourceDir.resolve('test-archive.tar.gz'),
    );

    const res = new TarArchiveResponse(
      stream,
      '',
      targetDir.path,
      'etag',
      path => path.endsWith('.yml'),
    );
    const files = await res.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
        lastModifiedAt: undefined,
      },
    ]);
    const content = await files[0].content();
    expect(content.toString('utf8').trim()).toEqual('site_name: Test');
  });

  it('should read as archive and files', async () => {
    const stream = fs.createReadStream(
      sourceDir.resolve('test-archive.tar.gz'),
    );

    const res = new TarArchiveResponse(stream, '', targetDir.path, 'etag');
    const buffer = await res.archive();

    await expect(res.archive()).rejects.toThrow(
      'Response has already been read',
    );

    const res2 = new TarArchiveResponse(buffer, '', targetDir.path, 'etag');
    const files = await res2.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
        lastModifiedAt: undefined,
      },
      {
        path: 'docs/index.md',
        content: expect.any(Function),
        lastModifiedAt: undefined,
      },
    ]);
    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents.map(c => c.toString('utf8').trim())).toEqual([
      'site_name: Test',
      '# Test',
    ]);
  });

  it('should extract entire archive into directory', async () => {
    const stream = fs.createReadStream(
      sourceDir.resolve('test-archive.tar.gz'),
    );

    const res = new TarArchiveResponse(stream, '', targetDir.path, 'etag');
    const dir = await res.dir();
    await expect(
      fs.readFile(resolvePath(dir, 'mkdocs.yml'), 'utf8'),
    ).resolves.toBe('site_name: Test\n');
    await expect(
      fs.readFile(resolvePath(dir, 'docs/index.md'), 'utf8'),
    ).resolves.toBe('# Test\n');
  });

  it('should extract archive into directory with a subpath', async () => {
    const stream = fs.createReadStream(
      sourceDir.resolve('test-archive.tar.gz'),
    );

    const res = new TarArchiveResponse(stream, 'docs', targetDir.path, 'etag');
    const dir = await res.dir();

    expect(targetDir.content({ path: dir })).toEqual({
      'index.md': '# Test\n',
    });
  });

  it('should extract archive into directory with a subpath and filter', async () => {
    const stream = fs.createReadStream(
      sourceDir.resolve('test-archive.tar.gz'),
    );

    const res = new TarArchiveResponse(
      stream,
      '',
      targetDir.path,
      'etag',
      path => path.endsWith('.yml'),
    );

    targetDir.addContent({ sub: {} });
    const dir = await res.dir({ targetDir: targetDir.resolve('sub') });

    expect(dir).toBe(targetDir.resolve('sub'));
    expect(targetDir.content()).toEqual({
      sub: {
        'mkdocs.yml': 'site_name: Test\n',
      },
    });
  });

  it('should clean up temporary directories in place in the case of an error', async () => {
    const stream = fs.createReadStream(
      sourceDir.resolve('test-archive.tar.gz'),
    );

    const res = new TarArchiveResponse(
      stream,
      '',
      targetDir.path,
      'etag',
      () => {
        throw new Error('NOPE');
      },
    );

    targetDir.addContent({ sub: {} });
    const sub = targetDir.resolve('sub');

    const mkdtemp = jest
      .spyOn(fs, 'mkdtemp')
      .mockImplementation(async () => sub);

    await expect(fs.pathExists(sub)).resolves.toBe(true);
    await expect(res.dir()).rejects.toThrow('NOPE');
    await expect(fs.pathExists(sub)).resolves.toBe(false);

    mkdtemp.mockRestore();
  });

  it('should leave directory in place if provided in the case of an error', async () => {
    const stream = fs.createReadStream(
      sourceDir.resolve('test-archive.tar.gz'),
    );

    const res = new TarArchiveResponse(
      stream,
      '',
      targetDir.path,
      'etag',
      () => {
        throw new Error('NOPE');
      },
    );

    targetDir.addContent({ sub: {} });
    const sub = targetDir.resolve('sub');

    await expect(fs.pathExists(sub)).resolves.toBe(true);
    await expect(res.dir({ targetDir: sub })).rejects.toThrow('NOPE');
    await expect(fs.pathExists(sub)).resolves.toBe(true);
  });
});
