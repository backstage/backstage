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

  describe('UnprocessedEntitiesContent', () => {
    it('renders both tab labels and selects Failed by default', async () => {
      const { unmount } = await renderWithApis(<UnprocessedEntitiesContent />);

      const failedTab = await screen.findByRole('tab', { name: 'Failed' });
      const pendingTab = screen.getByRole('tab', { name: 'Pending' });

      expect(failedTab).toBeInTheDocument();
      expect(pendingTab).toBeInTheDocument();
      // The failed tab is the default — its panel's data is requested on mount.
      expect(api.failed).toHaveBeenCalledTimes(1);
      expect(api.pending).not.toHaveBeenCalled();

      unmount();
    });

    it('activates the Pending panel when the Pending tab is clicked', async () => {
      const user = userEvent.setup();
      await renderWithApis(<UnprocessedEntitiesContent />);

      await user.click(await screen.findByRole('tab', { name: 'Pending' }));

      // The pending sub-component mounts and requests its data.
      expect(api.pending).toHaveBeenCalledTimes(1);
    });
  });

  describe('UnprocessedEntities (legacy page wrapper)', () => {
    it('renders the page heading', async () => {
      const { unmount } = await renderWithApis(<UnprocessedEntities />);
      expect(
        await screen.findByText('Unprocessed Entities'),
      ).toBeInTheDocument();
      unmount();
    });
  });

  describe('NfsUnprocessedEntities (new frontend system page wrapper)', () => {
    it('renders the page heading', async () => {
      await renderWithApis(<NfsUnprocessedEntities />);
      expect(
        await screen.findByText('Unprocessed Entities'),
      ).toBeInTheDocument();
    });
  });
});
