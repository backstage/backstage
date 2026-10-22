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
import { readGeneratedOpenApiSpec } from './readGeneratedSpec';

describe('readGeneratedOpenApiSpec', () => {
  const mockDir = createMockDirectory();

  it('reads the spec export without loading the file', async () => {
    mockDir.setContent({
      'router.ts': `
import { createValidatedOpenApiRouterFromGeneratedEndpointMap } from '@backstage/backend-openapi-utils';
import { EndpointMap } from './apis';

export const spec = {
  openapi: '3.1.0',
  info: { title: 'test', version: "1", 'x-tag': \`plain\` },
  paths: {
    '/things/{id}': {
      get: {
        parameters: [{ name: 'id', in: 'path', required: true }],
        responses: { 200: { description: 'ok' } },
      },
    },
  },
  'x-numbers': [0, 1.5, -2, 1e3],
  'x-flags': [true, false, null],
  '__proto__': { polluted: true },
} as const;
export const createOpenApiRouter = async (
  options?: Parameters<typeof createValidatedOpenApiRouterFromGeneratedEndpointMap>['1'],
) => createValidatedOpenApiRouterFromGeneratedEndpointMap<EndpointMap>(spec, options);
`,
    });

    const spec = (await readGeneratedOpenApiSpec(
      mockDir.resolve('router.ts'),
    )) as Record<string, unknown>;

    expect(spec).toEqual({
      openapi: '3.1.0',
      info: { title: 'test', version: '1', 'x-tag': 'plain' },
      paths: {
        '/things/{id}': {
          get: {
            parameters: [{ name: 'id', in: 'path', required: true }],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
      'x-numbers': [0, 1.5, -2, 1000],
      'x-flags': [true, false, null],
      ['__proto__']: { polluted: true },
    });
    expect(Object.getPrototypeOf(spec)).toBe(Object.prototype);
    expect(Object.keys(spec)).toContain('__proto__');
  });

  it('follows local exports and references to other constants', async () => {
    mockDir.setContent({
      'named.ts': `const info = { title: 'test' } as const;\nconst spec = { openapi: '3.0.3', info, copy: info };\nexport { spec };\n`,
      'aliased.ts': `const document = { openapi: '3.0.3' };\nexport { document as spec };\n`,
    });

    await expect(
      readGeneratedOpenApiSpec(mockDir.resolve('named.ts')),
    ).resolves.toEqual({
      openapi: '3.0.3',
      info: { title: 'test' },
      copy: { title: 'test' },
    });
    await expect(
      readGeneratedOpenApiSpec(mockDir.resolve('aliased.ts')),
    ).resolves.toEqual({ openapi: '3.0.3' });
  });

  it('returns undefined without a spec export and rejects non-literal values', async () => {
    mockDir.setContent({
      'empty.ts': `const spec = { openapi: '3.0.3' };\nexport const other = 1;\n`,
      'computed.ts': `const base = {};\nexport const spec = {\n  ...base,\n};\n`,
      'unknown.ts': `export const spec = {\n  info: getInfo(),\n};\n`,
      'cyclic.ts': `const a = { b };\nconst b = { a };\nexport const spec = a;\n`,
    });

    await expect(
      readGeneratedOpenApiSpec(mockDir.resolve('empty.ts')),
    ).resolves.toBeUndefined();
    await expect(
      readGeneratedOpenApiSpec(mockDir.resolve('unknown.ts')),
    ).rejects.toThrow(`${mockDir.resolve('unknown.ts')}:2`);
    await expect(
      readGeneratedOpenApiSpec(mockDir.resolve('cyclic.ts')),
    ).rejects.toThrow(`${mockDir.resolve('cyclic.ts')}:2`);
    await expect(
      readGeneratedOpenApiSpec(mockDir.resolve('computed.ts')),
    ).rejects.toThrow(
      `Unsupported syntax in the 'spec' export at ${mockDir.resolve(
        'computed.ts',
      )}:3, only plain JSON values are supported`,
    );
  });
});
