/*
 * Copyright 2024 The Backstage Authors
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

import { OptionValues } from 'commander';
import fs from 'fs-extra';

const mockPublish = jest.fn().mockResolvedValue({ objects: [] });
const mockGetReadiness = jest
  .fn()
  .mockResolvedValue({ isAvailable: true });
const mockFetchTechDocsMetadata = jest.fn();

jest.mock('@backstage/plugin-techdocs-node', () => ({
  Publisher: {
    fromConfig: jest.fn().mockResolvedValue({
      publish: mockPublish,
      getReadiness: mockGetReadiness,
      fetchTechDocsMetadata: mockFetchTechDocsMetadata,
    }),
  },
}));

jest.mock('@backstage/backend-defaults/discovery', () => ({
  HostDiscovery: {
    fromConfig: jest.fn().mockReturnValue({}),
  },
}));

jest.mock('../../lib/PublisherConfig', () => ({
  PublisherConfig: {
    getValidConfig: jest.fn().mockReturnValue({}),
  },
}));

jest.mock('../../lib/utility', () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

import publish from './publish';

const baseOpts: OptionValues = {
  publisherType: 'googleGcs',
  storageName: 'my-bucket',
  entity: 'default/Component/my-entity',
  directory: '/tmp/site',
  verbose: false,
};

describe('publish', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetReadiness.mockResolvedValue({ isAvailable: true });
  });

  it('should publish without --skip-if-unchanged', async () => {
    await publish(baseOpts);
    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(mockFetchTechDocsMetadata).not.toHaveBeenCalled();
  });

  describe('--skip-if-unchanged', () => {
    const skipOpts: OptionValues = {
      ...baseOpts,
      skipIfUnchanged: true,
    };

    it('should skip publish when local and remote etags match', async () => {
      jest.spyOn(fs, 'pathExists').mockResolvedValue(true as never);
      jest.spyOn(fs, 'readJson').mockResolvedValue({
        site_name: 'Test',
        site_description: 'Test site',
        etag: 'abc123',
        build_timestamp: 1234567890,
      });
      mockFetchTechDocsMetadata.mockResolvedValue({
        site_name: 'Test',
        site_description: 'Test site',
        etag: 'abc123',
        build_timestamp: 1234567890,
      });

      const result = await publish(skipOpts);

      expect(result).toBe(true);
      expect(mockFetchTechDocsMetadata).toHaveBeenCalledWith({
        namespace: 'default',
        kind: 'Component',
        name: 'my-entity',
      });
      expect(mockPublish).not.toHaveBeenCalled();
    });

    it('should proceed with publish when etags differ', async () => {
      jest.spyOn(fs, 'pathExists').mockResolvedValue(true as never);
      jest.spyOn(fs, 'readJson').mockResolvedValue({
        site_name: 'Test',
        site_description: 'Test site',
        etag: 'new-sha',
        build_timestamp: 1234567890,
      });
      mockFetchTechDocsMetadata.mockResolvedValue({
        site_name: 'Test',
        site_description: 'Test site',
        etag: 'old-sha',
        build_timestamp: 1234567890,
      });

      await publish(skipOpts);

      expect(mockPublish).toHaveBeenCalledTimes(1);
    });

    it('should proceed when remote metadata is not found (first publish)', async () => {
      jest.spyOn(fs, 'pathExists').mockResolvedValue(true as never);
      jest.spyOn(fs, 'readJson').mockResolvedValue({
        site_name: 'Test',
        site_description: 'Test site',
        etag: 'abc123',
        build_timestamp: 1234567890,
      });
      mockFetchTechDocsMetadata.mockRejectedValue(
        new Error('Metadata Not Found'),
      );

      await publish(skipOpts);

      expect(mockPublish).toHaveBeenCalledTimes(1);
    });

    it('should proceed when local techdocs_metadata.json does not exist', async () => {
      jest.spyOn(fs, 'pathExists').mockResolvedValue(false as never);

      await publish(skipOpts);

      expect(mockPublish).toHaveBeenCalledTimes(1);
      expect(mockFetchTechDocsMetadata).not.toHaveBeenCalled();
    });

    it('should proceed when local etag is empty', async () => {
      jest.spyOn(fs, 'pathExists').mockResolvedValue(true as never);
      jest.spyOn(fs, 'readJson').mockResolvedValue({
        site_name: 'Test',
        site_description: 'Test site',
        etag: '',
        build_timestamp: 1234567890,
      });

      await publish(skipOpts);

      expect(mockPublish).toHaveBeenCalledTimes(1);
      expect(mockFetchTechDocsMetadata).not.toHaveBeenCalled();
    });
  });
});
