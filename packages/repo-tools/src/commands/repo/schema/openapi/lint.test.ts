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

import {
  Document,
  Ruleset,
  RulesetDefinition,
  Spectral,
} from '@stoplight/spectral-core';
import { Yaml } from '@stoplight/spectral-parsers';
import { allowReservedRule } from './lint';

function lintSpec(spec: string) {
  const spectral = new Spectral();
  spectral.setRuleset(
    new Ruleset({
      rules: {
        'allow-reserved-in-query-params': allowReservedRule,
      },
    } as RulesetDefinition),
  );
  return spectral.run(new Document(spec, Yaml, 'openapi.yaml'));
}

function makeInlineSpec(allowReservedLine: string) {
  return `openapi: 3.0.3
info:
  title: Test API
  version: 1.0.0
paths:
  /items:
    get:
      operationId: listItems
      parameters:
        - name: filter
          in: query
          required: false
          ${allowReservedLine}
          schema:
            type: string
      responses:
        '200':
          description: OK
`;
}

function makeRefSpec(allowReservedLine: string) {
  return `openapi: 3.0.3
info:
  title: Test API
  version: 1.0.0
paths:
  /items:
    get:
      operationId: listItems
      parameters:
        - $ref: '#/components/parameters/FilterParam'
      responses:
        '200':
          description: OK
components:
  parameters:
    FilterParam:
      name: filter
      in: query
      required: false
      ${allowReservedLine}
      schema:
        type: string
`;
}

describe('allow-reserved-in-query-params', () => {
  it('allows allowReserved: true on query parameters', async () => {
    await expect(
      lintSpec(makeInlineSpec('allowReserved: true')),
    ).resolves.toEqual([]);
  });

  it('rejects allowReserved: false on query parameters', async () => {
    const results = await lintSpec(makeInlineSpec('allowReserved: false'));
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      code: 'allow-reserved-in-query-params',
      message: 'Query parameters must set allowReserved: true',
    });
  });

  it('rejects query parameters without allowReserved', async () => {
    const results = await lintSpec(makeInlineSpec(''));
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      code: 'allow-reserved-in-query-params',
      message: 'Query parameters must set allowReserved: true',
    });
  });

  it('checks shared parameters referenced from components.parameters', async () => {
    await expect(lintSpec(makeRefSpec('allowReserved: true'))).resolves.toEqual(
      [],
    );

    const results = await lintSpec(makeRefSpec('allowReserved: false'));
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      code: 'allow-reserved-in-query-params',
      message: 'Query parameters must set allowReserved: true',
    });
  });
});
