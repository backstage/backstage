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

import _ from 'lodash';
import { createComponentRef } from '../components';
import { ComponentBlueprint, createComponent } from './ComponentBlueprint';
import React from 'react';

describe('ComponentBlueprint', () => {
  type Props = {
    isThing: boolean;
    optional?: string;
  };

  const mockComponentRef = createComponentRef<Props>({
    id: 'Mock',
  });

  it('should create an extension with sensible defaults', () => {
    const extension = ComponentBlueprint.make({
      name: 'test',
      params: {
        component: createComponent({
          loader: { sync: () => () => <div /> },
          ref: mockComponentRef,
        }),
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "api:app/components",
          "input": "components",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "component",
        "name": "test",
        "namespace": undefined,
        "output": [
          [Function],
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should have proper validation on the component props', () => {
    ComponentBlueprint.make({
      name: 'test',
      params: {
        component: createComponent({
          loader: {
            sync: () => props => {
              // @ts-expect-error should fail because isThing is boolean
              if (props.isThing === 'asd') {
                return <div>borked</div>;
              }

              expect(props).toBeDefined();

              return <div />;
            },
          },
          ref: mockComponentRef,
        }),
      },
    });
  });
});
