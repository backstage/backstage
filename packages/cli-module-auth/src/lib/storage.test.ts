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
import path from 'node:path';
import { NotFoundError } from '@backstage/errors';
import { createMockDirectory } from '@backstage/backend-test-utils';
import {
  getAllInstances,
  getSelectedInstance,
  getInstanceByName,
  getInstanceMetadata,
  updateInstanceMetadata,
  upsertInstance,
  removeInstance,
  setSelectedInstance,
  withMetadataLock,
  StoredInstance,
} from './storage';

const mockDir = createMockDirectory();

describe('storage', () => {
  const mockInstance1: StoredInstance = {
    name: 'production',
    baseUrl: 'https://backstage.example.com',
    clientId: 'prod-client',
    issuedAt: Date.now(),
    accessTokenExpiresAt: Date.now() + 3600_000,
    selected: true,
  };

  const mockInstance2: StoredInstance = {
    name: 'staging',
    baseUrl: 'https://staging.backstage.example.com',
    clientId: 'staging-client',
    issuedAt: Date.now(),
    accessTokenExpiresAt: Date.now() + 3600_000,
    selected: false,
  };

  beforeEach(() => {
    mockDir.clear();
    process.env.XDG_CONFIG_HOME = mockDir.resolve('config');
  });

  afterEach(() => {
    delete process.env.XDG_CONFIG_HOME;
  });

  describe('getAllInstances', () => {
    it('should return empty array if file does not exist or is empty', async () => {
      const result1 = await getAllInstances();
      expect(result1).toEqual({ instances: [], selected: undefined });

      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': '',
      });

      const result2 = await getAllInstances();
      expect(result2).toEqual({ instances: [], selected: undefined });
    });

    it('should parse and return instances from YAML', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: production
    baseUrl: https://backstage.example.com
    clientId: prod-client
    issuedAt: ${mockInstance1.issuedAt}

    accessTokenExpiresAt: ${mockInstance1.accessTokenExpiresAt}
    selected: true
  - name: staging
    baseUrl: https://staging.backstage.example.com
    clientId: staging-client
    issuedAt: ${mockInstance2.issuedAt}

    accessTokenExpiresAt: ${mockInstance2.accessTokenExpiresAt}
`,
      });

      const result = await getAllInstances();

      expect(result.instances).toHaveLength(2);
      expect(result.selected?.name).toBe('production');
    });

    it('should select first instance if none marked as selected', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: production
    baseUrl: https://backstage.example.com
    clientId: prod-client
    issuedAt: ${mockInstance1.issuedAt}

    accessTokenExpiresAt: ${mockInstance1.accessTokenExpiresAt}
  - name: staging
    baseUrl: https://staging.backstage.example.com
    clientId: staging-client
    issuedAt: ${mockInstance2.issuedAt}

    accessTokenExpiresAt: ${mockInstance2.accessTokenExpiresAt}
`,
      });

      const result = await getAllInstances();

      expect(result.selected?.name).toBe('production');
    });

    it('should return empty array if YAML parsing fails', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': 'invalid: yaml: [',
      });

      const result = await getAllInstances();

      expect(result).toEqual({ instances: [], selected: undefined });
    });

    it('should normalize selected property across instances', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: production
    baseUrl: https://backstage.example.com
    clientId: prod-client
    issuedAt: ${mockInstance1.issuedAt}

    accessTokenExpiresAt: ${mockInstance1.accessTokenExpiresAt}
    selected: true
  - name: staging
    baseUrl: https://staging.backstage.example.com
    clientId: staging-client
    issuedAt: ${mockInstance2.issuedAt}

    accessTokenExpiresAt: ${mockInstance2.accessTokenExpiresAt}
    selected: true
`,
      });

      const result = await getAllInstances();

      const selectedCount = result.instances.filter(i => i.selected).length;
      expect(selectedCount).toBe(1);
    });
  });

  describe('getSelectedInstance', () => {
    it('should return instance by name if provided', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: production
    baseUrl: https://backstage.example.com
    clientId: prod-client
    issuedAt: ${mockInstance1.issuedAt}

    accessTokenExpiresAt: ${mockInstance1.accessTokenExpiresAt}
`,
      });

      const result = await getSelectedInstance('production');

      expect(result.name).toBe('production');
    });

    it('should return selected instance if no name provided', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: production
    baseUrl: https://backstage.example.com
    clientId: prod-client
    issuedAt: ${mockInstance1.issuedAt}

    accessTokenExpiresAt: ${mockInstance1.accessTokenExpiresAt}
  - name: staging
    baseUrl: https://staging.backstage.example.com
    clientId: staging-client
    issuedAt: ${mockInstance2.issuedAt}

    accessTokenExpiresAt: ${mockInstance2.accessTokenExpiresAt}
    selected: true
`,
      });

      const result = await getSelectedInstance();

      expect(result.name).toBe('staging');
    });

    it('should throw error if no instances exist', async () => {
      await expect(getSelectedInstance()).rejects.toThrow(
        'No instances found. Run "auth login" to authenticate first.',
      );
    });
  });

  describe('getInstanceByName', () => {
    it('should return instance with matching name', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: production
    baseUrl: https://backstage.example.com
    clientId: prod-client
    issuedAt: ${mockInstance1.issuedAt}

    accessTokenExpiresAt: ${mockInstance1.accessTokenExpiresAt}
`,
      });

      const result = await getInstanceByName('production');

      expect(result.name).toBe('production');
    });

    it('should throw NotFoundError if instance does not exist', async () => {
      await expect(getInstanceByName('nonexistent')).rejects.toThrow(
        NotFoundError,
      );
      await expect(getInstanceByName('nonexistent')).rejects.toThrow(
        "Instance 'nonexistent' not found",
      );
    });
  });

  describe('upsertInstance', () => {
    it('should add new instance if it does not exist', async () => {
      await upsertInstance(mockInstance1);

      const result = await getAllInstances();
      expect(result.instances).toHaveLength(1);
      expect(result.instances[0].name).toBe('production');
    });

    it('should update existing instance', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: production
    baseUrl: https://backstage.example.com
    clientId: prod-client
    issuedAt: ${mockInstance1.issuedAt}
    accessTokenExpiresAt: ${mockInstance1.accessTokenExpiresAt}
`,
      });

      const updatedInstance = {
        ...mockInstance1,
        clientId: 'updated-client',
      };

      await upsertInstance(updatedInstance);

      const result = await getInstanceByName('production');
      expect(result.clientId).toBe('updated-client');
    });
  });

  describe('removeInstance', () => {
    it('should remove instance with matching name', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: production
    baseUrl: https://backstage.example.com
    clientId: prod-client
    issuedAt: ${mockInstance1.issuedAt}

    accessTokenExpiresAt: ${mockInstance1.accessTokenExpiresAt}
  - name: staging
    baseUrl: https://staging.backstage.example.com
    clientId: staging-client
    issuedAt: ${mockInstance2.issuedAt}

    accessTokenExpiresAt: ${mockInstance2.accessTokenExpiresAt}
`,
      });

      await removeInstance('production');

      const result = await getAllInstances();
      expect(result.instances).toHaveLength(1);
      expect(result.instances[0].name).toBe('staging');
    });

    it('should do nothing if instance does not exist', async () => {
      await removeInstance('nonexistent');

      const result = await getAllInstances();
      expect(result.instances).toHaveLength(0);
    });
  });

  describe('setSelectedInstance', () => {
    it('should set selected instance and unselect others', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: production
    baseUrl: https://backstage.example.com
    clientId: prod-client
    issuedAt: ${mockInstance1.issuedAt}

    accessTokenExpiresAt: ${mockInstance1.accessTokenExpiresAt}
    selected: true
  - name: staging
    baseUrl: https://staging.backstage.example.com
    clientId: staging-client
    issuedAt: ${mockInstance2.issuedAt}

    accessTokenExpiresAt: ${mockInstance2.accessTokenExpiresAt}
`,
      });

      await setSelectedInstance('staging');

      const result = await getAllInstances();
      expect(result.selected?.name).toBe('staging');

      const prodInstance = result.instances.find(i => i.name === 'production');
      expect(prodInstance?.selected).toBe(false);
    });

    it('should throw error if instance does not exist', async () => {
      await expect(setSelectedInstance('nonexistent')).rejects.toThrow(
        "Unknown instance 'nonexistent'",
      );
    });
  });

  describe('withMetadataLock', () => {
    it('should acquire and release lock', async () => {
      const callback = jest.fn().mockResolvedValue('result');
      const result = await withMetadataLock(callback);

      expect(callback).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should release lock even if callback throws', async () => {
      const error = new Error('Test error');
      const callback = jest.fn().mockRejectedValue(error);

      await expect(withMetadataLock(callback)).rejects.toThrow(error);

      // Lock should still be released, allowing subsequent calls
      const callback2 = jest.fn().mockResolvedValue('result');
      await expect(withMetadataLock(callback2)).resolves.toBe('result');
    });
  });

  describe('getInstanceMetadata', () => {
    it('should return undefined when no metadata set', async () => {
      await upsertInstance(mockInstance1);

      const result = await getInstanceMetadata('production', 'someKey');
      expect(result).toBeUndefined();
    });

    it('should return metadata value for a key', async () => {
      await upsertInstance(mockInstance1);
      await updateInstanceMetadata('production', 'myKey', 'myValue');

      const result = await getInstanceMetadata('production', 'myKey');
      expect(result).toBe('myValue');
    });

    it('should throw NotFoundError for unknown instance', async () => {
      await expect(getInstanceMetadata('nonexistent', 'key')).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('updateInstanceMetadata', () => {
    it('should set a metadata value', async () => {
      await upsertInstance(mockInstance1);
      await updateInstanceMetadata('production', 'key1', 'value1');

      const result = await getInstanceMetadata('production', 'key1');
      expect(result).toBe('value1');
    });

    it('should preserve existing metadata keys', async () => {
      await upsertInstance(mockInstance1);
      await updateInstanceMetadata('production', 'key1', 'value1');
      await updateInstanceMetadata('production', 'key2', 'value2');

      const result1 = await getInstanceMetadata('production', 'key1');
      const result2 = await getInstanceMetadata('production', 'key2');
      expect(result1).toBe('value1');
      expect(result2).toBe('value2');
    });

    it('should throw NotFoundError for unknown instance', async () => {
      await expect(
        updateInstanceMetadata('nonexistent', 'key', 'value'),
      ).rejects.toThrow(NotFoundError);
    });

    it('should remove instance along with its metadata', async () => {
      await upsertInstance(mockInstance1);
      await updateInstanceMetadata('production', 'key1', 'value1');
      await removeInstance('production');

      const { instances } = await getAllInstances();
      expect(instances.find(i => i.name === 'production')).toBeUndefined();

      await upsertInstance(mockInstance1);
      const result = await getInstanceMetadata('production', 'key1');
      expect(result).toBeUndefined();
    });
  });

  describe('file path resolution', () => {
    it('should use XDG_CONFIG_HOME when set', async () => {
      const customConfigHome = mockDir.resolve('custom-config');
      process.env.XDG_CONFIG_HOME = customConfigHome;

      await upsertInstance(mockInstance1);

      const result = await getAllInstances();
      expect(result.instances).toHaveLength(1);
      expect(result.instances[0].name).toBe('production');

      // Verify file was created in custom location
      const expectedFile = path.join(
        customConfigHome,
        'backstage-cli',
        'auth-instances.yaml',
      );
      expect(await fs.pathExists(expectedFile)).toBe(true);
    });

    it('should create files with correct permissions (0o600)', async () => {
      // File permissions are not reliably enforced on Windows
      if (process.platform === 'win32') {
        return;
      }

      await upsertInstance(mockInstance1);

      const file = path.join(
        mockDir.resolve('config'),
        'backstage-cli',
        'auth-instances.yaml',
      );
      const stats = await fs.stat(file);
      const mode = stats.mode & 0o777;
      expect(mode).toBe(0o600);
    });

    it('should handle invalid schema and missing fields gracefully', async () => {
      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: ""
    baseUrl: not-a-url
    clientId: ""
`,
      });

      const result1 = await getAllInstances();
      expect(result1.instances).toHaveLength(0);

      mockDir.setContent({
        'config/backstage-cli/auth-instances.yaml': `instances:
  - name: production
`,
      });

      const result2 = await getAllInstances();
      expect(result2.instances).toHaveLength(0);
    });
  });
});
