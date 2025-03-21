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
import { createExtension } from './createExtension';
import { createFrontendModule } from './createFrontendModule';

describe('createFrontendModule', () => {
  it('should create a frontend module', () => {
    expect(
      createFrontendModule({
        pluginId: 'test',
        extensions: [
          createExtension({
            kind: 'route',
            name: 'test',
            output: [],
            attachTo: { id: 'ignored', input: 'ignored' },
            factory: () => [],
          }),
        ],
      }),
    ).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/FrontendModule",
        "extensions": [
          {
            "$$type": "@backstage/Extension",
            "T": undefined,
            "attachTo": {
              "id": "ignored",
              "input": "ignored",
            },
            "configSchema": undefined,
            "disabled": false,
            "factory": [Function],
            "id": "route:test/test",
            "inputs": {},
            "output": [],
            "toString": [Function],
            "version": "v2",
          },
        ],
        "featureFlags": [],
        "pluginId": "test",
        "toString": [Function],
        "version": "v1",
      }
    `);
  });
});
