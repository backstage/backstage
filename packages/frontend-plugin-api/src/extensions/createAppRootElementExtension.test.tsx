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
import { createAppRootElementExtension } from './createAppRootElementExtension';

describe('createAppRootElementExtension', () => {
  it('works with simple options and just an element', async () => {
    const extension = createAppRootElementExtension({
      element: <div>Hello</div>,
    });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      version: 'v1',
      kind: 'app-root-element',
      attachTo: { id: 'app/root', input: 'elements' },
      disabled: false,
      inputs: {},
      output: {
        element: expect.anything(),
      },
      factory: expect.any(Function),
      toString: expect.any(Function),
    });

    createExtensionTester(extension).render();

    await expect(screen.findByText('Hello')).resolves.toBeInTheDocument();
  });

  it('works with complex options and a callback', async () => {
    const schema = createSchemaFromZod(z => z.object({ name: z.string() }));

    const extension = createAppRootElementExtension({
      namespace: 'ns',
      name: 'test',
      configSchema: schema,
      attachTo: { id: 'other', input: 'slot' },
      disabled: true,
      inputs: {
        children: createExtensionInput({
          element: coreExtensionData.reactElement,
        }),
      },
      element: ({ inputs, config }) => (
        <div>
          Hello, {config.name}, {inputs.children.length}
        </div>
      ),
    });

    expect(extension).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      version: 'v1',
      kind: 'app-root-element',
      namespace: 'ns',
      name: 'test',
      attachTo: { id: 'other', input: 'slot' },
      configSchema: schema,
      disabled: true,
      inputs: {
        children: createExtensionInput({
          element: coreExtensionData.reactElement,
        }),
      },
      output: {
        element: expect.anything(),
      },
      factory: expect.any(Function),
      toString: expect.any(Function),
    });

    createExtensionTester(extension, { config: { name: 'Robin' } })
      .add(
        createExtension({
          attachTo: { id: 'app-root-element:ns/test', input: 'children' },
          output: { element: coreExtensionData.reactElement },
          factory: () => ({ element: <div /> }),
        }),
      )
      .render();

    await expect(
      screen.findByText('Hello, Robin, 1'),
    ).resolves.toBeInTheDocument();
  });
});
