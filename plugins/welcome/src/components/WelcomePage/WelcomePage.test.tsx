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

import React from 'react';
import { render } from '@testing-library/react';
import WelcomePage from './WelcomePage';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import {
  ApiProvider,
  ApiRegistry,
  errorApiRef,
  configApiRef,
  ConfigReader,
} from '@backstage/core';

describe('WelcomePage', () => {
  it('should render', () => {
    // TODO: use common test app with mock implementations of all core APIs
    const rendered = render(
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
    expect(rendered.baseElement).toBeInTheDocument();
  });
});
