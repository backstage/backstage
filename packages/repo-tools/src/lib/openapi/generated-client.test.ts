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

import { createMockDirectory } from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import Mustache from 'mustache';
import http from 'node:http';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const methods = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'TRACE',
];

type GeneratedClient = Record<
  string,
  (
    request: { body?: { name: string } },
    options?: { token?: string; signal?: AbortSignal },
  ) => Promise<Response>
>;

type ClientOptions = {
  discoveryApi: { getBaseUrl(pluginId: string): Promise<string> };
  fetchApi?: { fetch: typeof fetch };
};

function generateClient() {
  const template = fs.readFileSync(
    path.resolve(
      __dirname,
      '../../../templates/typescript-backstage-client/apis/api-all.mustache',
    ),
    'utf8',
  );
  const source = Mustache.render(template, {
    apiInfo: {
      apis: [
        {
          operations: {
            operation: methods.map(method => ({
              nickname: `${method.toLowerCase()}Resource`,
              path: `/${method.toLowerCase()}`,
              httpMethod: method,
              hasBodyParam: ['POST', 'PUT', 'PATCH'].includes(method),
              bodyParam: { dataType: '{ name: string }' },
            })),
          },
        },
      ],
    },
    lambda: {
      pascalcase: () => (text: string, render: (value: string) => string) => {
        const value = render(text);
        return value[0].toUpperCase() + value.slice(1);
      },
    },
  });
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const exports: {
    DefaultApiClient?: new (options: ClientOptions) => GeneratedClient;
  } = {};
  runInNewContext(compiled.outputText, {
    exports,
    require: (id: string) => {
      switch (id) {
        case 'cross-fetch':
          return { default: fetch };
        case '../pluginId':
          return { pluginId: 'test-api' };
        case 'uri-template':
          return { parse: (uri: string) => ({ expand: () => uri }) };
        default:
          throw new Error(`Unexpected generated import: ${id}`);
      }
    },
  });
  if (!exports.DefaultApiClient) {
    throw new Error('The template did not generate a client');
  }
  return { Client: exports.DefaultApiClient, source };
}

describe('generated OpenAPI client requests', () => {
  const { Client, source } = generateClient();
  const directory = createMockDirectory();

  it('forwards a separate signal and token on every generated method', async () => {
    directory.addContent({
      'apis/Api.client.ts': source,
      'types/discovery.ts': `export interface DiscoveryApi {
        getBaseUrl(pluginId: string): Promise<string>;
      }`,
      'types/fetch.ts': `export interface FetchApi { fetch: typeof fetch; }`,
      'pluginId.ts': `export const pluginId = 'test-api';`,
      'external.d.ts': `
        declare module 'cross-fetch' {
          const crossFetch: typeof fetch;
          export default crossFetch;
        }
        declare module 'uri-template' {
          export function parse(uri: string): {
            expand(parameters: Record<string, unknown>): string;
          };
        }
      `,
    });
    const program = ts.createProgram(
      [
        path.join(directory.path, 'apis/Api.client.ts'),
        path.join(directory.path, 'external.d.ts'),
      ],
      {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        strict: true,
        noEmit: true,
        types: [],
      },
    );
    expect(
      ts
        .getPreEmitDiagnostics(program)
        .map(diagnostic =>
          ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
        ),
    ).toEqual([]);
    const fetch = jest.fn(
      async (..._args: Parameters<typeof globalThis.fetch>) => new Response(),
    );
    const client = new Client({
      discoveryApi: { getBaseUrl: async () => 'https://example.com' },
      fetchApi: { fetch },
    });

    for (const method of methods) {
      const controller = new AbortController();
      await client[`${method.toLowerCase()}Resource`](
        { body: { name: 'example' } },
        { token: `token-${method}`, signal: controller.signal },
      );

      expect(fetch).toHaveBeenLastCalledWith(
        `https://example.com/${method.toLowerCase()}`,
        expect.objectContaining({
          method,
          signal: controller.signal,
          headers: expect.objectContaining({
            Authorization: `Bearer token-${method}`,
          }),
        }),
      );
      expect(fetch.mock.calls.at(-1)?.[1]?.signal).toBe(controller.signal);
      expect(fetch.mock.calls.at(-1)?.[1]?.body).toBe(
        ['POST', 'PUT', 'PATCH'].includes(method)
          ? JSON.stringify({ name: 'example' })
          : undefined,
      );
    }
  });

  it('continues to allow omitted options and token-only options', async () => {
    const fetch = jest.fn(
      async (..._args: Parameters<typeof globalThis.fetch>) => new Response(),
    );
    const client = new Client({
      discoveryApi: { getBaseUrl: async () => 'https://example.com' },
      fetchApi: { fetch },
    });

    await client.getResource({});
    await client.getResource({}, { token: 'example' });

    expect(fetch.mock.calls[0][1]?.signal).toBeUndefined();
    expect(fetch.mock.calls[1][1]?.signal).toBeUndefined();
    expect(fetch.mock.calls[1][1]?.headers).toEqual(
      expect.objectContaining({ Authorization: 'Bearer example' }),
    );
  });

  it('cancels one HTTP request while other calls on the same client succeed', async () => {
    let received!: () => void;
    const started = new Promise<void>(resolve => {
      received = resolve;
    });
    const server = http.createServer((req, res) => {
      if (req.headers.authorization === 'Bearer cancel-me') {
        received();
        return;
      }
      res.end('{}');
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Expected an HTTP listener');
    }
    const client = new Client({
      discoveryApi: {
        getBaseUrl: async () => `http://127.0.0.1:${address.port}`,
      },
      fetchApi: { fetch },
    });
    const controller = new AbortController();

    try {
      const pending = client.getResource(
        {},
        { token: 'cancel-me', signal: controller.signal },
      );
      await started;
      const healthy = await client.getResource({}, { token: 'other-user' });
      expect(healthy.ok).toBe(true);
      await healthy.text();
      controller.abort();
      await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
      const afterCancellation = await client.getResource({});
      expect(afterCancellation.ok).toBe(true);
      await afterCancellation.text();
    } finally {
      controller.abort();
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
  });
});
