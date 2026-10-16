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

import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { MKDOCS_SCHEMA } from '@backstage/plugin-techdocs-node';
import { cleanupZensicalConfig, patchZensicalConfig } from './zensicalHelpers';

describe('patchZensicalConfig', () => {
  const mockDir = createMockDirectory();
  const logger = mockServices.logger.mock();

  afterEach(mockDir.clear);

  async function patch(mkdocsYml: string) {
    mockDir.setContent({ 'mkdocs.yml': mkdocsYml });
    const patchedPath = await patchZensicalConfig(
      mockDir.resolve('mkdocs.yml'),
      'site',
      logger,
    );
    return yaml.load(await fs.readFile(patchedPath, 'utf8'), {
      schema: MKDOCS_SCHEMA,
    }) as Record<string, any>;
  }

  function extension(config: Record<string, any>, name: string) {
    const matches = (config.markdown_extensions as unknown[]).filter(entry =>
      typeof entry === 'string' ? entry === name : name in (entry as object),
    );
    expect(matches).toHaveLength(1);
    return matches[0];
  }

  it('writes a separate file and leaves mkdocs.yml unchanged', async () => {
    const original = 'site_name: Test\n';
    mockDir.setContent({ 'mkdocs.yml': original });
    const patchedPath = await patchZensicalConfig(
      mockDir.resolve('mkdocs.yml'),
      'site',
      logger,
    );
    expect(patchedPath).not.toBe(mockDir.resolve('mkdocs.yml'));
    await expect(
      fs.readFile(mockDir.resolve('mkdocs.yml'), 'utf8'),
    ).resolves.toBe(original);

    await cleanupZensicalConfig(patchedPath);
    await expect(fs.pathExists(patchedPath)).resolves.toBe(false);
  });

  it('sets the theme, site_dir and default extensions', async () => {
    const config = await patch(
      'site_name: Test\ntheme:\n  name: readthedocs\n  palette: { scheme: slate }\n',
    );
    expect(config.site_dir).toBe('site');
    expect(config.theme).toEqual({
      name: 'material',
      features: ['navigation.footer'],
      font: false,
    });
    expect(extension(config, 'admonition')).toBe('admonition');
    expect(extension(config, 'toc')).toEqual({ toc: { permalink: true } });
    expect(extension(config, 'pymdownx.tabbed')).toEqual({
      'pymdownx.tabbed': { alternate_style: true },
    });
    expect(config).not.toHaveProperty('mdx_configs');
  });

  it('keeps the user theme features', async () => {
    const config = await patch(
      'site_name: Test\ntheme:\n  features: [content.code.copy, navigation.footer]\n',
    );
    expect(config.theme.features).toEqual([
      'content.code.copy',
      'navigation.footer',
    ]);
  });

  it('merges a list of extension names', async () => {
    const config = await patch(
      'site_name: Test\nmarkdown_extensions:\n  - abbr\n  - toc\n',
    );
    expect(extension(config, 'abbr')).toBe('abbr');
    expect(extension(config, 'toc')).toEqual({ toc: { permalink: true } });
  });

  it('merges a mixed list, with user options winning', async () => {
    const config = await patch(
      [
        'site_name: Test',
        'markdown_extensions:',
        '  - abbr',
        '  - toc:',
        '      permalink: "#"',
        '      toc_depth: 3',
        '',
      ].join('\n'),
    );
    expect(extension(config, 'abbr')).toBe('abbr');
    expect(extension(config, 'toc')).toEqual({
      toc: { permalink: '#', toc_depth: 3 },
    });
  });

  it('merges the mapping form', async () => {
    const config = await patch(
      [
        'site_name: Test',
        'markdown_extensions:',
        '  abbr: {}',
        '  pymdownx.tabbed:',
        '    alternate_style: false',
        '',
      ].join('\n'),
    );
    expect(extension(config, 'abbr')).toEqual({ abbr: {} });
    expect(extension(config, 'pymdownx.tabbed')).toEqual({
      'pymdownx.tabbed': { alternate_style: false },
    });
    expect(extension(config, 'admonition')).toBe('admonition');
  });

  it.each([
    ['a list of names', 'plugins:\n  - search\n  - techdocs-core\n'],
    [
      'a mixed list',
      'plugins:\n  - search\n  - techdocs-core:\n      use_material_search: true\n',
    ],
    ['a mapping', 'plugins:\n  search: {}\n  techdocs-core: {}\n'],
  ])('removes techdocs-core from %s of plugins', async (_, plugins) => {
    const config = await patch(`site_name: Test\n${plugins}`);
    expect(config.plugins).toHaveLength(1);
    expect(JSON.stringify(config.plugins)).toContain('search');
    expect(JSON.stringify(config.plugins)).not.toContain('techdocs-core');
  });
});
