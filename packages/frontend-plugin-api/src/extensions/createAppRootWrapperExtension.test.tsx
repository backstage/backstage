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

import { createExtensionTester } from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { createSchemaFromZod } from '../schema/createSchemaFromZod';
import { coreExtensionData } from '../wiring/coreExtensionData';
import { createExtension } from '../wiring/createExtension';
import { createExtensionInput } from '../wiring/createExtensionInput';
import { createAppRootWrapperExtension } from './createAppRootWrapperExtension';
import { createPageExtension } from './createPageExtension';

describe('createAppRootWrapperExtension', () => {
  it('works with simple options and no props', async () => {
    const extension = createAppRootWrapperExtension({
      Component: () => <div>Hello</div>,
    });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      version: 'v1',
      kind: 'app-wrapper-component',
      attachTo: { id: 'app/root', input: 'wrappers' },
      disabled: false,
      inputs: {},
      output: {
        component: expect.anything(),
      },
      factory: expect.any(Function),
      toString: expect.any(Function),
    });

    createExtensionTester(
      createPageExtension({
        defaultPath: '/',
        loader: async () => <div />,
      }),
    )
      .add(extension)
      .render();

    await expect(screen.findByText('Hello')).resolves.toBeInTheDocument();
  });

  it('works with complex options and props', async () => {
    const schema = createSchemaFromZod(z => z.object({ name: z.string() }));

    const extension = createAppRootWrapperExtension({
      namespace: 'ns',
      name: 'test',
      configSchema: schema,
      disabled: true,
      inputs: {
        children: createExtensionInput({
          element: coreExtensionData.reactElement,
        }),
      },
      Component: ({ inputs, config, children }) => (
        <div data-testid={`${config.name}-${inputs.children.length}`}>
          {children}
        </div>
      ),
    });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      version: 'v1',
      kind: 'app-wrapper-component',
      namespace: 'ns',
      name: 'test',
      attachTo: { id: 'app/root', input: 'wrappers' },
      configSchema: schema,
      disabled: true,
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

    createExtensionTester(
      createPageExtension({
        defaultPath: '/',
        loader: async () => <div>Hello</div>,
      }),
    )
      .add(extension, { config: { name: 'Robin' } })
      .add(
        createExtension({
          attachTo: { id: 'app-wrapper-component:ns/test', input: 'children' },
          output: { element: coreExtensionData.reactElement },
          factory: () => ({ element: <div /> }),
        }),
      )
      .render();

    await expect(screen.findByText('Hello')).resolves.toBeInTheDocument();
    await expect(screen.findByTestId('Robin-1')).resolves.toBeInTheDocument();
  });
});
