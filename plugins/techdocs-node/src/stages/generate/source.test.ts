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
import path from 'node:path';
import os from 'node:os';
import { ConfigReader } from '@backstage/config';
import { createLogger } from 'winston';
import {
  generateTechDocsSource,
  migrateTechDocsConfig,
  runTechDocsMigration,
} from './source';

describe('source publication', () => {
  let root: string;
  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'source-test-'));
  });
  afterEach(async () => {
    await fs.remove(root);
  });
  const options = () => ({
    inputDir: path.join(root, 'input'),
    outputDir: path.join(root, 'output'),
    logger: createLogger({ silent: true }),
  });
  async function setup() {
    await fs.outputFile(
      path.join(root, 'input/mkdocs.yml'),
      'site_name: Example\ndocs_dir: docs\nnav:\n  - Home: index.md\n',
    );
    await fs.outputFile(
      path.join(root, 'input/docs/index.md'),
      '# Home\n\nWelcome',
    );
  }
  it('migrates and dual publishes data-only artifacts with stable file names', async () => {
    await setup();
    await migrateTechDocsConfig(options().inputDir);
    expect(await fs.pathExists(path.join(root, 'input/mkdocs.yml'))).toBe(true);
    const legacy = jest.fn(async () => {
      await fs.outputFile(path.join(root, 'output/index.html'), 'legacy');
    });
    await runTechDocsMigration(
      new ConfigReader({ techdocs: { migration: { publishing: 'dual' } } }),
      options(),
      legacy,
    );
    expect(legacy).toHaveBeenCalledTimes(1);
    const manifest = await fs.readJson(
      path.join(root, 'output/_techdocs/source/manifest.json'),
    );
    expect(manifest).toMatchObject({
      version: 1,
      legacy: true,
      optedIn: true,
      available: true,
    });
    expect(manifest.pages[0]).toMatchObject({ title: 'Home', route: '' });
    expect(
      await fs.readJson(path.join(options().outputDir, manifest.pages[0].file)),
    ).toEqual({ markdown: '# Home\n\nWelcome' });
    await generateTechDocsSource(options(), true);
    expect(
      (
        await fs.readJson(
          path.join(root, 'output/_techdocs/source/manifest.json'),
        )
      ).pages,
    ).toEqual(manifest.pages);
    await expect(migrateTechDocsConfig(options().inputDir)).rejects.toThrow(
      'already exists',
    );
    await runTechDocsMigration(
      new ConfigReader({ techdocs: { migration: { publishing: 'source' } } }),
      options(),
      legacy,
    );
    expect(legacy).toHaveBeenCalledTimes(1);
    expect(await fs.pathExists(path.join(root, 'output/index.html'))).toBe(
      false,
    );
    expect(
      (await fs.readJson(path.join(root, 'output/search/search_index.json')))
        .docs[0].text,
    ).toContain('Welcome');
  });
  it('rejects traversal, symlinks, unknown settings and unsafe YAML before calling the legacy generator', async () => {
    await setup();
    await fs.outputFile(
      path.join(root, 'input/techdocs.yaml'),
      'version: 1\ndocsDir: ../outside',
    );
    await expect(generateTechDocsSource(options(), false)).rejects.toThrow();
    await fs.outputFile(
      path.join(root, 'input/techdocs.yaml'),
      'version: 1\nhooks: evil.py',
    );
    await expect(generateTechDocsSource(options(), false)).rejects.toThrow(
      'supports only',
    );
    await fs.remove(path.join(root, 'input/techdocs.yaml'));
    await fs.symlink(
      path.join(root, 'input/mkdocs.yml'),
      path.join(root, 'input/docs/link.md'),
    );
    await expect(generateTechDocsSource(options(), false)).rejects.toThrow(
      'symlinks',
    );
    await fs.remove(path.join(root, 'input/docs/link.md'));
    await fs.outputFile(
      path.join(root, 'input/mkdocs.yml'),
      'site_name: !!python/object/apply:os.system [echo nope]',
    );
    const legacy = jest.fn();
    await expect(
      runTechDocsMigration(
        new ConfigReader({ techdocs: { migration: { publishing: 'dual' } } }),
        options(),
        legacy,
      ),
    ).rejects.toThrow();
    expect(legacy).not.toHaveBeenCalled();
  });
});
