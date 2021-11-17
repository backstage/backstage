/*
 * Copyright 2021 The Backstage Authors
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
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { configApiRef } from '@backstage/core-plugin-api';
import {
  ApiProvider,
  ApiRegistry,
  ConfigReader,
} from '@backstage/core-app-api';
import { rootRouteRef } from '../../plugin';
import { searchApiRef } from '../../apis';

import { SearchModal } from './SearchModal';

jest.mock('../SearchContext', () => ({
  ...jest.requireActual('../SearchContext'),
  useSearch: jest.fn().mockReturnValue({
    result: {},
  }),
}));

describe('SearchModal', () => {
  const query = jest.fn().mockResolvedValue({});

  const apiRegistry = ApiRegistry.from([
    [configApiRef, new ConfigReader({ app: { title: 'Mock app' } })],
    [searchApiRef, { query }],
  ]);

  const toggleModal = jest.fn();

  it('Should render the Modal correctly', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('Calls toggleModal handler', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <SearchModal open toggleModal={toggleModal} />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/search': rootRouteRef,
        },
      },
    );
    userEvent.keyboard('{esc}');
    expect(toggleModal).toHaveBeenCalledTimes(1);
  });
});
