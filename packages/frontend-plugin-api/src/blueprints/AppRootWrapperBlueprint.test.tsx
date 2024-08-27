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
import { AppRootWrapperBlueprint } from './AppRootWrapperBlueprint';
import { render, screen, waitFor } from '@testing-library/react';
import {
  coreExtensionData,
  createExtension,
  createExtensionInput,
  createFrontendPlugin,
} from '../wiring';
import { createSpecializedApp } from '@backstage/frontend-app-api';
import { MockConfigApi } from '@backstage/test-utils';

describe('AppRootWrapperBlueprint', () => {
  it('should return an extension with sensible defaults', () => {
    const extension = AppRootWrapperBlueprint.make({
      params: {
        Component: () => <div>Hello</div>,
      },
    });

    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "app/root",
          "input": "wrappers",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "app-root-wrapper",
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

  it('should render the simple component wrapper', async () => {
    const extension = AppRootWrapperBlueprint.make({
      params: {
        Component: () => <div>Hello</div>,
      },
    });

    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          id: 'test',
          extensions: [extension],
        }),
      ],
    });

    render(app.createRoot());

    await waitFor(() => expect(screen.getByText('Hello')).toBeInTheDocument());
  });

  it('should render the complex component wrapper', async () => {
    const extension = AppRootWrapperBlueprint.makeWithOverrides({
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
            <div data-testid={`${config.name}-${inputs.children.length}`}>
              {children}
              {inputs.children.flatMap(c =>
                c.get(coreExtensionData.reactElement),
              )}
            </div>
          ),
        });
      },
    });

    const app = createSpecializedApp({
      features: [
        createFrontendPlugin({
          id: 'test',
          extensions: [
            extension,
            createExtension({
              name: 'test-child',
              attachTo: { id: 'app-root-wrapper:test', input: 'children' },
              output: [coreExtensionData.reactElement],
              factory: () => [
                coreExtensionData.reactElement(<div>Its Me</div>),
              ],
            }),
          ],
        }),
      ],
      config: new MockConfigApi({
        app: {
          extensions: [
            {
              'app-root-wrapper:test': { config: { name: 'Robin' } },
            },
          ],
        },
      }),
    });

    render(app.createRoot());

    await waitFor(() => {
      expect(screen.getByTestId('Robin-1')).toBeInTheDocument();
      expect(screen.getByText('Its Me')).toBeInTheDocument();
    });
  });
});
