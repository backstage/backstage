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
import { NavItemBlueprint } from './NavItemBlueprint';

describe('NavItemBlueprint', () => {
  const mockRouteRef = createRouteRef();
  const MockIcon = () => null;

  it('should return an extension with sensible defaults', () => {
    const extension = NavItemBlueprint.make({
      params: {
        icon: MockIcon,
        routeRef: mockRouteRef,
        title: 'TEST',
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "app/nav",
          "input": "items",
        },
        "configSchema": {
          "parse": [Function],
          "schema": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "additionalProperties": false,
            "properties": {
              "title": {
                "default": "TEST",
                "type": "string",
              },
            },
            "type": "object",
          },
        },
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "nav-item",
        "name": undefined,
        "namespace": undefined,
        "output": [
          [Function],
        ],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should return the correct extension data', () => {
    const extension = NavItemBlueprint.make({
      params: {
        icon: MockIcon,
        routeRef: mockRouteRef,
        title: 'TEST',
      },
    });

    const tester = createExtensionTester(extension);

    expect(tester.data(NavItemBlueprint.dataRefs.target)).toEqual({
      title: 'TEST',
      icon: MockIcon,
      routeRef: mockRouteRef,
    });
  });

  it('should allow overriding of the title using config', () => {
    const extension = NavItemBlueprint.make({
      params: {
        icon: MockIcon,
        routeRef: mockRouteRef,
        title: 'TEST',
      },
    });

    const tester = createExtensionTester(extension, {
      config: { title: 'OVERRIDDEN' },
    });

    expect(tester.data(NavItemBlueprint.dataRefs.target)).toEqual({
      title: 'OVERRIDDEN',
      icon: MockIcon,
      routeRef: mockRouteRef,
    });
  });
});
