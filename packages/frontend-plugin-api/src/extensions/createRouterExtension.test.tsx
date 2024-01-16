/*
 * Copyright 2023 The Backstage Authors
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

import { createSpecializedApp } from '@backstage/frontend-app-api';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MockConfigApi } from '@backstage/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { createSchemaFromZod } from '../schema/createSchemaFromZod';
import { coreExtensionData } from '../wiring/coreExtensionData';
import { createExtension } from '../wiring/createExtension';
import { createExtensionInput } from '../wiring/createExtensionInput';
import { createExtensionOverrides } from '../wiring/createExtensionOverrides';
import { createPageExtension } from './createPageExtension';
import { createRouterExtension } from './createRouterExtension';

describe('createRouterExtension', () => {
  it('works with simple options and no props', async () => {
    const extension = createRouterExtension({
      namespace: 'test',
      Component: ({ children }) => (
        <MemoryRouter>
          <div data-testid="test-router">{children}</div>
        </MemoryRouter>
      ),
    });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      version: 'v1',
      kind: 'app-router-component',
      namespace: 'test',
      attachTo: { id: 'app/root', input: 'router' },
      disabled: false,
      inputs: {},
      output: {
        component: expect.anything(),
      },
      factory: expect.any(Function),
      toString: expect.any(Function),
    });

    const app = createSpecializedApp({
      features: [
        createExtensionOverrides({
          extensions: [
            extension,
            createPageExtension({
              namespace: 'test',
              defaultPath: '/',
              loader: async () => <div data-testid="test-contents" />,
            }),
          ],
        }),
      ],
    });

    render(app.createRoot());

    await expect(
      screen.findByTestId('test-contents'),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByTestId('test-router'),
    ).resolves.toBeInTheDocument();
  });

  it('works with complex options and props', async () => {
    const schema = createSchemaFromZod(z => z.object({ name: z.string() }));

    const extension = createRouterExtension({
      namespace: 'test',
      name: 'test',
      configSchema: schema,
      inputs: {
        children: createExtensionInput({
          element: coreExtensionData.reactElement,
        }),
      },
      Component: ({ inputs, config, children }) => (
        <MemoryRouter>
          <div
            data-testid={`test-router-${config.name}-${inputs.children.length}`}
          >
            {children}
          </div>
        </MemoryRouter>
      ),
    });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      version: 'v1',
      kind: 'app-router-component',
      namespace: 'test',
      name: 'test',
      attachTo: { id: 'app/root', input: 'router' },
      configSchema: schema,
      disabled: false,
      inputs: {
        children: createExtensionInput({
          element: coreExtensionData.reactElement,
        }),
      },
      output: {
        component: expect.anything(),
      },
      factory: expect.any(Function),
      toString: expect.any(Function),
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
              output: { element: coreExtensionData.reactElement }, // doesn't matter
              factory: () => ({ element: <div /> }),
            }),
            createPageExtension({
              namespace: 'test',
              defaultPath: '/',
              loader: async () => <div data-testid="test-contents" />,
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

    render(app.createRoot());

    await expect(
      screen.findByTestId('test-contents'),
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByTestId('test-router-Robin-1'),
    ).resolves.toBeInTheDocument();
  });
});
