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
import { resolve as resolvePath, join as joinPath } from 'path';
import { TarArchiveResponse } from './TarArchiveResponse';
import { createMockDirectory } from '@backstage/backend-test-utils';
import * as tar from 'tar';

const archiveData = fs.readFileSync(
  resolvePath(__filename, '../../__fixtures__/mock-main.tar.gz'),
);

describe('TarArchiveResponse', () => {
  const sourceDir = createMockDirectory();
  const targetDir = createMockDirectory();

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

  describe('symlink handling', () => {
    const tempDir = createMockDirectory();

    it('should not extract symlinks with absolute targets', async () => {
      const archiveSourceDir = tempDir.resolve('source');
      await fs.ensureDir(joinPath(archiveSourceDir, 'repo'));
      await fs.writeFile(
        joinPath(archiveSourceDir, 'repo', 'file.txt'),
        'file content',
      );

      // Create a symlink with an absolute path target
      const absoluteTarget = tempDir.resolve('other.txt');
      await fs.writeFile(absoluteTarget, 'other content');
      await fs.symlink(
        absoluteTarget,
        joinPath(archiveSourceDir, 'repo', 'abs-link'),
      );

      const tarballPath = tempDir.resolve('archive.tar.gz');
      await tar.create(
        { gzip: true, file: tarballPath, cwd: archiveSourceDir },
        ['repo'],
      );

      const stream = fs.createReadStream(tarballPath);
      const res = new TarArchiveResponse(stream, '', targetDir.path, 'etag');

      targetDir.addContent({ out: {} });
      const dir = await res.dir({ targetDir: targetDir.resolve('out') });

      // Regular file should be extracted
      await expect(
        fs.readFile(joinPath(dir, 'file.txt'), 'utf8'),
      ).resolves.toBe('file content');

      // Symlink with absolute target should not be extracted
      await expect(fs.lstat(joinPath(dir, 'abs-link'))).rejects.toThrow(
        'ENOENT',
      );
    });

    it('should extract symlinks with relative targets within archive', async () => {
      const archiveSourceDir = tempDir.resolve('source2');
      await fs.ensureDir(joinPath(archiveSourceDir, 'repo', 'subdir'));
      await fs.writeFile(
        joinPath(archiveSourceDir, 'repo', 'target.txt'),
        'target content',
      );

      // Create a relative symlink pointing to a file within the archive
      await fs.symlink(
        '../target.txt',
        joinPath(archiveSourceDir, 'repo', 'subdir', 'rel-link'),
      );

      const tarballPath = tempDir.resolve('archive2.tar.gz');
      await tar.create(
        { gzip: true, file: tarballPath, cwd: archiveSourceDir },
        ['repo'],
      );

      const stream = fs.createReadStream(tarballPath);
      const res = new TarArchiveResponse(stream, '', targetDir.path, 'etag');

      targetDir.addContent({ out2: {} });
      const dir = await res.dir({ targetDir: targetDir.resolve('out2') });

      // The symlink should be extracted and point to the correct file
      const linkPath = joinPath(dir, 'subdir', 'rel-link');
      const stats = await fs.lstat(linkPath);
      expect(stats.isSymbolicLink()).toBe(true);

      // Following the symlink should give us the target content
      await expect(fs.readFile(linkPath, 'utf8')).resolves.toBe(
        'target content',
      );
    });
  });
});
