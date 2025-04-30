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
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { createRouteRef } from '../routing';
import { NavComponentBlueprint } from './NavComponentBlueprint';

describe('NavComponentBlueprint', () => {
  const mockRouteRef = createRouteRef();
  const MockComponent = () => undefined;

  it('should return an extension with sensible defaults', () => {
    const extension = NavComponentBlueprint.make({
      params: {
        Component: MockComponent,
        routeRef: mockRouteRef,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "app/nav",
          "input": "components",
        },
        "configSchema": {
          "parse": [Function],
          "schema": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "additionalProperties": false,
            "properties": {
              "args": {
                "additionalProperties": {},
                "type": "object",
              },
            },
            "type": "object",
          },
        },
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "nav-component",
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

  it('should return the correct extension data', () => {
    const extension = NavComponentBlueprint.make({
      params: {
        Component: MockComponent,
        routeRef: mockRouteRef,
        args: {
          anArgument: 'argValue',
        },
      },
    });

    const tester = createExtensionTester(extension);
    expect(tester.get(NavComponentBlueprint.dataRefs.target)).toEqual({
      Component: MockComponent,
      routeRef: mockRouteRef,
      args: {
        anArgument: 'argValue',
      },
    });
  });

  it('should allow overriding of the args using config', () => {
    const extension = NavComponentBlueprint.make({
      params: {
        Component: MockComponent,
        routeRef: mockRouteRef,
      },
    });

    const tester = createExtensionTester(extension, {
      config: { args: { anArgument: 'argumentValue' } },
    });

    const extensionTarget = tester.get(NavComponentBlueprint.dataRefs.target);
    expect(extensionTarget).toEqual({
      Component: MockComponent,
      routeRef: mockRouteRef,
      args: { anArgument: 'argumentValue' },
    });
  });
});
