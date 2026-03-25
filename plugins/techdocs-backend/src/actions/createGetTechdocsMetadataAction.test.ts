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
import { createGetTechdocsMetadataAction } from './createGetTechdocsMetadataAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { mockServices, mockCredentials } from '@backstage/backend-test-utils';

const originalFetch = global.fetch;
global.fetch = jest.fn();

describe('createGetTechdocsMetadataAction', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  const createMockServices = () => {
    const auth = mockServices.auth();
    const discovery = mockServices.discovery();
    return { auth, discovery };
  };

  it('should return metadata for a valid entity', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const { auth, discovery } = createMockServices();
    const mockMetadata = {
      site_name: 'Test Component Docs',
      site_description: 'Documentation for test component',
      etag: 'abc123',
      build_timestamp: 1234567890,
      files: ['index.html', 'guide.html', 'image.png'],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers(),
      text: async () => JSON.stringify(mockMetadata),
    } as unknown as Response);

    createGetTechdocsMetadataAction({
      actionsRegistry: mockActionsRegistry,
      auth,
      discovery,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-techdocs-metadata',
      input: {
        kind: 'Component',
        namespace: 'default',
        name: 'test-component',
      },
      credentials: mockCredentials.service(),
    });

    // Files should be returned as-is without filtering
    expect(result.output).toEqual(mockMetadata);
  });

  it('should use default values for kind and namespace', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const { auth, discovery } = createMockServices();
    const mockMetadata = {
      site_name: 'Test Docs',
      site_description: 'Test',
      etag: 'abc',
      build_timestamp: 123,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers(),
      text: async () => JSON.stringify(mockMetadata),
    } as unknown as Response);

    createGetTechdocsMetadataAction({
      actionsRegistry: mockActionsRegistry,
      auth,
      discovery,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-techdocs-metadata',
      input: {
        name: 'test-component',
      },
      credentials: mockCredentials.service(),
    });

    expect(result.output).toEqual(mockMetadata);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(
        '/metadata/techdocs/default/Component/test-component',
      ),
      expect.any(Object),
    );
  });

  it('should throw NotFoundError when metadata is empty', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const { auth, discovery } = createMockServices();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers(),
      text: async () => JSON.stringify({}),
    } as unknown as Response);

    createGetTechdocsMetadataAction({
      actionsRegistry: mockActionsRegistry,
      auth,
      discovery,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:get-techdocs-metadata',
        input: {
          kind: 'Component',
          namespace: 'default',
          name: 'nonexistent-component',
        },
        credentials: mockCredentials.service(),
      }),
    ).rejects.toThrow(/No TechDocs metadata found for entity/);
  });

  it('should throw NotFoundError when metadata is null', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const { auth, discovery } = createMockServices();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers(),
      text: async () => JSON.stringify(null),
    } as unknown as Response);

    createGetTechdocsMetadataAction({
      actionsRegistry: mockActionsRegistry,
      auth,
      discovery,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:get-techdocs-metadata',
        input: {
          kind: 'Component',
          namespace: 'default',
          name: 'nonexistent-component',
        },
        credentials: mockCredentials.service(),
      }),
    ).rejects.toThrow(/No TechDocs metadata found for entity/);
  });

  it('should throw error when API returns non-ok response', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const { auth, discovery } = createMockServices();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ error: { message: 'Entity not found' } }),
    } as Response);

    createGetTechdocsMetadataAction({
      actionsRegistry: mockActionsRegistry,
      auth,
      discovery,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:get-techdocs-metadata',
        input: {
          kind: 'Component',
          namespace: 'default',
          name: 'missing-component',
        },
        credentials: mockCredentials.service(),
      }),
    ).rejects.toThrow();
  });

  it('should handle different entity kinds', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const { auth, discovery } = createMockServices();
    const mockMetadata = {
      site_name: 'API Docs',
      site_description: 'API documentation',
      etag: 'xyz',
      build_timestamp: 456,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers(),
      text: async () => JSON.stringify(mockMetadata),
    } as unknown as Response);

    createGetTechdocsMetadataAction({
      actionsRegistry: mockActionsRegistry,
      auth,
      discovery,
    });

    await mockActionsRegistry.invoke({
      id: 'test:get-techdocs-metadata',
      input: {
        kind: 'API',
        namespace: 'production',
        name: 'my-api',
      },
      credentials: mockCredentials.service(),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/metadata/techdocs/production/API/my-api'),
      expect.any(Object),
    );
  });

  it('should return all files without filtering', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const { auth, discovery } = createMockServices();
    const mockMetadata = {
      site_name: 'Test Docs',
      site_description: 'Test',
      etag: 'abc',
      build_timestamp: 123,
      files: [
        'index.html',
        'guide/setup.html',
        'assets/image.png',
        'assets/style.css',
        'api/reference.html',
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers(),
      text: async () => JSON.stringify(mockMetadata),
    } as unknown as Response);

    createGetTechdocsMetadataAction({
      actionsRegistry: mockActionsRegistry,
      auth,
      discovery,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-techdocs-metadata',
      input: {
        name: 'test-component',
      },
      credentials: mockCredentials.service(),
    });

    // Files should be returned as-is without filtering
    expect((result.output as Record<string, unknown>).files).toEqual([
      'index.html',
      'guide/setup.html',
      'assets/image.png',
      'assets/style.css',
      'api/reference.html',
    ]);
  });

  it('should filter pages to only include text-based extensions', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const { auth, discovery } = createMockServices();
    const mockMetadata = {
      site_name: 'Test Docs',
      site_description: 'Test',
      etag: 'abc',
      build_timestamp: 123,
      pages: {
        'index.html': { title: 'Home' },
        'guide.md': { title: 'Guide' },
        'data.json': { title: 'Data' },
        'config.yaml': { title: 'Config' },
        'image.png': { title: 'Image' },
        'style.css': { title: 'Style' },
        'script.js': { title: 'Script' },
        'doc.pdf': { title: 'PDF' },
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers(),
      text: async () => JSON.stringify(mockMetadata),
    } as unknown as Response);

    createGetTechdocsMetadataAction({
      actionsRegistry: mockActionsRegistry,
      auth,
      discovery,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-techdocs-metadata',
      input: {
        name: 'test-component',
      },
      credentials: mockCredentials.service(),
    });

    // Only text-based extensions should be returned
    expect((result.output as Record<string, unknown>).pages).toEqual({
      'index.html': { title: 'Home' },
      'guide.md': { title: 'Guide' },
      'data.json': { title: 'Data' },
      'config.yaml': { title: 'Config' },
    });
  });

  describe('memory optimization', () => {
    it('should reject metadata exceeding size limit via Content-Length header', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-length': '6000000' }),
        text: async () => '{}',
      } as unknown as Response);

      createGetTechdocsMetadataAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-metadata',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/Metadata too large/);
    });

    it('should reject metadata exceeding size limit after reading text', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      const largeText = 'x'.repeat(6 * 1024 * 1024);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        text: async () => largeText,
      } as unknown as Response);

      createGetTechdocsMetadataAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-metadata',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/Metadata too large/);
    });

    it('should handle timeout for slow responses', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';

      mockFetch.mockImplementationOnce(() => {
        return Promise.reject(abortError);
      });

      createGetTechdocsMetadataAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-metadata',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/aborted/);
    });

    it('should successfully process metadata within size limits', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();
      const mockMetadata = {
        site_name: 'Test Docs',
        site_description: 'Test description',
        etag: 'abc123',
        build_timestamp: 1234567890,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-length': '100' }),
        text: async () => JSON.stringify(mockMetadata),
      } as unknown as Response);

      createGetTechdocsMetadataAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      const result = await mockActionsRegistry.invoke({
        id: 'test:get-techdocs-metadata',
        input: {
          kind: 'Component',
          namespace: 'default',
          name: 'test-component',
        },
        credentials: mockCredentials.service(),
      });

      expect(result.output).toEqual(mockMetadata);
    });
  });

  it('should handle metadata without files property', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const { auth, discovery } = createMockServices();
    const mockMetadata = {
      site_name: 'Test Docs',
      site_description: 'Test',
      etag: 'abc',
      build_timestamp: 123,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers(),
      text: async () => JSON.stringify(mockMetadata),
    } as unknown as Response);

    createGetTechdocsMetadataAction({
      actionsRegistry: mockActionsRegistry,
      auth,
      discovery,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-techdocs-metadata',
      input: {
        name: 'test-component',
      },
      credentials: mockCredentials.service(),
    });

    expect((result.output as Record<string, unknown>).files).toBeUndefined();
  });
});
