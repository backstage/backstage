/*
 * Copyright 2025 The Backstage Authors
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
import os from 'node:os';
import { resolve as resolvePath } from 'node:path';
import { injectIntoFile } from './inject';
import { MARKER_START, MARKER_END } from './generateIndex';

describe('injectIntoFile', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(resolvePath(os.tmpdir(), 'inject-test-'));
  });

  afterEach(() => {
    fs.removeSync(tempDir);
  });

  it('creates a new file when it does not exist', async () => {
    const filePath = resolvePath(tempDir, 'NEW.md');
    const content = `${MARKER_START}\ntest content\n${MARKER_END}`;

    const result = await injectIntoFile(filePath, content);

    expect(result).toEqual({ created: true, updated: false });
    const written = await fs.readFile(filePath, 'utf8');
    expect(written).toContain('test content');
    expect(written).toContain(MARKER_START);
    expect(written).toContain(MARKER_END);
  });

  it('appends to an existing file without markers', async () => {
    const filePath = resolvePath(tempDir, 'EXISTING.md');
    await fs.writeFile(filePath, '# My Project\n\nSome content.\n', 'utf8');

    const content = `${MARKER_START}\nnew index\n${MARKER_END}`;
    const result = await injectIntoFile(filePath, content);

    expect(result).toEqual({ created: false, updated: true });
    const written = await fs.readFile(filePath, 'utf8');
    expect(written).toContain('# My Project');
    expect(written).toContain('Some content.');
    expect(written).toContain('new index');
  });

  it('replaces content between existing markers (idempotent)', async () => {
    const filePath = resolvePath(tempDir, 'REPLACE.md');
    const initial = `# Header\n\n${MARKER_START}\nold content\n${MARKER_END}\n\n# Footer\n`;
    await fs.writeFile(filePath, initial, 'utf8');

    const content = `${MARKER_START}\nnew content\n${MARKER_END}`;
    const result = await injectIntoFile(filePath, content);

    expect(result).toEqual({ created: false, updated: true });
    const written = await fs.readFile(filePath, 'utf8');
    expect(written).toContain('# Header');
    expect(written).toContain('new content');
    expect(written).not.toContain('old content');
    expect(written).toContain('# Footer');

    // Running again should produce identical output (idempotent)
    await injectIntoFile(filePath, content);
    const secondRun = await fs.readFile(filePath, 'utf8');
    expect(secondRun).toBe(written);
  });
});
