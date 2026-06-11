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

import { ExtensionPredicateContextProviderBlueprint } from './ExtensionPredicateContextProviderBlueprint';

describe('ExtensionPredicateContextProviderBlueprint', () => {
  it('should create an async extension with a loader', () => {
    const extension = ExtensionPredicateContextProviderBlueprint.make({
      name: 'test-async',
      params: {
        loader: async () => ['value-a', 'value-b'],
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "root",
          "input": "predicateContextProviders",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "if": undefined,
        "inputs": {},
        "kind": "extension-predicate-context-provider",
        "name": "test-async",
        "output": [
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "core.extension-predicate-context-provider.resolver",
            "optional": [Function],
            "toString": [Function],
          },
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "core.extension-predicate-context-provider.loader",
            "optional": [Function],
            "toString": [Function],
          },
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should create a sync extension with a resolver', () => {
    const extension = ExtensionPredicateContextProviderBlueprint.make({
      name: 'test-sync',
      params: {
        resolver: () => ['value-a', 'value-b'],
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "root",
          "input": "predicateContextProviders",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "if": undefined,
        "inputs": {},
        "kind": "extension-predicate-context-provider",
        "name": "test-sync",
        "output": [
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "core.extension-predicate-context-provider.resolver",
            "optional": [Function],
            "toString": [Function],
          },
          {
            "$$type": "@backstage/ExtensionDataRef",
            "config": {
              "optional": true,
            },
            "id": "core.extension-predicate-context-provider.loader",
            "optional": [Function],
            "toString": [Function],
          },
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should expose both data refs', () => {
    expect(
      ExtensionPredicateContextProviderBlueprint.dataRefs.loader,
    ).toBeDefined();
    expect(
      ExtensionPredicateContextProviderBlueprint.dataRefs.resolver,
    ).toBeDefined();
  });
});
