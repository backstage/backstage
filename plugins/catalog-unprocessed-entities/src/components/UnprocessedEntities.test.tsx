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
import { toastApiRef } from '@backstage/frontend-plugin-api';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  NfsUnprocessedEntities,
  UnprocessedEntities,
  UnprocessedEntitiesContent,
} from './UnprocessedEntities';
import { catalogUnprocessedEntitiesApiRef } from '../api';
import { CatalogUnprocessedEntitiesApi } from '@backstage/plugin-catalog-unprocessed-entities-common';

describe('UnprocessedEntities components', () => {
  let api: jest.Mocked<CatalogUnprocessedEntitiesApi>;
  const toastApi = { post: jest.fn() };

  // Keep both sub-APIs perpetually loading so tests don't depend on data shape.
  const neverResolve = () => new Promise<any>(() => {});

  const renderWithApis = (ui: JSX.Element) =>
    renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogUnprocessedEntitiesApiRef, api],
          [toastApiRef, toastApi],
        ]}
      >
        {ui}
      </TestApiProvider>,
    );

  beforeEach(() => {
    api = {
      failed: jest.fn(neverResolve),
      pending: jest.fn(neverResolve),
      delete: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('loads the Failed tab by default and Pending on click', async () => {
    const user = userEvent.setup();
    await renderWithApis(<UnprocessedEntitiesContent />);

    expect(
      await screen.findByRole('tab', { name: 'Failed' }),
    ).toBeInTheDocument();
    expect(api.failed).toHaveBeenCalledTimes(1);
    expect(api.pending).not.toHaveBeenCalled();

    await user.click(screen.getByRole('tab', { name: 'Pending' }));
    expect(api.pending).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['UnprocessedEntities', <UnprocessedEntities />],
    ['NfsUnprocessedEntities', <NfsUnprocessedEntities />],
  ])('%s renders the page heading', async (_name, page) => {
    await renderWithApis(page);
    expect(await screen.findByText('Unprocessed Entities')).toBeInTheDocument();
  });
});
