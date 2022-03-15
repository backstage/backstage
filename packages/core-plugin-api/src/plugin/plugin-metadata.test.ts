/*
 * Copyright 2022 The Backstage Authors
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

import { getPluginMetadata } from './plugin-metadata';

describe('getPluginMetadata', () => {
  it('should handle no metadata, and no extender', async () => {
    const metadata = await getPluginMetadata(undefined, 'foo', undefined);
    expect(metadata.description).toBeUndefined();
    expect(metadata.links).toHaveLength(0);
    expect(metadata.ownerEntityRef).toBeUndefined();
    expect(metadata.packageJson).toBeUndefined();
    expect(metadata.role).toBeUndefined();
    expect(metadata.version).toBeUndefined();
  });

  it('should handle no metadata, but with extender', async () => {
    const metadata = await getPluginMetadata(
      undefined,
      'foo',
      async (info, pluginId) => {
        info.description = `${pluginId} thing`;
        info.ownerEntityRef = 'group:default/the-group';
      },
    );
    expect(metadata.description).toBe('foo thing');
    expect(metadata.links).toHaveLength(0);
    expect(metadata.ownerEntityRef).toBe('group:default/the-group');
    expect(metadata.packageJson).toBeUndefined();
    expect(metadata.role).toBeUndefined();
    expect(metadata.version).toBeUndefined();
  });

  it('should handle empty metadata, and no extender', async () => {
    const metadata = await getPluginMetadata({}, 'foo', undefined);
    expect(metadata.description).toBeUndefined();
    expect(metadata.links).toHaveLength(0);
    expect(metadata.ownerEntityRef).toBeUndefined();
    expect(metadata.packageJson).toBeUndefined();
    expect(metadata.role).toBeUndefined();
    expect(metadata.version).toBeUndefined();
  });

  it('should handle empty metadata, but with extender', async () => {
    const metadata = await getPluginMetadata(
      {},
      'foo',
      async (info, pluginId) => {
        info.description = `${pluginId} thing`;
        info.ownerEntityRef = 'group:default/the-group';
      },
    );
    expect(metadata.description).toBe('foo thing');
    expect(metadata.links).toHaveLength(0);
    expect(metadata.ownerEntityRef).toBe('group:default/the-group');
    expect(metadata.packageJson).toBeUndefined();
    expect(metadata.role).toBeUndefined();
    expect(metadata.version).toBeUndefined();
  });

  it('should handle static metadata, and no extender', async () => {
    const metadata = await getPluginMetadata(
      { description: 'desc', role: 'cli' },
      'foo',
      undefined,
    );
    expect(metadata.description).toBe('desc');
    expect(metadata.links).toHaveLength(0);
    expect(metadata.ownerEntityRef).toBeUndefined();
    expect(metadata.packageJson).toBeUndefined();
    expect(metadata.role).toBe('cli');
    expect(metadata.version).toBeUndefined();
  });

  it('should handle static metadata, but with extender', async () => {
    const metadata = await getPluginMetadata(
      { description: 'desc', role: 'cli' },
      'foo',
      async (info, pluginId) => {
        info.description = `${pluginId} thing`;
        info.ownerEntityRef = 'group:default/the-group';
      },
    );
    expect(metadata.description).toBe('foo thing');
    expect(metadata.links).toHaveLength(0);
    expect(metadata.ownerEntityRef).toBe('group:default/the-group');
    expect(metadata.packageJson).toBeUndefined();
    expect(metadata.role).toBe('cli');
    expect(metadata.version).toBeUndefined();
  });

  it('should handle static metadata with dyn packageJson, and no extender', async () => {
    const packageJson = {
      name: 'the name',
      backstage: { role: 'cli' },
    };
    const metadata = await getPluginMetadata(
      {
        description: 'desc',
        packageJson: async () => ({ default: packageJson }),
      },
      'foo',
      undefined,
    );
    expect(metadata.description).toBe('desc');
    expect(metadata.links).toHaveLength(0);
    expect(metadata.ownerEntityRef).toBeUndefined();
    expect(metadata.packageJson).toStrictEqual(packageJson);
    expect(metadata.role).toBe('cli');
    expect(metadata.version).toBeUndefined();
  });

  it('should handle static metadata with dyn packageJson, but with extender', async () => {
    const packageJson = {
      name: 'the name',
      backstage: { role: 'cli' },
    };
    const metadata = await getPluginMetadata(
      {
        description: 'desc',
        packageJson: async () => ({ default: packageJson }),
      },
      'foo',
      async (info, pluginId) => {
        info.description = `${pluginId} thing`;
        info.ownerEntityRef = 'group:default/the-group';
      },
    );
    expect(metadata.description).toBe('foo thing');
    expect(metadata.links).toHaveLength(0);
    expect(metadata.ownerEntityRef).toBe('group:default/the-group');
    expect(metadata.packageJson).toStrictEqual(packageJson);
    expect(metadata.role).toBe('cli');
    expect(metadata.version).toBeUndefined();
  });
});
