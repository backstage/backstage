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
import path from 'path';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { getSecretStore, resetSecretStore } from './secretStore';

const mockDir = createMockDirectory();

describe('secretStore', () => {
  beforeEach(() => {
    mockDir.clear();
    process.env.XDG_DATA_HOME = mockDir.resolve('data');
    resetSecretStore();
  });

  afterEach(() => {
    delete process.env.XDG_DATA_HOME;
    resetSecretStore();
  });

  describe('FileSecretStore', () => {
    it('should store and retrieve secrets', async () => {
      const store = await getSecretStore();
      await store.set('test-service', 'test-account', 'test-secret');
      const result = await store.get('test-service', 'test-account');

      expect(result).toBe('test-secret');
    });

    it('should return undefined for non-existent secrets', async () => {
      const store = await getSecretStore();
      const result = await store.get('test-service', 'test-account');

      expect(result).toBeUndefined();
    });

    it('should delete secrets', async () => {
      const store = await getSecretStore();
      await store.set('test-service', 'test-account', 'test-secret');

      let result = await store.get('test-service', 'test-account');
      expect(result).toBe('test-secret');

      await store.delete('test-service', 'test-account');

      result = await store.get('test-service', 'test-account');
      expect(result).toBeUndefined();
    });

    it('should not throw when deleting non-existent secrets', async () => {
      const store = await getSecretStore();

      await expect(
        store.delete('non-existent-service', 'non-existent-account'),
      ).resolves.not.toThrow();
    });

    it('should create files with correct directory structure', async () => {
      const store = await getSecretStore();
      await store.set('test-service', 'test-account', 'test-secret');

      const expectedDir = path.join(
        mockDir.resolve('data'),
        'backstage-cli',
        'secrets',
        encodeURIComponent('test-service'),
      );
      const expectedFile = path.join(
        expectedDir,
        `${encodeURIComponent('test-account')}.secret`,
      );

      expect(await fs.pathExists(expectedFile)).toBe(true);
      expect(await fs.pathExists(expectedDir)).toBe(true);
    });

    it('should create files with correct permissions (0o600)', async () => {
      const store = await getSecretStore();
      await store.set('test-service', 'test-account', 'test-secret');

      const expectedFile = path.join(
        mockDir.resolve('data'),
        'backstage-cli',
        'secrets',
        encodeURIComponent('test-service'),
        `${encodeURIComponent('test-account')}.secret`,
      );

      const stats = await fs.stat(expectedFile);
      const mode = stats.mode & 0o777;
      expect(mode).toBe(0o600);
    });

    it('should encode service and account names in file path', async () => {
      const store = await getSecretStore();
      await store.set('my-service/test', 'my-account@test', 'test-secret');

      const result = await store.get('my-service/test', 'my-account@test');
      expect(result).toBe('test-secret');

      const expectedFile = path.join(
        mockDir.resolve('data'),
        'backstage-cli',
        'secrets',
        encodeURIComponent('my-service/test'),
        `${encodeURIComponent('my-account@test')}.secret`,
      );
      expect(await fs.pathExists(expectedFile)).toBe(true);
    });

    it('should handle unicode characters in service and account names', async () => {
      const store = await getSecretStore();
      await store.set('service-测试', 'account-🚀', 'test-secret');

      const result = await store.get('service-测试', 'account-🚀');
      expect(result).toBe('test-secret');
    });

    it('should handle multiple secrets for same service', async () => {
      const store = await getSecretStore();
      await store.set('test-service', 'account1', 'secret1');
      await store.set('test-service', 'account2', 'secret2');

      const result1 = await store.get('test-service', 'account1');
      const result2 = await store.get('test-service', 'account2');

      expect(result1).toBe('secret1');
      expect(result2).toBe('secret2');
    });

    it('should handle multiple services', async () => {
      const store = await getSecretStore();
      await store.set('service1', 'account', 'secret1');
      await store.set('service2', 'account', 'secret2');

      const result1 = await store.get('service1', 'account');
      const result2 = await store.get('service2', 'account');

      expect(result1).toBe('secret1');
      expect(result2).toBe('secret2');
    });

    it('should update existing secrets', async () => {
      const store = await getSecretStore();
      await store.set('test-service', 'test-account', 'old-secret');
      await store.set('test-service', 'test-account', 'new-secret');

      const result = await store.get('test-service', 'test-account');
      expect(result).toBe('new-secret');
    });

    it('should handle empty string secrets', async () => {
      const store = await getSecretStore();
      await store.set('test-service', 'test-account', '');

      const result = await store.get('test-service', 'test-account');
      expect(result).toBe('');
    });

    it('should handle very long secrets', async () => {
      const store = await getSecretStore();
      const longSecret = 'a'.repeat(10000);
      await store.set('test-service', 'test-account', longSecret);

      const result = await store.get('test-service', 'test-account');
      expect(result).toBe(longSecret);
    });

    it('should use XDG_DATA_HOME when set', async () => {
      const customDataHome = mockDir.resolve('custom-data');
      process.env.XDG_DATA_HOME = customDataHome;
      resetSecretStore();

      const store = await getSecretStore();
      await store.set('test-service', 'test-account', 'test-secret');

      const expectedFile = path.join(
        customDataHome,
        'backstage-cli',
        'secrets',
        encodeURIComponent('test-service'),
        `${encodeURIComponent('test-account')}.secret`,
      );
      expect(await fs.pathExists(expectedFile)).toBe(true);

      const result = await store.get('test-service', 'test-account');
      expect(result).toBe('test-secret');
    });
  });

  describe('getSecretStore singleton', () => {
    it('should return the same instance on multiple calls', async () => {
      const store1 = await getSecretStore();
      const store2 = await getSecretStore();

      expect(store1).toBe(store2);
    });

    it('should create new instance after reset', async () => {
      const store1 = await getSecretStore();
      resetSecretStore();
      const store2 = await getSecretStore();

      expect(store1).not.toBe(store2);
    });
  });

  describe('fallback behavior', () => {
    it('should fall back to FileSecretStore when keytar is not available', async () => {
      const store = await getSecretStore();
      await store.set('test-service', 'test-account', 'test-secret');

      const result = await store.get('test-service', 'test-account');
      expect(result).toBe('test-secret');

      const expectedFile = path.join(
        mockDir.resolve('data'),
        'backstage-cli',
        'secrets',
        encodeURIComponent('test-service'),
        `${encodeURIComponent('test-account')}.secret`,
      );
      expect(await fs.pathExists(expectedFile)).toBe(true);
    });
  });
});
