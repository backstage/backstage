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
import { RouterBlueprint } from './RouterBlueprint';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { createSpecializedApp } from '@backstage/frontend-app-api';
import {
  coreExtensionData,
  createExtension,
  createExtensionInput,
  createExtensionOverrides,
} from '../wiring';
import { MockConfigApi } from '@backstage/test-utils';
import { PageBlueprint } from './PageBlueprint';

describe('RouterBlueprint', () => {
  it('should return an extension when calling make with sensible defaults', () => {
    const extension = RouterBlueprint.make({
      params: {
        Component: props => <div>{props.children}</div>,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "app/root",
          "input": "router",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "app-router-component",
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

  it('should work with simple options', async () => {
    const extension = RouterBlueprint.make({
      namespace: 'test',
      params: {
        Component: ({ children }) => (
          <MemoryRouter>
            <div data-testid="test-router">{children}</div>
          </MemoryRouter>
        ),
      },
    });

    const app = createSpecializedApp({
      features: [
        createExtensionOverrides({
          extensions: [
            extension,
            PageBlueprint.make({
              namespace: 'test',
              params: {
                defaultPath: '/',
                loader: async () => <div data-testid="test-contents" />,
              },
            }),
          ],
        }),
      ],
    });

    const { getByTestId } = render(app.createRoot());

    await waitFor(() => {
      expect(getByTestId('test-contents')).toBeInTheDocument();
      expect(getByTestId('test-router')).toBeInTheDocument();
    });
  });

  it('should work with complex options and props', async () => {
    const extension = RouterBlueprint.make({
      namespace: 'test',
      name: 'test',
      config: {
        schema: {
          name: z => z.string(),
        },
      },
      inputs: {
        children: createExtensionInput([coreExtensionData.reactElement]),
      },
      params: {
        Component: ({ inputs, children, config }) => (
          <MemoryRouter>
            <div
              data-testid={`test-router-${config.name}-${inputs.children.length}`}
            >
              {children}
            </div>
          </MemoryRouter>
        ),
      },
    });

    const app = createSpecializedApp({
      features: [
        createExtensionOverrides({
          extensions: [
            extension,
            createExtension({
              namespace: 'test',
              attachTo: {
                id: 'app-router-component:test/test',
                input: 'children',
              },
              output: [coreExtensionData.reactElement],
              *factory() {
                yield coreExtensionData.reactElement(<div />);
              },
            }),
            PageBlueprint.make({
              namespace: 'test',
              params: {
                defaultPath: '/',
                loader: async () => <div data-testid="test-contents" />,
              },
            }),
          ],
        }),
      ],
      config: new MockConfigApi({
        app: {
          extensions: [
            {
              'app-router-component:test/test': { config: { name: 'Robin' } },
            },
          ],
        },
      }),
    });

    const { getByTestId } = render(app.createRoot());

    await waitFor(() => {
      expect(getByTestId('test-contents')).toBeInTheDocument();
      expect(getByTestId('test-router-Robin-1')).toBeInTheDocument();
    });
  });
});
