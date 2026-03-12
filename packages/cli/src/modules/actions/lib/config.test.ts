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

import { createMockDirectory } from '@backstage/backend-test-utils';
import {
  getPluginSources,
  addPluginSource,
  removePluginSource,
} from './config';

const mockDir = createMockDirectory();

describe('config', () => {
  beforeEach(() => {
    mockDir.clear();
    process.env.XDG_CONFIG_HOME = mockDir.resolve('config');
  });

  afterEach(() => {
    delete process.env.XDG_CONFIG_HOME;
  });

  describe('getPluginSources', () => {
    it('returns empty array when no config file exists', async () => {
      const result = await getPluginSources('my-instance');
      expect(result).toEqual([]);
    });

    it('returns empty array for unknown instance', async () => {
      mockDir.setContent({
        'config/backstage-cli/actions-config.yaml': `instances:
  known-instance:
    pluginSources:
    - some-plugin
`,
      });

      const result = await getPluginSources('unknown-instance');
      expect(result).toEqual([]);
    });

    it('returns sources for a configured instance', async () => {
      mockDir.setContent({
        'config/backstage-cli/actions-config.yaml': `instances:
  my-instance:
    pluginSources:
    - plugin-a
    - plugin-b
`,
      });

      const result = await getPluginSources('my-instance');
      expect(result).toEqual(['plugin-a', 'plugin-b']);
    });
  });

  describe('addPluginSource', () => {
    it('creates the config file and adds a source', async () => {
      await addPluginSource('my-instance', 'plugin-a');

      const result = await getPluginSources('my-instance');
      expect(result).toEqual(['plugin-a']);
    });

    it('does not duplicate an existing source', async () => {
      await addPluginSource('my-instance', 'plugin-a');
      await addPluginSource('my-instance', 'plugin-a');

      const result = await getPluginSources('my-instance');
      expect(result).toEqual(['plugin-a']);
    });

    it('adds to existing sources for an instance', async () => {
      mockDir.setContent({
        'config/backstage-cli/actions-config.yaml': `instances:
  my-instance:
    pluginSources:
    - plugin-a
`,
      });

      await addPluginSource('my-instance', 'plugin-b');

      const result = await getPluginSources('my-instance');
      expect(result).toEqual(['plugin-a', 'plugin-b']);
    });
  });

  describe('removePluginSource', () => {
    it('removes a source from an instance', async () => {
      mockDir.setContent({
        'config/backstage-cli/actions-config.yaml': `instances:
  my-instance:
    pluginSources:
    - plugin-a
    - plugin-b
`,
      });

      await removePluginSource('my-instance', 'plugin-a');

      const result = await getPluginSources('my-instance');
      expect(result).toEqual(['plugin-b']);
    });

    it('does nothing if source does not exist', async () => {
      mockDir.setContent({
        'config/backstage-cli/actions-config.yaml': `instances:
  my-instance:
    pluginSources:
    - plugin-a
`,
      });

      await removePluginSource('my-instance', 'plugin-b');

      const result = await getPluginSources('my-instance');
      expect(result).toEqual(['plugin-a']);
    });

    it('does nothing if instance does not exist', async () => {
      await removePluginSource('nonexistent', 'plugin-a');

      const result = await getPluginSources('nonexistent');
      expect(result).toEqual([]);
    });
  });

  describe('invalid YAML', () => {
    it('handles invalid YAML gracefully', async () => {
      mockDir.setContent({
        'config/backstage-cli/actions-config.yaml': 'invalid: yaml: [',
      });

      const result = await getPluginSources('my-instance');
      expect(result).toEqual([]);
    });
  });
});
