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

import { act, fireEvent, render, screen } from '@testing-library/react';
import { TestApiProvider, mockApis } from '@backstage/test-utils';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { PageMountProvider } from '@internal/frontend';
import { appHistoryApiRef } from '@backstage/frontend-plugin-api';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import { Link } from './Link';

it('resolves relative links without a router and preserves browser click behavior', () => {
  const history = createMockAppHistory({
    initialLocation: '/base/parent/item',
    basename: '/base',
  });
  const analytics = mockApis.analytics();
  render(
    <TestApiProvider
      apis={[
        [appHistoryApiRef, history],
        [analyticsApiRef, analytics],
      ]}
    >
      <PageMountProvider
        mount={{ basePath: '/parent', routePattern: '/parent' }}
      >
        <PageMountProvider
          mount={{ basePath: '/parent/item', routePattern: '/parent/item' }}
        >
          <Link to="../sibling?q=one#section" replace state={{ from: 'item' }}>
            Sibling
          </Link>
          <Link to="/parent/sibling?q=one#section">Current destination</Link>
          <Link to="/download" download>
            Download
          </Link>
          <Link to="/reload" reloadDocument>
            Reload
          </Link>
          <Link to="/new" target="_blank">
            New window
          </Link>
          <Link to="/cancel" onClick={event => event.preventDefault()}>
            Cancelled
          </Link>
        </PageMountProvider>
      </PageMountProvider>
    </TestApiProvider>,
  );
  const link = screen.getByRole('link', { name: 'Sibling' });
  expect(link).toHaveAttribute('href', '/base/parent/sibling?q=one#section');
  for (const options of [
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ]) {
    fireEvent.click(link, options);
  }
  fireEvent.click(screen.getByRole('link', { name: 'Download' }));
  fireEvent.click(screen.getByRole('link', { name: 'Reload' }));
  fireEvent.click(screen.getByRole('link', { name: 'New window' }));
  fireEvent.click(screen.getByRole('link', { name: 'Cancelled' }));
  expect(history.navigateCalls).toHaveLength(0);
  act(() => {
    fireEvent.click(link);
  });
  expect(history.location).toMatchObject({
    pathname: '/parent/sibling',
    search: '?q=one',
    hash: '#section',
    state: { from: 'item' },
  });
  expect(history.navigateCalls).toEqual([
    {
      to: '/parent/sibling?q=one#section',
      options: { replace: true, state: { from: 'item' } },
    },
  ]);
  expect(analytics.captureEvent).toHaveBeenCalledWith(
    expect.objectContaining({
      action: 'click',
      subject: 'Sibling',
      attributes: { to: '../sibling?q=one#section' },
    }),
  );
  fireEvent.click(screen.getByRole('link', { name: 'Current destination' }));
  expect(history.navigateCalls.at(-1)).toMatchObject({
    options: { replace: true },
  });
});
