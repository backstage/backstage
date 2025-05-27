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

import { mockApis } from '@backstage/test-utils';
import { createPluginInfoAttacher } from './createPluginInfoAttacher';
import { OpaqueFrontendPlugin } from '@internal/frontend';
import {
  createFrontendPlugin,
  FrontendFeature,
} from '@backstage/frontend-plugin-api';

function getInfo(plugin: FrontendFeature) {
  return OpaqueFrontendPlugin.toInternal(plugin).info();
}

describe('createPluginInfoAttacher', () => {
  const mockConfig = mockApis.config({
    data: {
      app: {
        pluginOverrides: [
          {
            match: {
              pluginId: '/^.*-tester$/',
            },
            info: {
              description: 'Overridden description',
            },
          },
          {
            match: {
              pluginId: '/^not-.*-tester$/',
            },
            info: {
              ownerEntityRefs: ['test-group'],
            },
          },
          {
            match: {
              packageName: '@test/package',
            },
            info: {
              description: 'Package name matched',
            },
          },
          {
            match: {
              pluginId: 'info-tester',
            },
            info: {
              links: [{ title: 'Custom Link', url: 'https://example.com' }],
            },
          },
        ],
      },
    },
  });

  describe('with default resolver', () => {
    const attacher = createPluginInfoAttacher(mockConfig);

    it('should return a new plugin instance', async () => {
      const plugin = createFrontendPlugin({
        pluginId: 'test',
      });

      const newPlugin = attacher(plugin);
      expect(newPlugin).not.toBe(plugin);
      await expect(getInfo(newPlugin)).resolves.toEqual({});
    });

    it('should return non-plugin features unchanged', () => {
      const nonPluginFeature = {
        type: 'not-a-plugin',
      } as unknown as FrontendFeature;

      expect(attacher(nonPluginFeature)).toBe(nonPluginFeature);
    });

    it('should resolve plugin info from package.json and config overrides', async () => {
      await expect(
        getInfo(
          attacher(
            createFrontendPlugin({
              pluginId: 'other-tester',
              info: {
                packageJson: async () => ({
                  name: '@test/package',
                  version: '1.0.0',
                  description: 'Original description',
                  homepage: 'https://homepage.com',
                  repository: {
                    url: 'https://github.com/test/project',
                    directory: 'packages/test',
                  },
                }),
              },
            }),
          ),
        ),
      ).resolves.toEqual({
        packageName: '@test/package',
        version: '1.0.0',
        description: 'Package name matched',
        links: [
          {
            title: 'Homepage',
            url: 'https://homepage.com',
          },
          {
            title: 'Repository',
            url: 'https://github.com/test/project/tree/-/packages/test',
          },
        ],
      });

      await expect(
        getInfo(
          attacher(
            createFrontendPlugin({
              pluginId: 'info-tester',
              info: {
                packageJson: async () => ({
                  name: '@other/package',
                  description: 'Original description',
                  homepage: 'https://homepage.com',
                }),
              },
            }),
          ),
        ),
      ).resolves.toEqual({
        packageName: '@other/package',
        description: 'Overridden description',
        links: [
          {
            title: 'Custom Link',
            url: 'https://example.com',
          },
        ],
      });

      await expect(
        getInfo(
          attacher(
            createFrontendPlugin({
              pluginId: 'not-info-tester',
              info: {
                packageJson: async () => ({
                  name: '@other/package',
                  description: 'Original description',
                  repository: {
                    url: 'http://example.com',
                    directory: 'packages/test',
                  },
                }),
              },
            }),
          ),
        ),
      ).resolves.toEqual({
        packageName: '@other/package',
        description: 'Overridden description',
        ownerEntityRefs: ['group:default/test-group'],
        links: [
          {
            title: 'Repository',
            url: 'http://example.com/',
          },
        ],
      });
    });
  });

  describe('with custom resolver', () => {
    const plugin = createFrontendPlugin({
      pluginId: 'custom-resolver',
      info: {
        packageJson: async () => ({
          name: '@test/resolver',
          version: '1.0.0',
        }),
        manifest: async () => ({
          metadata: {
            links: [{ title: 'Metadata link', url: 'https://example.com' }],
          },
        }),
      },
    });

    it('should use the default resolver', async () => {
      const attacher = createPluginInfoAttacher(mockConfig, async ctx =>
        ctx.defaultResolver({
          packageJson: await ctx.packageJson(),
          manifest: await ctx.manifest(),
        }),
      );

      await expect(getInfo(attacher(plugin))).resolves.toEqual({
        packageName: '@test/resolver',
        version: '1.0.0',
        links: [
          {
            title: 'Metadata link',
            url: 'https://example.com',
          },
        ],
      });
    });

    it('should override info sources passed to default resolver', async () => {
      const attacher = createPluginInfoAttacher(mockConfig, ctx =>
        ctx.defaultResolver({
          packageJson: {
            name: '@test/resolver-other',
            version: '2.0.0',
          },
          manifest: {
            metadata: {
              links: [{ title: 'Other link', url: 'https://example.com' }],
            },
            spec: {
              owner: 'test-group',
            },
          },
        }),
      );

      await expect(getInfo(attacher(plugin))).resolves.toEqual({
        packageName: '@test/resolver-other',
        version: '2.0.0',
        links: [
          {
            title: 'Other link',
            url: 'https://example.com',
          },
        ],
        ownerEntityRefs: ['group:default/test-group'],
      });
    });

    it('should use a completely custom resolver', async () => {
      const attacher = createPluginInfoAttacher(mockConfig, async () => ({
        info: { version: '0.1.0' },
      }));

      await expect(getInfo(attacher(plugin))).resolves.toEqual({
        version: '0.1.0',
      });
    });

    it('should handle unexpected input from the default resolver', async () => {
      const attacher = createPluginInfoAttacher(mockConfig, ctx =>
        ctx.defaultResolver({
          packageJson: {
            name: null,
            version: {},
          },
          manifest: {
            metadata: {
              links: 'not an array',
            },
            spec: [],
          },
        }),
      );
      await expect(getInfo(attacher(plugin))).resolves.toEqual({
        version: '[object Object]',
      });
    });
  });
});
