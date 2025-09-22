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
import { mockServices } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { GiteaEntityProvider } from './GiteaEntityProvider';
import * as uuid from 'uuid';
import { readGiteaConfigs } from './config';
import { getGiteaApiUrl } from './core';
import { GiteaIntegration } from '@backstage/integration';

jest.mock('./config');
jest.mock('./core');
jest.mock('uuid');

describe('GiteaEntityProvider', () => {
  const logger = mockServices.logger.mock();

  const mockScheduler = {
    createScheduledTaskRunner: jest.fn(),
    triggerTask: jest.fn(),
    scheduleTask: jest.fn(),
    getScheduledTasks: jest.fn(),
  };
  const mockTaskRunner = {
    run: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (readGiteaConfigs as jest.Mock).mockReturnValue([
      {
        id: 'test-provider',
        host: 'gitea.example.com',
        organization: 'test-org',
        catalogPath: 'catalog-info.yaml',
        branch: 'main',
        schedule: {
          frequency: { minutes: 30 },
          timeout: { minutes: 3 },
        },
      },
    ]);
    (getGiteaApiUrl as jest.Mock).mockReturnValue(
      'https://gitea.example.com/api/v1/',
    );
    mockScheduler.createScheduledTaskRunner.mockReturnValue(mockTaskRunner);
    (uuid.v4 as jest.Mock).mockReturnValue('test-uuid');

    // Mock global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fromConfig', () => {
    it('should create providers from config', () => {
      const config = new ConfigReader({
        integrations: {
          gitea: [
            {
              host: 'gitea.example.com',
              token: 'test-token',
            },
          ],
        },
        catalog: {
          providers: {
            gitea: {
              'test-provider': {
                host: 'gitea.example.com',
                organization: 'test-org',
              },
            },
          },
        },
      });

      const providers = GiteaEntityProvider.fromConfig(config, {
        logger,
        scheduler: mockScheduler,
      });

      expect(providers).toHaveLength(1);
      expect(providers[0].getProviderName()).toBe(
        'gitea-provider:test-provider',
      );
    });

    it('should throw if no schedule or scheduler is provided', () => {
      const config = new ConfigReader({
        integrations: {
          gitea: [
            {
              host: 'gitea.example.com',
              token: 'test-token',
            },
          ],
        },
        catalog: {
          providers: {
            gitea: {
              'test-provider': {
                host: 'gitea.example.com',
                organization: 'test-org',
              },
            },
          },
        },
      });

      expect(() =>
        GiteaEntityProvider.fromConfig(config, {
          logger,
        } as any),
      ).toThrow('Either schedule or scheduler must be provided.');
    });

    it('should throw if no matching integration is found', () => {
      const config = new ConfigReader({
        integrations: {
          gitea: [
            {
              host: 'wrong-host.example.com',
              token: 'test-token',
            },
          ],
        },
        catalog: {
          providers: {
            gitea: {
              'test-provider': {
                host: 'gitea.example.com',
                organization: 'test-org',
              },
            },
          },
        },
      });

      expect(() =>
        GiteaEntityProvider.fromConfig(config, {
          logger,
          scheduler: mockScheduler,
        }),
      ).toThrow(
        'No Gitea integration found that matches host gitea.example.com',
      );
    });

    it('should throw if no schedule is provided in code or config', () => {
      const config = new ConfigReader({
        integrations: {
          gitea: [
            {
              host: 'gitea.example.com',
              token: 'test-token',
            },
          ],
        },
        catalog: {
          providers: {
            gitea: {
              'test-provider': {
                host: 'gitea.example.com',
                organization: 'test-org',
                schedule: undefined,
              },
            },
          },
        },
      });

      (readGiteaConfigs as jest.Mock).mockReturnValue([
        {
          id: 'test-provider',
          host: 'gitea.example.com',
          organization: 'test-org',
          catalogPath: 'catalog-info.yaml',
          branch: 'main',
          schedule: undefined,
        },
      ]);

      expect(() =>
        GiteaEntityProvider.fromConfig(config, {
          logger,
          scheduler: mockScheduler,
        }),
      ).toThrow(
        'No schedule provided neither via code nor config for Gitea-provider:test-provider.',
      );
    });
  });

  describe('getProviderName', () => {
    it('should return the correct provider name', () => {
      const config = new ConfigReader({
        integrations: {
          gitea: [
            {
              host: 'gitea.example.com',
              token: 'test-token',
            },
          ],
        },
        catalog: {
          providers: {
            gitea: {
              'test-provider': {
                host: 'gitea.example.com',
                organization: 'test-org',
              },
            },
          },
        },
      });

      const providers = GiteaEntityProvider.fromConfig(config, {
        logger,
        scheduler: mockScheduler,
      });

      expect(providers[0].getProviderName()).toBe(
        'gitea-provider:test-provider',
      );
    });
  });

  describe('connect', () => {
    let provider: GiteaEntityProvider;
    const mockConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    beforeEach(() => {
      const config = new ConfigReader({
        integrations: {
          gitea: [
            {
              host: 'gitea.example.com',
              token: 'test-token',
            },
          ],
        },
        catalog: {
          providers: {
            gitea: {
              'test-provider': {
                host: 'gitea.example.com',
                organization: 'test-org',
              },
            },
          },
        },
      });

      provider = GiteaEntityProvider.fromConfig(config, {
        logger,
        scheduler: mockScheduler,
      })[0];
    });

    it('should connect and schedule a refresh', async () => {
      await provider.connect(mockConnection);

      expect(mockTaskRunner.run).toHaveBeenCalledWith({
        id: 'gitea-provider:test-provider:refresh',
        fn: expect.any(Function),
      });
    });
  });

  describe('refresh', () => {
    let provider: GiteaEntityProvider;
    let integration: GiteaIntegration;
    const mockConnection: EntityProviderConnection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };

    beforeEach(() => {
      // Need to access the provider internals for refresh tests
      integration = {
        config: {
          host: 'gitea.example.com',
          token: 'test-token',
        },
      } as unknown as GiteaIntegration;

      // Direct instantiation for testing the refresh method
      provider = new (GiteaEntityProvider as any)(
        {
          id: 'test-provider',
          host: 'gitea.example.com',
          organization: 'test-org',
          catalogPath: 'catalog-info.yaml',
          branch: 'main',
        },
        integration,
        logger,
        mockTaskRunner,
      );
    });

    it('should throw if not connected', async () => {
      await expect(provider.refresh(logger)).rejects.toThrow(
        'Gitea discovery connection not initialized',
      );
    });

    it('should handle API errors gracefully', async () => {
      await provider.connect(mockConnection);

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(provider.refresh(logger)).rejects.toThrow(
        'Failed to list Gitea projects for organization test-org',
      );
    });

    it('should handle empty results', async () => {
      await provider.connect(mockConnection);

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await provider.refresh(logger);

      expect(mockConnection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [],
      });
    });

    it('should handle pagination and filter repos with catalog files', async () => {
      await provider.connect(mockConnection);

      // Page 1 response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            name: 'repo1',
            html_url: 'https://gitea.example.com/test-org/repo1',
            empty: false,
          },
          {
            name: 'repo2',
            html_url: 'https://gitea.example.com/test-org/repo2',
            empty: false,
          },
          {
            name: 'empty-repo',
            html_url: 'https://gitea.example.com/test-org/empty-repo',
            empty: true,
          },
        ],
      });

      // Page 2 response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            name: 'repo3',
            html_url: 'https://gitea.example.com/test-org/repo3',
            empty: false,
          },
        ],
      });

      // Empty page 3 to terminate pagination
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      // Catalog check for repo1 - has catalog file
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      // Catalog check for repo2 - no catalog file
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      // Catalog check for repo3 - has catalog file
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await provider.refresh(logger);

      expect(mockConnection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [
          expect.objectContaining({
            locationKey: 'gitea-provider:test-provider',
            entity: expect.anything(),
          }),
          expect.objectContaining({
            locationKey: 'gitea-provider:test-provider',
            entity: expect.anything(),
          }),
        ],
      });

      // Verify we made requests for all repos
      expect(global.fetch).toHaveBeenCalledTimes(6);
    });

    it('should handle errors when applying mutations', async () => {
      await provider.connect(mockConnection);

      // Mock repository data
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            name: 'repo1',
            html_url: 'https://gitea.example.com/test-org/repo1',
            empty: false,
          },
        ],
      });

      // Empty page 2
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      // Catalog check - has catalog file
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      // Mock mutation failure
      (mockConnection.applyMutation as jest.Mock).mockRejectedValueOnce(
        new Error('Mutation failed'),
      );

      // Should not throw but log the error
      await provider.refresh(logger);

      expect(mockConnection.applyMutation).toHaveBeenCalled();
    });
  });
});
