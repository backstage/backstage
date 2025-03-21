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
import { Readable } from 'stream';
import { create as createArchive } from 'archiver';
import { resolve as resolvePath } from 'path';
import { ZipArchiveResponse } from './ZipArchiveResponse';
import { createMockDirectory } from '@backstage/backend-test-utils';

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
  const sourceDir = createMockDirectory();
  const targetDir = createMockDirectory();

  beforeAll(() => {
    sourceDir.setContent({
      'test-archive.zip': archiveData,
      'test-archive-with-extra-root-dir.zip': archiveDataWithExtraDir,
      'test-archive-corrupted.zip': archiveDataCorrupted,
      'test-archive-malicious.zip': archiveWithMaliciousEntry,
    });
  });
  beforeEach(() => {
    targetDir.clear();
  });

  const openStreams = new Array<fs.ReadStream>();
  function createReadStream(filePath: string) {
    const stream = fs.createReadStream(filePath);
    openStreams.push(stream);
    return stream;
  }
  afterEach(() => {
    openStreams.forEach(stream => stream.destroy());
    openStreams.length = 0;
  });

  it('should read files', async () => {
    const stream = createReadStream(sourceDir.resolve('test-archive.zip'));

    const res = new ZipArchiveResponse(stream, '', targetDir.path, 'etag');
    const files = await res.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
        lastModifiedAt: expect.any(Date),
      },
      {
        path: 'docs/index.md',
        content: expect.any(Function),
        lastModifiedAt: expect.any(Date),
      },
    ]);

    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents.map(c => c.toString('utf8').trim())).toEqual([
      'site_name: Test',
      '# Test',
    ]);
  });

  it('should read files with filter', async () => {
    const stream = createReadStream(sourceDir.resolve('test-archive.zip'));

    const res = new ZipArchiveResponse(
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
        lastModifiedAt: expect.any(Date),
      },
    ]);
    const content = await files[0].content();
    expect(content.toString('utf8').trim()).toEqual('site_name: Test');
  });

  it('should read as archive and files', async () => {
    const stream = createReadStream(sourceDir.resolve('test-archive.zip'));

    const res = new ZipArchiveResponse(stream, '', targetDir.path, 'etag');
    const buffer = await res.archive();

    await expect(res.archive()).rejects.toThrow(
      'Response has already been read',
    );

    const res2 = new ZipArchiveResponse(buffer, '', targetDir.path, 'etag');
    const files = await res2.files();

    expect(files).toEqual([
      {
        path: 'mkdocs.yml',
        content: expect.any(Function),
        lastModifiedAt: expect.any(Date),
      },
      {
        path: 'docs/index.md',
        content: expect.any(Function),
        lastModifiedAt: expect.any(Date),
      },
    ]);
    const contents = await Promise.all(files.map(f => f.content()));
    expect(contents.map(c => c.toString('utf8').trim())).toEqual([
      'site_name: Test',
      '# Test',
    ]);
  });

  it('should extract entire archive into directory', async () => {
    const stream = createReadStream(sourceDir.resolve('test-archive.zip'));

    const res = new ZipArchiveResponse(stream, '', targetDir.path, 'etag');
    const dir = await res.dir();

    await expect(
      fs.readFile(resolvePath(dir, 'mkdocs.yml'), 'utf8'),
    ).resolves.toBe('site_name: Test\n');
    await expect(
      fs.readFile(resolvePath(dir, 'docs/index.md'), 'utf8'),
    ).resolves.toBe('# Test\n');
  });

  it('should extract archive into directory with a subpath', async () => {
    const stream = createReadStream(sourceDir.resolve('test-archive.zip'));

    const res = new ZipArchiveResponse(stream, 'docs/', targetDir.path, 'etag');

    const dir = await res.dir();
    expect(targetDir.content({ path: dir })).toEqual({
      'index.md': '# Test\n',
    });
  });

  it('should extract archive into directory with a subpath and filter', async () => {
    const stream = createReadStream(sourceDir.resolve('test-archive.zip'));

    const res = new ZipArchiveResponse(
      stream,
      '',
      targetDir.path,
      'etag',
      path => path.endsWith('.yml'),
    );

    targetDir.addContent({ sub: {} });
    const sub = targetDir.resolve('sub');
    const dir = await res.dir({ targetDir: sub });

    expect(dir).toBe(sub);

    expect(targetDir.content()).toEqual({
      sub: {
        'mkdocs.yml': 'site_name: Test\n',
      },
    });
  });

  it('should extract a large archive', async () => {
    const fileCount = 10;
    const fileSize = 1000 * 1000;
    const filePath = await new Promise<string>((resolve, reject) => {
      const outFile = targetDir.resolve('large-archive.zip');

      const outStream = fs.createWriteStream(outFile);
      outStream.on('close', () => resolve(outFile));

      const archive = createArchive('zip');
      archive.on('error', reject);
      archive.on('warning', w => console.warn('WARN', w));
      archive.pipe(outStream);

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

    const stream = createReadStream(filePath);

    const res = new ZipArchiveResponse(stream, '', targetDir.path, 'etag');

    targetDir.addContent({ sub: {} });
    const sub = targetDir.resolve('sub');
    const dir = await res.dir({
      targetDir: sub,
    });

    const files = await fs.readdir(dir);
    expect(files).toHaveLength(fileCount);

    for (const file of files) {
      const stat = await fs.stat(resolvePath(dir, file));
      expect(stat.size).toBe(fileSize);
    }
  });

  it('should throw on invalid archive', async () => {
    const stream = createReadStream(
      sourceDir.resolve('test-archive-corrupted.zip'),
    );

    const res = new ZipArchiveResponse(stream, '', targetDir.path, 'etag');
    const filesPromise = res.files();

    await expect(filesPromise).rejects.toThrow(
      /Invalid comment length. Expected: 55. Found: 0/,
    );
  });

  it('should throw on entries with a path outside the destination dir', async () => {
    const stream = createReadStream(
      sourceDir.resolve('test-archive-malicious.zip'),
    );

    const res = new ZipArchiveResponse(stream, '', targetDir.path, 'etag');
    await expect(res.files()).rejects.toThrow(
      'invalid relative path: ../side.txt',
    );
  });

  it('should throw on entries that attempt to write outside destination dir', async () => {
    const stream = createReadStream(
      sourceDir.resolve('test-archive-malicious.zip'),
    );

    const res = new ZipArchiveResponse(stream, '', targetDir.path, 'etag');
    await expect(res.dir()).rejects.toThrow(
      'invalid relative path: ../side.txt',
    );
  });
});
