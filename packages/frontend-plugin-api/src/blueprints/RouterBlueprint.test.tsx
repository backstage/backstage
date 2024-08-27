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
import { waitFor } from '@testing-library/react';
import {
  coreExtensionData,
  createExtension,
  createExtensionInput,
} from '../wiring';
import { PageBlueprint } from './PageBlueprint';
import { renderInTestApp } from '@backstage/frontend-test-utils';

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
        "T": undefined,
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
        "override": [Function],
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

    const { getByTestId } = renderInTestApp(<div />, {
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
    });

    await waitFor(() => {
      expect(getByTestId('test-contents')).toBeInTheDocument();
      expect(getByTestId('test-router')).toBeInTheDocument();
    });
  });

  it('should work with complex options and props', async () => {
    const extension = RouterBlueprint.makeWithOverrides({
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
      *factory(originalFactory, { inputs, config }) {
        yield* originalFactory({
          Component: ({ children }) => (
            <MemoryRouter>
              <div
                data-testid={`test-router-${config.name}-${inputs.children.length}`}
              >
                {children}
              </div>
            </MemoryRouter>
          ),
        });
      },
    });

    const { getByTestId } = renderInTestApp(<div />, {
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
      config: {
        app: {
          extensions: [
            {
              'app-router-component:test/test': { config: { name: 'Robin' } },
            },
          ],
        },
      },
    });

    await waitFor(() => {
      expect(getByTestId('test-contents')).toBeInTheDocument();
      expect(getByTestId('test-router-Robin-1')).toBeInTheDocument();
    });
  });
});
