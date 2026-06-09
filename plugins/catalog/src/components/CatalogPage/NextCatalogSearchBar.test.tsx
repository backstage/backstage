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

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from '@backstage/test-utils';
import { MockEntityListContextProvider } from '@backstage/plugin-catalog-react/testUtils';
import { NextCatalogSearchBar } from './NextCatalogSearchBar';

describe('NextCatalogSearchBar', () => {
  it('dispatches with column-derived fields on mount when URL has a search term', async () => {
    const updateFilters = jest.fn();

    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { text: 'hello' },
        }}
      >
        <NextCatalogSearchBar searchFields={['metadata.name', 'spec.owner']} />
      </MockEntityListContextProvider>,
    );

    await waitFor(() => {
      expect(updateFilters).toHaveBeenCalledWith({
        text: expect.objectContaining({
          value: 'hello',
          fields: ['metadata.name', 'spec.owner'],
        }),
      });
    });

    // useMount dispatches once; useUpdateEffect skips mount.
    // Verify no second dispatch fires.
    await expect(
      waitFor(
        () => expect(updateFilters.mock.calls.length).toBeGreaterThan(1),
        { timeout: 500 },
      ),
    ).rejects.toThrow();
  });

  it('does not dispatch on mount when URL has no search term', async () => {
    const updateFilters = jest.fn();

    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: {},
        }}
      >
        <NextCatalogSearchBar searchFields={['metadata.name']} />
      </MockEntityListContextProvider>,
    );

    // useMount skips (no URL term) and useUpdateEffect skips mount —
    // no dispatch should happen at all.
    await expect(
      waitFor(() => expect(updateFilters).toHaveBeenCalled(), {
        timeout: 500,
      }),
    ).rejects.toThrow();
  });

  it('dispatches with column-derived fields after typing', async () => {
    const user = userEvent.setup();
    const updateFilters = jest.fn();

    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: {},
        }}
      >
        <NextCatalogSearchBar
          searchFields={['metadata.name', 'metadata.tags']}
        />
      </MockEntityListContextProvider>,
    );

    await user.type(screen.getByRole('searchbox', { name: /search/i }), 'foo');

    await waitFor(() => {
      expect(updateFilters).toHaveBeenCalledWith({
        text: expect.objectContaining({
          value: 'foo',
          fields: ['metadata.name', 'metadata.tags'],
        }),
      });
    });

    // Only one dispatch for the typed term, no extra
    await expect(
      waitFor(
        () => expect(updateFilters.mock.calls.length).toBeGreaterThan(1),
        { timeout: 500 },
      ),
    ).rejects.toThrow();
  });

  it('dispatches text: undefined when search is cleared', async () => {
    const user = userEvent.setup();
    const updateFilters = jest.fn();

    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: {},
        }}
      >
        <NextCatalogSearchBar searchFields={['metadata.name']} />
      </MockEntityListContextProvider>,
    );

    const input = screen.getByRole('searchbox', { name: /search/i });
    await user.type(input, 'foo');

    await waitFor(() => {
      expect(updateFilters).toHaveBeenCalledWith({
        text: expect.objectContaining({ value: 'foo' }),
      });
    });

    updateFilters.mockClear();
    await user.clear(input);

    await waitFor(() => {
      expect(updateFilters).toHaveBeenCalledWith({ text: undefined });
    });

    // Only the clear dispatch, no extra
    await expect(
      waitFor(
        () => expect(updateFilters.mock.calls.length).toBeGreaterThan(1),
        { timeout: 500 },
      ),
    ).rejects.toThrow();
  });

  it('falls back to default fields when searchFields is empty', async () => {
    const updateFilters = jest.fn();

    await renderInTestApp(
      <MockEntityListContextProvider
        value={{
          updateFilters,
          queryParameters: { text: 'hello' },
        }}
      >
        <NextCatalogSearchBar searchFields={[]} />
      </MockEntityListContextProvider>,
    );

    await waitFor(() => {
      expect(updateFilters).toHaveBeenCalledWith({
        text: expect.objectContaining({
          value: 'hello',
          fields: undefined,
        }),
      });
    });

    // useMount dispatches once, no extra
    await expect(
      waitFor(
        () => expect(updateFilters.mock.calls.length).toBeGreaterThan(1),
        { timeout: 500 },
      ),
    ).rejects.toThrow();
  });
});
