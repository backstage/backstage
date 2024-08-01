/*
 * Copyright 2023 The Backstage Authors
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

import { createExtension } from './createExtension';
import {
  createExtensionOverrides,
  toInternalExtensionOverrides,
} from './createExtensionOverrides';

describe('createExtensionOverrides', () => {
  it('should create overrides without extensions', () => {
    expect(createExtensionOverrides({ extensions: [] })).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionOverrides",
        "extensions": [],
        "featureFlags": [],
        "toString": [Function],
        "version": "v1",
      }
    `);
  });

  it('should create overrides with extensions', () => {
    expect(
      createExtensionOverrides({
        extensions: [
          createExtension({
            name: 'a',
            attachTo: { id: 'app', input: 'apis' },
            output: {},
            factory: () => ({}),
          }),
          createExtension({
            namespace: 'b',
            attachTo: { id: 'app', input: 'apis' },
            output: {},
            factory: () => ({}),
          }),
          createExtension({
            kind: 'k',
            namespace: 'c',
            name: 'n',
            attachTo: { id: 'app', input: 'apis' },
            output: {},
            factory: () => ({}),
          }),
        ],
      }),
    ).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionOverrides",
        "extensions": [
          {
            "$$type": "@backstage/Extension",
            "attachTo": {
              "id": "app",
              "input": "apis",
            },
            "configSchema": undefined,
            "disabled": false,
            "factory": [Function],
            "id": "a",
            "inputs": {},
            "output": {},
            "override": [Function],
            "toString": [Function],
            "version": "v1",
          },
          {
            "$$type": "@backstage/Extension",
            "attachTo": {
              "id": "app",
              "input": "apis",
            },
            "configSchema": undefined,
            "disabled": false,
            "factory": [Function],
            "id": "b",
            "inputs": {},
            "output": {},
            "override": [Function],
            "toString": [Function],
            "version": "v1",
          },
          {
            "$$type": "@backstage/Extension",
            "attachTo": {
              "id": "app",
              "input": "apis",
            },
            "configSchema": undefined,
            "disabled": false,
            "factory": [Function],
            "id": "k:c/n",
            "inputs": {},
            "output": {},
            "override": [Function],
            "toString": [Function],
            "version": "v1",
          },
        ],
        "featureFlags": [],
        "toString": [Function],
        "version": "v1",
      }
    `);
  });

  it('should convert to internal overrides', () => {
    const overrides = createExtensionOverrides({
      extensions: [
        createExtension({
          namespace: 'a',
          attachTo: { id: 'app', input: 'apis' },
          output: {},
          factory: () => ({}),
        }),
      ],
    });
    const internal = toInternalExtensionOverrides(overrides);
    expect(internal).toBe(overrides);
  });
});
