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
import { RollbarTopActiveItem } from '../../api/types';
import { RollbarProjectPage } from './RollbarProjectPage';

describe('RollbarProjectPage component', () => {
  const items: RollbarTopActiveItem[] = [
    {
      item: {
        id: 9898989,
        counter: 1234,
        environment: 'production',
        framework: 2,
        lastOccurrenceTimestamp: new Date().getTime() / 1000,
        level: 50,
        occurrences: 100,
        projectId: 12345,
        title: 'error occured',
        uniqueOccurrences: 10,
      },
      counts: [10, 10, 10, 10, 10, 50],
    },
  ];
  const rollbarApi: Partial<RollbarApi> = {
    getTopActiveItems: () => Promise.resolve(items),
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

  it('should render rollbar project page', async () => {
    const rendered = renderWrapped(<RollbarProjectPage />);
    expect(rendered.getByText(/Top Active Items/)).toBeInTheDocument();
  });
});
