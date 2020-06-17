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
import mockFetch from 'jest-fetch-mock';
import ProfileCatalog from './ProfileCatalog';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { ApiProvider, ApiRegistry } from '@backstage/core';
import { gitOpsApiRef, GitOpsRestApi } from '../../api';

describe('ProfileCatalog', () => {
  it('should render', () => {
    const apis = ApiRegistry.from([
      [gitOpsApiRef, new GitOpsRestApi('http://localhost:3008')],
    ]);
    mockFetch.mockResponse(() => new Promise(() => {}));
    const rendered = render(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider apis={apis}>
          <ProfileCatalog />
        </ApiProvider>
      </ThemeProvider>,
    );
    expect(
      rendered.getByText('Create GitOps-managed Cluster'),
    ).toBeInTheDocument();
  });
});
