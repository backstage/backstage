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
import { createExtensionInput } from '../wiring';
import { ApiBlueprint } from './ApiBlueprint';
import { createApiFactory, createApiRef } from '@backstage/core-plugin-api';

describe('ApiBlueprint', () => {
  it('should create an extension with sensible defaults', () => {
    const api = createApiRef<{ foo: string }>({ id: 'test' });
    const factory = createApiFactory({
      api,
      deps: {},
      factory: () => ({ foo: 'bar' }),
    });

    const extension = ApiBlueprint.make({
      params: {
        factory,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "app",
          "input": "apis",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "api",
        "name": undefined,
        "namespace": "test",
        "output": [
          [Function],
        ],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should create an extension with custom factory', () => {
    const api = createApiRef<{ foo: string }>({ id: 'test' });
    const factory = jest.fn(() => ({ foo: 'bar' }));

    const extension = ApiBlueprint.make({
      config: {
        schema: {
          test: z => z.string().default('test'),
        },
      },
      inputs: {
        test: createExtensionInput([ApiBlueprint.dataRefs.factory]),
      },
      namespace: api.id,
      factory(originalFactory, { config: _config, inputs: _inputs }) {
        return originalFactory({
          factory: createApiFactory({
            api,
            deps: {},
            factory,
          }),
        });
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "app",
          "input": "apis",
        },
        "configSchema": {
          "parse": [Function],
          "schema": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "additionalProperties": false,
            "properties": {
              "test": {
                "default": "test",
                "type": "string",
              },
            },
            "type": "object",
          },
        },
        "disabled": false,
        "factory": [Function],
        "inputs": {
          "test": {
            "$$type": "@backstage/ExtensionInput",
            "config": {
              "optional": false,
              "singleton": false,
            },
            "extensionData": [
              [Function],
            ],
          },
        },
        "kind": "api",
        "name": undefined,
        "namespace": "test",
        "output": [
          [Function],
        ],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });
});
