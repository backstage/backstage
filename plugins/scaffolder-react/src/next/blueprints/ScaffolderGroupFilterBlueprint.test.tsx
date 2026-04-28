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
import {
  ScaffolderGroupFilterBlueprint,
  scaffolderGroupFilterDataRef,
} from './ScaffolderGroupFilterBlueprint';
import { createExtensionTester } from '@backstage/frontend-test-utils';

describe('ScaffolderGroupFilterBlueprint', () => {
  it('should create an extension with sane defaults', () => {
    const extension = ScaffolderGroupFilterBlueprint.make({
      params: {
        group: {
          title: 'Test Group',
          filter: () => true,
        },
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "sub-page:scaffolder/templates",
          "input": "groups",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "if": undefined,
        "inputs": {},
        "kind": "scaffolder-filter",
        "name": undefined,
        "output": [
          [Function],
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should return the provided TemplateGroupFilter via dataRef', () => {
    const group = {
      title: 'Test Group',
      filter: () => true,
    };

    const extension = ScaffolderGroupFilterBlueprint.make({
      params: { group },
    });

    const tester = createExtensionTester(extension);

    const result = tester.get(scaffolderGroupFilterDataRef);

    expect(result).toBe(group);
  });
});
