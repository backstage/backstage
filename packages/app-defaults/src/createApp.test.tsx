/*
 * Copyright 2020 The Backstage Authors
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

import { screen } from '@testing-library/react';
import { renderWithEffects } from '@backstage/test-utils';
import React, { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createApp } from './createApp';

describe('Optional ThemeProvider', () => {
  it('should render app with user-provided ThemeProvider', async () => {
    const components = {
      NotFoundErrorPage: () => null,
      BootErrorPage: () => null,
      Progress: () => null,
      Router: MemoryRouter,
      ErrorBoundaryFallback: () => null,
      ThemeProvider: ({ children }: PropsWithChildren<{}>) => (
        <main role="main">{children}</main>
      ),
    };

    const App = createApp({ components }).getProvider();

    await renderWithEffects(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
