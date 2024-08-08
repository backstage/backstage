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
import React from 'react';
import { AppRootElementBlueprint } from './AppRootElementBlueprint';

describe('AppRootElementBlueprint', () => {
  it('should create an extension with sensible defaults', () => {
    const extension = AppRootElementBlueprint.make({
      params: {
        element: <div />,
      },
    });
    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "app/root",
          "input": "elements",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "app-root-element",
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
});
