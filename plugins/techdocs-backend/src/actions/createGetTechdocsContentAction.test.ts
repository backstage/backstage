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
import { createGetTechdocsContentAction } from './createGetTechdocsContentAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { mockServices, mockCredentials } from '@backstage/backend-test-utils';

const originalFetch = global.fetch;
global.fetch = jest.fn();

describe('createGetTechdocsContentAction', () => {
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

  const createMockStreamResponse = (content: string) => {
    const encoded = new TextEncoder().encode(content);
    const mockReader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({ done: false, value: encoded })
        .mockResolvedValueOnce({ done: true, value: undefined }),
      releaseLock: jest.fn(),
    };
    return {
      ok: true,
      headers: new Headers(),
      body: {
        getReader: () => mockReader,
      },
    } as unknown as Response;
  };

  describe('HTML content retrieval', () => {
    it('should return content for a valid HTML file', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();
      const fileContent = '<html><body>Hello World</body></html>';

      mockFetch.mockResolvedValueOnce(createMockStreamResponse(fileContent));

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      const result = await mockActionsRegistry.invoke({
        id: 'test:get-techdocs-content',
        input: {
          kind: 'Component',
          namespace: 'default',
          name: 'test-component',
          path: 'index.html',
        },
        credentials: mockCredentials.service(),
      });

      expect(result.output).toEqual({
        content: fileContent,
        contentType: 'text/html',
        path: 'index.html',
      });
    });

    it('should use default values for kind, namespace, and path', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();
      const fileContent = '<html><body>Default Page</body></html>';

      mockFetch.mockResolvedValueOnce(createMockStreamResponse(fileContent));

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      const result = await mockActionsRegistry.invoke({
        id: 'test:get-techdocs-content',
        input: {
          name: 'test-component',
        },
        credentials: mockCredentials.service(),
      });

      expect(result.output).toEqual({
        content: fileContent,
        contentType: 'text/html',
        path: 'index.html',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/static/docs/default/Component/test-component/index.html',
        ),
        expect.any(Object),
      );
    });

    it('should handle nested HTML paths', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();
      const fileContent = '<html><body>Nested Page</body></html>';

      mockFetch.mockResolvedValueOnce(createMockStreamResponse(fileContent));

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      const result = await mockActionsRegistry.invoke({
        id: 'test:get-techdocs-content',
        input: {
          kind: 'Component',
          namespace: 'default',
          name: 'test-component',
          path: 'guide/getting-started/index.html',
        },
        credentials: mockCredentials.service(),
      });

      expect(result.output).toEqual({
        content: fileContent,
        contentType: 'text/html',
        path: 'guide/getting-started/index.html',
      });
    });
  });

  describe('HTML-only restriction', () => {
    it('should reject non-HTML files (images)', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: 'assets/image.png',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/Only HTML files are supported/);
    });

    it('should reject CSS files', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: 'assets/styles.css',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/Only HTML files are supported/);
    });

    it('should reject JavaScript files', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: 'assets/script.js',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/Only HTML files are supported/);
    });

    it('should reject PDF files', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: 'docs/manual.pdf',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/Only HTML files are supported/);
    });
  });

  describe('path sanitization', () => {
    it('should reject paths with directory traversal (..)', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: '../../../etc/passwd.html',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/Invalid path/);
    });

    it('should reject absolute paths', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: '/etc/passwd.html',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/Invalid path/);
    });
  });

  describe('API error handling', () => {
    it('should throw error when API returns 404', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: { message: 'File not found' } }),
      } as Response);

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: 'nonexistent.html',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow();
    });

    it('should throw error when API returns 403 (permission denied)', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: { message: 'Access denied' } }),
      } as Response);

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'restricted-component',
            path: 'index.html',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow();
    });
  });

  describe('memory optimization', () => {
    it('should reject content exceeding size limit via Content-Length header', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-length': '15000000' }),
        body: null,
      } as unknown as Response);

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: 'index.html',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/Content too large/);
    });

    it('should reject content exceeding size limit during streaming', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      const largeChunk = new Uint8Array(11 * 1024 * 1024);
      const mockReader = {
        read: jest
          .fn()
          .mockResolvedValueOnce({ done: false, value: largeChunk })
          .mockResolvedValueOnce({ done: true, value: undefined }),
        releaseLock: jest.fn(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        body: {
          getReader: () => mockReader,
        },
      } as unknown as Response);

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: 'index.html',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/Content too large/);
    });

    it('should handle timeout for slow responses', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';

      mockFetch.mockImplementationOnce(() => {
        return Promise.reject(abortError);
      });

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: 'index.html',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/aborted/);
    });

    it('should handle response body not readable', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        body: null,
      } as unknown as Response);

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:get-techdocs-content',
          input: {
            kind: 'Component',
            namespace: 'default',
            name: 'test-component',
            path: 'index.html',
          },
          credentials: mockCredentials.service(),
        }),
      ).rejects.toThrow(/not readable/);
    });

    it('should successfully stream content within size limits', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();

      const chunk1 = new TextEncoder().encode('<html><body>');
      const chunk2 = new TextEncoder().encode('Hello World');
      const chunk3 = new TextEncoder().encode('</body></html>');

      const mockReader = {
        read: jest
          .fn()
          .mockResolvedValueOnce({ done: false, value: chunk1 })
          .mockResolvedValueOnce({ done: false, value: chunk2 })
          .mockResolvedValueOnce({ done: false, value: chunk3 })
          .mockResolvedValueOnce({ done: true, value: undefined }),
        releaseLock: jest.fn(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers(),
        body: {
          getReader: () => mockReader,
        },
      } as unknown as Response);

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      const result = await mockActionsRegistry.invoke({
        id: 'test:get-techdocs-content',
        input: {
          kind: 'Component',
          namespace: 'default',
          name: 'test-component',
          path: 'index.html',
        },
        credentials: mockCredentials.service(),
      });

      expect(result.output).toEqual({
        content: '<html><body>Hello World</body></html>',
        contentType: 'text/html',
        path: 'index.html',
      });
      expect(mockReader.releaseLock).toHaveBeenCalled();
    });
  });

  describe('different entity kinds', () => {
    it('should handle API entity kind', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const { auth, discovery } = createMockServices();
      const fileContent = '<html><body>API Docs</body></html>';

      mockFetch.mockResolvedValueOnce(createMockStreamResponse(fileContent));

      createGetTechdocsContentAction({
        actionsRegistry: mockActionsRegistry,
        auth,
        discovery,
      });

      await mockActionsRegistry.invoke({
        id: 'test:get-techdocs-content',
        input: {
          kind: 'API',
          namespace: 'production',
          name: 'my-api',
          path: 'index.html',
        },
        credentials: mockCredentials.service(),
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/static/docs/production/API/my-api/index.html',
        ),
        expect.any(Object),
      );
    });
  });
});
