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
import { GoldenPathsClient } from './api';
import {
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';

describe('GoldenPathsClient', () => {
  let discoveryApi: jest.Mocked<DiscoveryApi>;
  let identityApi: jest.Mocked<IdentityApi>;
  let fetchApi: jest.Mocked<FetchApi>;
  let client: GoldenPathsClient;

  /**
   * Helper function to create a mock Response object
   */
  const createMockResponse = <T>(
    data: T,
    options?: Partial<Response>,
  ): Response => {
    return {
      json: jest.fn().mockResolvedValue(data),
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      redirected: false,
      type: 'basic' as ResponseType,
      url: 'http://backstage/api/golden-paths',
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      ...options,
    } as unknown as Response;
  };

  beforeEach(() => {
    discoveryApi = {
      getBaseUrl: jest
        .fn()
        .mockResolvedValue('http://backstage/api/golden-paths'),
    } as jest.Mocked<DiscoveryApi>;

    identityApi = {
      getIdToken: jest.fn(),
      getBackstageIdentity: jest.fn(),
      getCredentials: jest.fn(),
      signOut: jest.fn(),
      getProfileInfo: jest.fn(),
    } as jest.Mocked<IdentityApi>;

    fetchApi = {
      fetch: jest.fn(),
    } as jest.Mocked<FetchApi>;

    client = new GoldenPathsClient({
      discoveryApi,
      identityApi,
      fetchApi,
    });
  });

  // Basic test to ensure the client initializes correctly
  it('should initialize correctly', () => {
    expect(client).toBeDefined();
  });

  describe('getTemplateOutputs', () => {
    it('should fetch template outputs for a given task ID', async () => {
      const taskId = 'test-task-id';
      const mockOutputs = {
        someTemplate: {
          output1: 'value1',
          output2: { nested: 'value' },
        },
        anotherTemplate: {
          output3: 'value3',
        },
      };

      fetchApi.fetch.mockResolvedValueOnce(createMockResponse(mockOutputs));

      const result = await client.getTemplateOutputs(taskId);

      // Verify the correct URL was called
      expect(fetchApi.fetch).toHaveBeenCalledWith(
        'http://backstage/api/golden-paths/tasks/test-task-id/outputs',
      );

      // Verify the returned data matches our mock
      expect(result).toEqual(mockOutputs);
    });

    it('should throw an error when the request fails', async () => {
      const taskId = 'test-task-id';
      const errorResponse = createMockResponse(
        { error: 'Not found' },
        {
          ok: false,
          status: 404,
          statusText: 'Not Found',
        },
      );

      // Mock the fetch call to return a failed response
      fetchApi.fetch.mockResolvedValueOnce(errorResponse);

      // Mock ResponseError.fromResponse to throw a standard error
      // This avoids the complexity of creating a ResponseError instance
      const mockError = new Error('Not found');
      jest
        .spyOn(ResponseError, 'fromResponse')
        .mockRejectedValueOnce(mockError);

      // Test that the method correctly propagates the error
      await expect(client.getTemplateOutputs(taskId)).rejects.toThrow(
        'Not found',
      );

      // Verify the correct URL was called
      expect(fetchApi.fetch).toHaveBeenCalledWith(
        'http://backstage/api/golden-paths/tasks/test-task-id/outputs',
      );
    });

    it('should handle complex nested output structures', async () => {
      const taskId = 'test-task-id';
      const complexOutputs = {
        templateA: {
          repoUrl: 'https://github.com/org/repo',
          metadata: {
            owner: 'team-x',
            priority: 1,
            tags: ['frontend', 'react'],
          },
          components: [
            { name: 'comp1', version: '1.0.0' },
            { name: 'comp2', version: '2.0.0' },
          ],
        },
        templateB: {
          serviceUrl: 'https://api.example.com',
          credentials: {
            clientId: 'client-123',
            scopes: ['read', 'write'],
          },
        },
      };

      fetchApi.fetch.mockResolvedValueOnce(createMockResponse(complexOutputs));

      const result = await client.getTemplateOutputs(taskId);

      // Verify the correct URL was called
      expect(fetchApi.fetch).toHaveBeenCalledWith(
        'http://backstage/api/golden-paths/tasks/test-task-id/outputs',
      );

      // Verify the returned data matches our complex mock structure
      expect(result).toEqual(complexOutputs);
      expect(result.templateA.repoUrl).toBe('https://github.com/org/repo');
      expect(result.templateA.metadata.tags).toContain('react');
      expect(result.templateA.components).toHaveLength(2);
      expect(result.templateB.credentials.scopes).toContain('write');
    });

    it('should properly encode task IDs with special characters', async () => {
      // Task ID with characters that need URL encoding
      const taskId = 'task/with special+characters?';
      const encodedTaskId = encodeURIComponent(taskId);
      const outputs = { result: 'success' };

      fetchApi.fetch.mockResolvedValueOnce(createMockResponse(outputs));

      await client.getTemplateOutputs(taskId);

      // Verify the URL was properly encoded
      expect(fetchApi.fetch).toHaveBeenCalledWith(
        `http://backstage/api/golden-paths/tasks/${encodedTaskId}/outputs`,
      );

      // Double-check the actual encoded URL
      expect(fetchApi.fetch).toHaveBeenCalledWith(
        'http://backstage/api/golden-paths/tasks/task%2Fwith%20special%2Bcharacters%3F/outputs',
      );
    });

    it('should enable parameter passing between templates', async () => {
      // This test simulates a workflow where outputs from one template are used as inputs for another
      const taskId = 'multi-step-task';

      // Mock the outputs from a first template with data that would be used in a subsequent step
      const mockOutputs = {
        scaffoldService: {
          serviceUrl: 'https://example.com/api',
          repoUrl: 'https://github.com/org/repo',
          servicePort: 8080,
          namespace: 'dev',
        },
      };

      fetchApi.fetch.mockResolvedValueOnce(createMockResponse(mockOutputs));

      const outputs = await client.getTemplateOutputs(taskId);

      // Verify correct API call
      expect(fetchApi.fetch).toHaveBeenCalledWith(
        'http://backstage/api/golden-paths/tasks/multi-step-task/outputs',
      );

      // Verify we can extract values from the output that would be used in a subsequent template
      expect(outputs.scaffoldService.repoUrl).toBe(
        'https://github.com/org/repo',
      );

      // Simulate using these outputs in a subsequent createTemplate call
      const createTemplateMock = jest
        .spyOn(client, 'createTemplate')
        .mockResolvedValueOnce();

      // Mock values that would be derived from the previous step's outputs
      const templateValues = {
        repoUrl: outputs.scaffoldService.repoUrl,
        port: outputs.scaffoldService.servicePort,
        namespace: outputs.scaffoldService.namespace,
      };

      await client.createTemplate({
        taskId,
        templateId: 'deployService',
        templateRef: 'template:default/deploy',
        values: templateValues,
        secrets: {},
      });

      // Verify the createTemplate was called with values derived from getTemplateOutputs
      expect(createTemplateMock).toHaveBeenCalledWith({
        taskId,
        templateId: 'deployService',
        templateRef: 'template:default/deploy',
        values: {
          repoUrl: 'https://github.com/org/repo',
          port: 8080,
          namespace: 'dev',
        },
        secrets: {},
      });
    });
  });
});
