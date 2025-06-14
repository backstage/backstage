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

import { InfinispanKeyvStore } from './InfinispanKeyvStore';
import { mockServices } from '@backstage/backend-test-utils';

describe('InfinispanKeyvStore', () => {
  const logger = mockServices.logger.mock();
  let store: InfinispanKeyvStore;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      get: jest.fn(),
      put: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
      disconnect: jest.fn(),
      on: jest.fn(),
    };

    store = new InfinispanKeyvStore({
      clientPromise: Promise.resolve(mockClient),
      logger,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('returns undefined when key is not found', async () => {
      mockClient.get.mockResolvedValueOnce(null);
      const result = await store.get('test-key');
      expect(result).toBeUndefined();
      expect(mockClient.get).toHaveBeenCalledWith('test-key');
    });

    it('returns value when key is found', async () => {
      const value = 'test-value';
      mockClient.get.mockResolvedValueOnce(value);
      const result = await store.get('test-key');
      expect(result).toBe(value);
      expect(mockClient.get).toHaveBeenCalledWith('test-key');
    });

    it('handles client errors', async () => {
      const error = new Error('Connection error');
      mockClient.get.mockRejectedValueOnce(error);
      await expect(store.get('test-key')).rejects.toThrow('Connection error');
    });
  });

  describe('set', () => {
    it('sets value with default options', async () => {
      await store.set('test-key', 'test-value');
      expect(mockClient.put).toHaveBeenCalledWith('test-key', 'test-value', {});
    });

    it('sets value with TTL', async () => {
      await store.set('test-key', 'test-value', 1000);
      expect(mockClient.put).toHaveBeenCalledWith('test-key', 'test-value', {
        lifespan: '1000ms',
      });
    });

    it('handles client errors', async () => {
      const error = new Error('Connection error');
      mockClient.put.mockRejectedValueOnce(error);
      await expect(store.set('test-key', 'test-value')).rejects.toThrow(
        'Connection error',
      );
    });
  });

  describe('delete', () => {
    it('deletes key', async () => {
      mockClient.remove.mockResolvedValueOnce(true);
      const result = await store.delete('test-key');
      expect(result).toBe(true);
      expect(mockClient.remove).toHaveBeenCalledWith('test-key');
    });

    it('handles client errors', async () => {
      const error = new Error('Connection error');
      mockClient.remove.mockRejectedValueOnce(error);
      await expect(store.delete('test-key')).rejects.toThrow(
        'Connection error',
      );
    });
  });

  describe('clear', () => {
    it('clears all entries', async () => {
      await store.clear();
      expect(mockClient.clear).toHaveBeenCalled();
    });

    it('handles client errors', async () => {
      const error = new Error('Connection error');
      mockClient.clear.mockRejectedValueOnce(error);
      await expect(store.clear()).rejects.toThrow('Connection error');
    });
  });

  describe('disconnect', () => {
    it('is a no-op as client is managed by CacheManager', async () => {
      const disconnectMockClient = {
        disconnect: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(null),
        put: jest.fn().mockResolvedValue(undefined),
        remove: jest.fn().mockResolvedValue(undefined),
        clear: jest.fn().mockResolvedValue(undefined),
      };
      const disconnectStore = new InfinispanKeyvStore({
        clientPromise: Promise.resolve(disconnectMockClient),
        logger: mockServices.logger.mock(),
      });
      await disconnectStore.disconnect();
      expect(disconnectMockClient.disconnect).not.toHaveBeenCalled();
    });

    it('handles client errors', async () => {
      const error = new Error('Connection error');
      const errorMockClient = {
        disconnect: jest.fn().mockRejectedValue(error),
        get: jest.fn().mockResolvedValue(null),
        put: jest.fn().mockResolvedValue(undefined),
        remove: jest.fn().mockResolvedValue(undefined),
        clear: jest.fn().mockResolvedValue(undefined),
      };
      const errorStore = new InfinispanKeyvStore({
        clientPromise: Promise.resolve(errorMockClient),
        logger: mockServices.logger.mock(),
      });
      await expect(errorStore.disconnect()).resolves.not.toThrow();
    });
  });

  describe('error handling', () => {
    it('emits error events from client', async () => {
      const error = new Error('Client error');
      const errorHandler = jest.fn();
      store.on('error', errorHandler);

      // Simulate client error
      const clientPromise = Promise.resolve(mockClient);
      store = new InfinispanKeyvStore({
        clientPromise,
        logger,
      });

      // Wait for client to be resolved
      await clientPromise;

      // Trigger error event
      const errorCallback = mockClient.on.mock.calls[0][1];
      errorCallback(error);

      expect(errorHandler).toHaveBeenCalledWith(error);
    });
  });
});
