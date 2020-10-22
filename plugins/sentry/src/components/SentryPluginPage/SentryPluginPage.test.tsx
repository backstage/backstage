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
import SentryPluginPage from './SentryPluginPage';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { msw } from '@backstage/test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import {
  ApiProvider,
  ApiRegistry,
  errorApiRef,
  configApiRef,
} from '@backstage/core';

const errorApi = { post: () => {} };
const ConfigApi = { getString: () => 'test' };

describe('SentryPluginPage', () => {
  const server = setupServer();
  msw.setupDefaultHandlers(server);

  it('should render header and time switched', () => {
    server.use(rest.get('/', (_req, res, ctx) => res(ctx.json({}))));
    const rendered = render(
      <ApiProvider
        apis={ApiRegistry.from([
          [errorApiRef, errorApi],
          [configApiRef, ConfigApi],
        ])}
      >
        <ThemeProvider theme={lightTheme}>
          <SentryPluginPage />
        </ThemeProvider>
      </ApiProvider>,
    );
    expect(rendered.getByText('Sentry issues')).toBeInTheDocument();
    expect(rendered.getByText('24H')).toBeInTheDocument();
    expect(rendered.getByText('12H')).toBeInTheDocument();
  });
});
