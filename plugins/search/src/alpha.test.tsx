/*
 * Copyright 2026 The Backstage Authors
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

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { searchApiRef } from '@backstage/plugin-search-react';
import { searchPage } from './alpha';

describe('searchPage', () => {
  it('includes custom catalog kinds in the kind filter', async () => {
    const catalogApi = catalogApiMock.mock({
      getEntityFacets: jest.fn().mockResolvedValue({
        facets: {
          kind: [
            { value: 'CustomKind', count: 1 },
            { value: 'Component', count: 2 },
          ],
        },
      }),
    });
    const searchApi = {
      query: jest.fn().mockResolvedValue({ results: [], numberOfResults: 0 }),
    };

    const tester = createExtensionTester(searchPage);
    await renderInTestApp(tester.reactElement(), {
      apis: [catalogApi, [searchApiRef, searchApi]],
      config: {
        backend: { baseUrl: 'http://localhost:7007' },
        search: { query: { pageLimit: 10 } },
      },
    });

    const kindFilter = within(await screen.findByLabelText('Kind')).getByRole(
      'button',
    );
    await waitFor(() =>
      expect(kindFilter).not.toHaveAttribute('aria-disabled'),
    );
    await userEvent.click(kindFilter);

    expect(
      await screen.findByRole('option', { name: 'CustomKind' }),
    ).toBeInTheDocument();
    expect(catalogApi.getEntityFacets).toHaveBeenCalledWith({
      facets: ['kind'],
    });
  });
});
