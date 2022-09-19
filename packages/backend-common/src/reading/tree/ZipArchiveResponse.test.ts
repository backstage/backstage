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
import mockFs from 'mock-fs';
import { Readable } from 'stream';
import { create as createArchive } from 'archiver';
import { resolve as resolvePath } from 'path';
import { ZipArchiveResponse } from './ZipArchiveResponse';

const archiveData = fs.readFileSync(
  resolvePath(__filename, '../../__fixtures__/mock-main.zip'),
);
const archiveDataCorrupted = fs.readFileSync(
  resolvePath(__filename, '../../__fixtures__/mock-corrupted.zip'),
);
const archiveDataWithExtraDir = fs.readFileSync(
  resolvePath(__filename, '../../__fixtures__/mock-with-extra-root-dir.zip'),
);
const archiveWithMaliciousEntry = fs.readFileSync(
  resolvePath(__filename, '../../__fixtures__/mallory.zip'),
);

describe('ZipArchiveResponse', () => {
  beforeEach(() => {
    mockFs({
      '/test-archive.zip': archiveData,
      '/test-archive-with-extra-root-dir.zip': archiveDataWithExtraDir,
      '/test-archive-corrupted.zip': archiveDataCorrupted,
      '/test-archive-malicious.zip': archiveWithMaliciousEntry,
      '/tmp': mockFs.directory(),
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should read files', async () => {
    const stream = fs.createReadStream('/test-archive.zip');

    const res = new ZipArchiveResponse(stream, '', '/tmp', 'etag');
    const files = await res.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
      },
      {
        path: 'docs/index.md',
        content: expect.any(Function),
      },
    ]);

    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents.map(c => c.toString('utf8').trim())).toEqual([
      'site_name: Test',
      '# Test',
    ]);
  });

  it('should read files with filter', async () => {
    const stream = fs.createReadStream('/test-archive.zip');

    const res = new ZipArchiveResponse(stream, '', '/tmp', 'etag', path =>
      path.endsWith('.yml'),
    );
    const files = await res.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
      },
    ]);
    const content = await files[0].content();
    expect(content.toString('utf8').trim()).toEqual('site_name: Test');
  });

  it('should read as archive and files', async () => {
    const stream = fs.createReadStream('/test-archive.zip');

    const res = new ZipArchiveResponse(stream, '', '/tmp', 'etag');
    const buffer = await res.archive();

    await expect(res.archive()).rejects.toThrow(
      'Response has already been read',
    );

    const res2 = new ZipArchiveResponse(buffer, '', '/tmp', 'etag');
    const files = await res2.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
      },
      {
        path: 'docs/index.md',
        content: expect.any(Function),
      },
    ]);
    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents.map(c => c.toString('utf8').trim())).toEqual([
      'site_name: Test',
      '# Test',
    ]);
  });

  it('should extract entire archive into directory', async () => {
    const stream = fs.createReadStream('/test-archive.zip');

    const res = new ZipArchiveResponse(stream, '', '/tmp', 'etag');
    const dir = await res.dir();

    await expect(
      fs.readFile(resolvePath(dir, 'mkdocs.yml'), 'utf8'),
    ).resolves.toBe('site_name: Test\n');
    await expect(
      fs.readFile(resolvePath(dir, 'docs/index.md'), 'utf8'),
    ).resolves.toBe('# Test\n');
  });

  it('should extract archive into directory with a subpath', async () => {
    const stream = fs.createReadStream('/test-archive.zip');

    const res = new ZipArchiveResponse(stream, 'docs/', '/tmp', 'etag');
    const dir = await res.dir();
    expect(dir).toMatch(/^[\/\\]tmp[\/\\].*$/);
    await expect(
      fs.readFile(resolvePath(dir, 'index.md'), 'utf8'),
    ).resolves.toBe('# Test\n');
  });

  it('should extract archive into directory with a subpath and filter', async () => {
    const stream = fs.createReadStream('/test-archive.zip');

    const res = new ZipArchiveResponse(stream, '', '/tmp', 'etag', path =>
      path.endsWith('.yml'),
    );
    const dir = await res.dir({ targetDir: '/tmp' });

    expect(dir).toBe('/tmp');
    await expect(fs.pathExists(resolvePath(dir, 'mkdocs.yml'))).resolves.toBe(
      true,
    );
    await expect(
      fs.pathExists(resolvePath(dir, 'docs/index.md')),
    ).resolves.toBe(false);
  });

  it('should extract a large archive', async () => {
    const fileCount = 10;
    const fileSize = 1000 * 1000;
    const filePath = await new Promise<string>((resolve, reject) => {
      const outFile = '/large-archive.zip';
      const archive = createArchive('zip');

      archive.on('error', reject);
      archive.on('end', () => resolve(outFile));
      archive.pipe(fs.createWriteStream(outFile));
      archive.on('warning', w => console.warn('WARN', w));

      for (let i = 0; i < fileCount; i++) {
        // Workaround for https://github.com/archiverjs/node-archiver/issues/542
        // TODO(Rugvip): Without this workaround the archive entries end up with an uncompressed size of 0.
        //               That in turn causes yauzl to hang on extraction, because the internal transform error is ignored.
        const stream = new Readable();
        stream.push(Buffer.alloc(fileSize, i));
        stream.push(null);
        archive.append(stream, { name: `file-${i}.data` });
      }

      archive.finalize();
    });

    const stream = fs.createReadStream(filePath);

    const res = new ZipArchiveResponse(stream, '', '/tmp', 'etag');
    const dir = await res.dir({
      targetDir: '/out',
    });

    expect(dir).toBe('/out');
    const files = await fs.readdir(dir);
    expect(files).toHaveLength(fileCount);

    for (const file of files) {
      const stat = await fs.stat(resolvePath(dir, file));
      expect(stat.size).toBe(fileSize);
    }
  });

  it('should throw on invalid archive', async () => {
    const stream = fs.createReadStream('/test-archive-corrupted.zip');

    const res = new ZipArchiveResponse(stream, '', '/tmp', 'etag');
    const filesPromise = res.files();

    await expect(filesPromise).rejects.toThrow(
      'invalid comment length. expected: 55. found: 0',
    );
  });

  it('should throw on entries with a path outside the destination dir', async () => {
    const stream = fs.createReadStream('/test-archive-malicious.zip');

    const res = new ZipArchiveResponse(stream, '', '/tmp', 'etag');
    await expect(res.files()).rejects.toThrow(
      'invalid relative path: ../side.txt',
    );
  });

  it('should throw on entries that attempt to write outside destination dir', async () => {
    const stream = fs.createReadStream('/test-archive-malicious.zip');

    const res = new ZipArchiveResponse(stream, '', '/tmp', 'etag');
    await expect(res.dir()).rejects.toThrow(
      'invalid relative path: ../side.txt',
    );
  });
});
