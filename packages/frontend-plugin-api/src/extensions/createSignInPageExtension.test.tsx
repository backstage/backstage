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

import React from 'react';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import { createSignInPageExtension } from './createSignInPageExtension';
import { coreExtensionData, createExtension } from '../wiring';

describe('createSignInPageExtension', () => {
  it('renders a sign-in page', async () => {
    const SignInPage = createSignInPageExtension({
      name: 'test',
      loader: async () => () => <div data-testid="sign-in-page" />,
    });

    createExtensionTester(
      createExtension({
        name: 'dummy',
        attachTo: { id: 'ignored', input: 'ignored' },
        output: {
          element: coreExtensionData.reactElement,
        },
        factory: () => ({ element: <div /> }),
      }),
    )
      .add(SignInPage)
      .render();

    await expect(
      screen.findByTestId('sign-in-page'),
    ).resolves.toBeInTheDocument();
  });
});
