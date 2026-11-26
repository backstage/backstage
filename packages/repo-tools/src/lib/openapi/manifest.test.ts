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

import fs from 'fs-extra';
import { join } from 'node:path';
import os from 'node:os';
import { OPENAPI_MANIFEST_FILE } from './constants';
import { computeFilesHash, verifyManifest, writeManifest } from './manifest';

describe('openapi manifest', () => {
  let root: string;
  let pkg: string;
  let generated: string;
  let specPath: string;

  beforeEach(async () => {
    root = await fs.mkdtemp(join(os.tmpdir(), 'openapi-manifest-'));
    pkg = join(root, 'plugins', 'foo-backend');
    generated = join(pkg, 'src/schema/openapi/generated');
    specPath = join(pkg, 'src/schema/openapi.yaml');
    await fs.outputFile(specPath, 'openapi: 3.0.3\ninfo:\n  title: a\n');
    await fs.outputFile(join(generated, 'index.ts'), 'export {};\n');
    await fs.outputFile(join(generated, 'models/A.model.ts'), 'export {};\n');
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await fs.remove(root);
  });

  const write = (kind: 'server' | 'client' = 'server') =>
    writeManifest({ kind, generatedDir: generated, specPath });

  it('writes a stable manifest that verifies cleanly', async () => {
    await write();
    const first = await fs.readFile(
      join(generated, OPENAPI_MANIFEST_FILE),
      'utf8',
    );
    await write();
    expect(
      await fs.readFile(join(generated, OPENAPI_MANIFEST_FILE), 'utf8'),
    ).toBe(first);
    expect(first.endsWith('}\n')).toBe(true);

    const manifest = JSON.parse(first);
    expect(manifest).toMatchObject({
      version: 1,
      kind: 'server',
      spec: { path: '../../openapi.yaml' },
      additionalProperties: null,
    });
    expect(manifest.filesSha256).toMatch(/^[0-9a-f]{64}$/);

    expect(await verifyManifest(pkg)).toEqual({ errors: [], warnings: [] });
  });

  it('ignores line ending differences but not content changes', async () => {
    const before = await computeFilesHash(generated);
    await fs.writeFile(join(generated, 'index.ts'), 'a\r\nb\r\n');
    const crlf = await computeFilesHash(generated);
    await fs.writeFile(join(generated, 'index.ts'), 'a\nb\n');
    expect(await computeFilesHash(generated)).toBe(crlf);
    expect(crlf).not.toBe(before);
  });

  it('reports one error for edited, missing and extra files', async () => {
    await write();
    const fix =
      'Fix: run `yarn backstage-repo-tools package schema openapi generate --server` from';

    await fs.appendFile(join(generated, 'models/A.model.ts'), '// edit\n');
    let result = await verifyManifest(pkg);
    expect(result!.errors).toHaveLength(1);
    expect(result!.errors[0]).toContain('Generated files');
    expect(result!.errors[0]).toContain(fix);

    await write();
    await fs.remove(join(generated, 'index.ts'));
    result = await verifyManifest(pkg);
    expect(result!.errors).toHaveLength(1);

    await write();
    await fs.outputFile(join(generated, 'extra.ts'), 'x');
    result = await verifyManifest(pkg);
    expect(result!.errors).toHaveLength(1);
  });

  it('reports spec drift and a missing spec', async () => {
    await write();
    await fs.writeFile(specPath, 'openapi: 3.0.3\ninfo:\n  title: b\n');
    let result = await verifyManifest(pkg);
    expect(result!.errors).toHaveLength(1);
    expect(result!.errors[0]).toContain('has changed');

    await fs.remove(specPath);
    result = await verifyManifest(pkg);
    expect(result!.errors[0]).toContain('is missing');
  });

  it('points client drift at the client package fix command', async () => {
    await write('client');
    await fs.appendFile(join(generated, 'index.ts'), '// edit\n');
    const result = await verifyManifest(pkg);
    expect(result!.errors[0]).toContain('generate --client-package ');
  });

  it('only warns about generator changes and missing manifests', async () => {
    await write();
    const manifestPath = join(generated, OPENAPI_MANIFEST_FILE);
    const manifest = await fs.readJson(manifestPath);
    manifest.generator.openapiGenerator = '0.0.0';
    await fs.writeJson(manifestPath, manifest);
    let result = await verifyManifest(pkg);
    expect(result!.errors).toEqual([]);
    expect(result!.warnings).toHaveLength(1);
    expect(result!.warnings[0]).toContain('generator version');

    await fs.remove(manifestPath);
    result = await verifyManifest(pkg);
    expect(result!.errors).toEqual([]);
    expect(result!.warnings[0]).toContain('Regenerate');

    await fs.remove(generated);
    expect(await verifyManifest(pkg)).toBeNull();
  });
});
