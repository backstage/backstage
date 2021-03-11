/*
 * Copyright 2020 Spotify AB
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
  ApiProvider,
  ApiRegistry,
  configApiRef,
  ConfigReader,
  errorApiRef,
} from '@backstage/core';
import { renderInTestApp } from '@backstage/test-utils';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import WelcomePage from './WelcomePage';

describe('WelcomePage', () => {
  it('should render', async () => {
    const { baseElement } = await renderInTestApp(
      <ApiProvider
        apis={ApiRegistry.from([
          [errorApiRef, { post: jest.fn() }],
          [configApiRef, new ConfigReader({})],
        ])}
      >
        <ThemeProvider theme={lightTheme}>
          <WelcomePage />
        </ThemeProvider>
      </ApiProvider>,
    );
    expect(baseElement).toBeInTheDocument();
  });
});
