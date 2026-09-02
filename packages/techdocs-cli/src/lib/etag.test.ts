/*
 * Copyright 2024 The Backstage Authors
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

import { join } from 'node:path';
import fs from 'fs-extra';
import os from 'node:os';
import { computeDirectoryEtag } from './etag';

describe('computeDirectoryEtag', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(join(os.tmpdir(), 'etag-test-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  it('should produce a deterministic sha256 hash', async () => {
    await fs.writeFile(join(tmpDir, 'a.md'), 'hello');
    await fs.writeFile(join(tmpDir, 'b.md'), 'world');

    const etag1 = await computeDirectoryEtag(tmpDir);
    const etag2 = await computeDirectoryEtag(tmpDir);

    expect(etag1).toBe(etag2);
    expect(etag1).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should change when file content changes', async () => {
    await fs.writeFile(join(tmpDir, 'a.md'), 'hello');

    const etag1 = await computeDirectoryEtag(tmpDir);

    await fs.writeFile(join(tmpDir, 'a.md'), 'changed');

    const etag2 = await computeDirectoryEtag(tmpDir);

    expect(etag1).not.toBe(etag2);
  });

  it('should change when a file is renamed', async () => {
    await fs.writeFile(join(tmpDir, 'a.md'), 'hello');

    const etag1 = await computeDirectoryEtag(tmpDir);

    await fs.rename(join(tmpDir, 'a.md'), join(tmpDir, 'b.md'));

    const etag2 = await computeDirectoryEtag(tmpDir);

    expect(etag1).not.toBe(etag2);
  });

  it('should include files in subdirectories', async () => {
    await fs.ensureDir(join(tmpDir, 'sub'));
    await fs.writeFile(join(tmpDir, 'sub', 'nested.md'), 'nested');

    const etag1 = await computeDirectoryEtag(tmpDir);

    await fs.writeFile(join(tmpDir, 'sub', 'nested.md'), 'changed');

    const etag2 = await computeDirectoryEtag(tmpDir);

    expect(etag1).not.toBe(etag2);
  });

  it('should return a consistent hash for an empty directory', async () => {
    const etag = await computeDirectoryEtag(tmpDir);

    expect(etag).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should ignore excluded files', async () => {
    await fs.writeFile(join(tmpDir, 'index.html'), 'hello');
    await fs.writeFile(
      join(tmpDir, 'sitemap.xml'),
      '<urlset lastmod="2024-01-01" />',
    );
    await fs.writeFile(join(tmpDir, 'sitemap.xml.gz'), 'gzip-header-1');
    await fs.writeJson(join(tmpDir, 'techdocs_metadata.json'), {
      build_timestamp: 1,
    });

    const etag1 = await computeDirectoryEtag(tmpDir, {
      exclude: ['techdocs_metadata.json', 'sitemap.xml.gz', 'sitemap.xml'],
    });

    await fs.writeFile(
      join(tmpDir, 'sitemap.xml'),
      '<urlset lastmod="2024-01-02" />',
    );
    await fs.writeFile(join(tmpDir, 'sitemap.xml.gz'), 'gzip-header-2');
    await fs.writeJson(join(tmpDir, 'techdocs_metadata.json'), {
      build_timestamp: 2,
    });

    const etag2 = await computeDirectoryEtag(tmpDir, {
      exclude: ['techdocs_metadata.json', 'sitemap.xml.gz', 'sitemap.xml'],
    });

    expect(etag1).toBe(etag2);
  });
});
