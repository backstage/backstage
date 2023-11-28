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

import {
  coreExtensionData,
  createExtension,
} from '@backstage/frontend-plugin-api';
import { screen } from '@testing-library/react';
import React from 'react';
import { createExtensionTester } from './createExtensionTester';

describe('createExtensionTester', () => {
  it('should render a simple extension', async () => {
    createExtensionTester(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'ignored', input: 'ignored' },
        output: { element: coreExtensionData.reactElement },
        factory: () => ({ element: <div>test</div> }),
      }),
    ).render();

    await expect(screen.findByText('test')).resolves.toBeInTheDocument();
  });

  it('should render an extension even if disabled by default', async () => {
    createExtensionTester(
      createExtension({
        namespace: 'test',
        attachTo: { id: 'ignored', input: 'ignored' },
        disabled: true,
        output: { element: coreExtensionData.reactElement },
        factory: () => ({ element: <div>test</div> }),
      }),
    ).render();

    await expect(screen.findByText('test')).resolves.toBeInTheDocument();
  });

  it("should fail to render an extension that doesn't output a react element", async () => {
    expect(() =>
      createExtensionTester(
        createExtension({
          namespace: 'test',
          attachTo: { id: 'ignored', input: 'ignored' },
          disabled: true,
          output: { path: coreExtensionData.routePath },
          factory: () => ({ path: '/foo' }),
        }),
      ).render(),
    ).toThrow(
      "Failed to instantiate extension 'core/router', input 'children' did not receive required extension data 'core.reactElement' from extension 'test'",
    );
  });
});
