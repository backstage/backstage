/*
 * Copyright 2025 The Backstage Authors
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

import React from 'react';
import { EntityContextMenuItemBlueprint } from './EntityContextMenuItemBlueprint';
import { createRouteRef, useRouteRef } from '@backstage/frontend-plugin-api';

describe('EntityContextMenuItemBlueprint', () => {
  const routeRef = createRouteRef();
  const data = [
    {
      loader: async () => <li>Test!</li>,
    },
    {
      title: 'Test',
      href: '/somewhere',
      icon: <span>Test</span>,
    },
    {
      title: 'Test',
      useHref() {
        const r = useRouteRef(routeRef) ?? (() => '/somewhere');
        return r();
      },
      icon: <span>Test</span>,
    },
  ];

  it.each(data)('should return an extension with sane defaults', params => {
    const extension = EntityContextMenuItemBlueprint.make({
      name: 'test',
      params,
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "page:catalog/entity",
          "input": "extraContextMenuItems",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "entity-context-menu-item",
        "name": "test",
        "output": [
          [Function],
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });
});
