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

import os from 'node:os';
import { join } from 'node:path';
import fs from 'fs-extra';
import { readEntityFromCatalog, resolveEngine } from './catalogEntity';

const logger = { info: jest.fn(), warn: jest.fn() };

const entityYaml = (name: string, annotations: Record<string, string> = {}) =>
  [
    'apiVersion: backstage.io/v1alpha1',
    'kind: Component',
    'metadata:',
    `  name: ${name}`,
    '  annotations:',
    ...Object.entries(annotations).map(([k, v]) => `    ${k}: ${v}`),
    ...(Object.keys(annotations).length ? [] : ['    {}']),
  ].join('\n');

describe('catalogEntity', () => {
  let dir: string;
  const writeCatalog = (content: string) =>
    fs.writeFile(join(dir, 'catalog-info.yaml'), content);

  beforeEach(async () => {
    dir = await fs.mkdtemp(join(os.tmpdir(), 'techdocs-cli-catalog-'));
    jest.clearAllMocks();
  });

  afterEach(() => fs.remove(dir));

  it('returns undefined when there is no catalog file', async () => {
    await expect(readEntityFromCatalog(dir)).resolves.toBeUndefined();
  });

  it('picks the entity carrying TechDocs annotations from a multi-document file', async () => {
    await writeCatalog(
      [
        entityYaml('other'),
        entityYaml('docs', {
          'backstage.io/techdocs-ref': 'dir:.',
          'backstage.io/techdocs-engine': 'custom',
        }),
      ].join('\n---\n'),
    );

    const entity = await readEntityFromCatalog(dir);
    expect(entity?.metadata.name).toBe('docs');
  });

  it('warns and ignores an unparsable catalog file', async () => {
    await writeCatalog('metadata: [unclosed');

    await expect(readEntityFromCatalog(dir, logger)).resolves.toBeUndefined();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Failed to parse'),
    );
  });

  describe('resolveEngine', () => {
    beforeEach(() =>
      writeCatalog(
        entityYaml('docs', { 'backstage.io/techdocs-engine': 'custom' }),
      ),
    );

    it('prefers the explicit engine over the annotation', async () => {
      const { engine, source } = await resolveEngine(dir, 'mkdocs', logger);
      expect(engine).toBe('mkdocs');
      expect(source).toBe('flag');
    });

    it('uses the annotation when no engine is given', async () => {
      const { engine, source } = await resolveEngine(dir, undefined, logger);
      expect(engine).toBe('custom');
      expect(source).toBe('annotation');
    });

    it('defaults to mkdocs', async () => {
      await fs.remove(join(dir, 'catalog-info.yaml'));
      const { engine, source } = await resolveEngine(dir, undefined, logger);
      expect(engine).toBe('mkdocs');
      expect(source).toBe('default');
    });
  });
});
