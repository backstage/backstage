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
import { detectBackstageVersion } from './version';

// Mock targetPaths and BACKSTAGE_JSON
const mockResolveRoot = jest.fn();
jest.mock('@backstage/cli-common', () => ({
  BACKSTAGE_JSON: 'backstage.json',
  targetPaths: {
    resolveRoot: (...paths: string[]) => mockResolveRoot(...paths),
  },
}));

describe('detectBackstageVersion', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(resolvePath(os.tmpdir(), 'version-test-'));
    mockResolveRoot.mockImplementation((...paths: string[]) =>
      resolvePath(tempDir, ...paths),
    );
  });

  afterEach(() => {
    fs.removeSync(tempDir);
  });

  it('reads version from backstage.json', async () => {
    await fs.writeJSON(resolvePath(tempDir, 'backstage.json'), {
      version: '1.35.0',
    });

    const result = await detectBackstageVersion();

    expect(result.version).toBe('1.35.0');
    expect(result.error).toBeUndefined();
  });

  it('returns null with error referencing --release when file is missing', async () => {
    const result = await detectBackstageVersion();

    expect(result.version).toBeNull();
    expect(result.error).toContain('not found');
    expect(result.error).toContain('--release');
  });

  it('returns null with error referencing --release when version field is missing', async () => {
    await fs.writeJSON(resolvePath(tempDir, 'backstage.json'), {
      name: 'my-app',
    });

    const result = await detectBackstageVersion();

    expect(result.version).toBeNull();
    expect(result.error).toContain('No version field');
    expect(result.error).toContain('--release');
  });
});
