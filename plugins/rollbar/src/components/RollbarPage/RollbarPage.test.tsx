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

import * as React from 'react';
import {
  ApiProvider,
  ApiRegistry,
  ConfigApi,
  configApiRef,
} from '@backstage/core';
import { wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import { RollbarApi, rollbarApiRef } from '../../api/RollbarApi';
import { RollbarProject } from '../../api/types';
import { RollbarPage } from './RollbarPage';

describe('RollbarPage component', () => {
  const projects: RollbarProject[] = [
    { id: 123, name: 'abc', accountId: 1, status: 'enabled' },
    { id: 456, name: 'xyz', accountId: 1, status: 'enabled' },
  ];
  const rollbarApi: Partial<RollbarApi> = {
    getAllProjects: () => Promise.resolve(projects),
  };
  const config: Partial<ConfigApi> = {
    getString: () => 'foo',
    getOptionalString: () => 'foo',
  };

  const renderWrapped = (children: React.ReactNode) =>
    render(
      wrapInTestApp(
        <ApiProvider
          apis={ApiRegistry.from([
            [rollbarApiRef, rollbarApi],
            [configApiRef, config],
          ])}
        >
          {children}
        </ApiProvider>,
      ),
    );

  it('should render rollbar landing page', async () => {
    const rendered = renderWrapped(<RollbarPage />);
    expect(rendered.getByText(/Rollbar/)).toBeInTheDocument();
  });
});
