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

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderInTestApp } from '@backstage/frontend-test-utils';
import { searchApiRef } from '@backstage/plugin-search-react';

import { rootRouteRef } from '../../plugin';

import { HomePageSearchBar } from './HomePageSearchBar';

describe('<HomePageSearchBar/>', () => {
  const searchApiMock = { query: jest.fn().mockResolvedValue({ results: [] }) };

  it("Don't wait query debounce time when enter is pressed", async () => {
    const { appHistory } = renderInTestApp(<HomePageSearchBar />, {
      apis: [[searchApiRef, searchApiMock]],
      mountedRoutes: {
        '/search': rootRouteRef,
      },
    });

    expect(searchApiMock.query).not.toHaveBeenCalled();

    await userEvent.type(await screen.findByLabelText('Search'), 'term{enter}');

    expect(appHistory.location).toMatchObject({
      pathname: '/search',
      search: '?query=term',
    });
  });
});
