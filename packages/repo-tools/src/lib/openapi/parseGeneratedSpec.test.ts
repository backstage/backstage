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

import { parseGeneratedOpenApiSpec } from './parseGeneratedSpec';

describe('parseGeneratedOpenApiSpec', () => {
  it('reads the spec export without loading the file', () => {
    const source = `
import { createValidatedOpenApiRouterFromGeneratedEndpointMap } from '@backstage/backend-openapi-utils';
import { EndpointMap } from './apis';

export const spec = {
  openapi: '3.1.0',
  info: { title: 'test', "version": "1" },
  responses: { 200: { description: 'ok' } },
  'x-numbers': [0, 1.5, -2, 1e3],
  'x-flags': [true, false, null],
} as const;
export const createOpenApiRouter = async (
  options?: Parameters<typeof createValidatedOpenApiRouterFromGeneratedEndpointMap>['1'],
) => createValidatedOpenApiRouterFromGeneratedEndpointMap<EndpointMap>(spec, options);
`;

    expect(parseGeneratedOpenApiSpec(source)).toEqual({
      openapi: '3.1.0',
      info: { title: 'test', version: '1' },
      responses: { '200': { description: 'ok' } },
      'x-numbers': [0, 1.5, -2, 1000],
      'x-flags': [true, false, null],
    });
  });

  it('returns undefined without a spec export and rejects anything else', () => {
    expect(
      parseGeneratedOpenApiSpec(`const spec = {};\nexport const other = 1;\n`),
    ).toBeUndefined();
    expect(
      parseGeneratedOpenApiSpec(`export let spec = {};\n`),
    ).toBeUndefined();
    expect(() =>
      parseGeneratedOpenApiSpec(`export const spec = {\n  ...base,\n};\n`),
    ).toThrow(
      "Unsupported syntax in the 'spec' export on line 2, only plain JSON values are supported",
    );
    expect(() =>
      parseGeneratedOpenApiSpec(`export const spec = {\n  a: getA(),\n};\n`),
    ).toThrow("'spec' export on line 2,");
    expect(() =>
      parseGeneratedOpenApiSpec(
        `export const spec = {\n<<<<<<< HEAD\n  a: 1,\n=======\n  a: 2,\n>>>>>>> branch\n};\n`,
      ),
    ).toThrow('Syntax error: Merge conflict marker');
  });
});
