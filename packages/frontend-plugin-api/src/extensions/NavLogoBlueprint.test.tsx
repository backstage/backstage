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
import { NavLogoBlueprint } from './NavLogoBlueprint';
import { createExtensionTester } from '@backstage/frontend-test-utils';

describe('NavLogoBlueprint', () => {
  it('should create an extension with sensible defaults', () => {
    const extension = NavLogoBlueprint.make({
      params: {
        logoFull: <div>Logo Full</div>,
        logoIcon: <div>Logo Icon</div>,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "app/nav",
          "input": "logos",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "nav-logo",
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

  it('should return a valid component ref', () => {
    const logoFull = <div>Logo Full</div>;
    const logoIcon = <div>Logo Icon</div>;

    const extension = NavLogoBlueprint.make({
      name: 'test',
      params: {
        logoFull,
        logoIcon,
      },
    });

    const tester = createExtensionTester(extension);

    expect(tester.data(NavLogoBlueprint.dataRefs.logoElements)).toEqual({
      logoFull,
      logoIcon,
    });
  });
});
