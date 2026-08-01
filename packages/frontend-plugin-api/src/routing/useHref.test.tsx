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

import { renderHook } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { TestApiProvider } from '@backstage/test-utils';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { appHistoryApiRef } from './AppHistoryApi';
import { useHref } from './useHref';

describe('useHref', () => {
  const targets = [
    '/catalog',
    '/search?q=https://example.com',
    'https://example.com/x',
    '//example.com/x',
    'mailto:support@example.com',
  ];

  const renderTargets = (
    wrapper: (props: PropsWithChildren<{}>) => JSX.Element,
  ) =>
    targets.map(
      to => renderHook(() => useHref(to), { wrapper }).result.current,
    );

  it('should apply the app basename to app-relative targets and pass others through', () => {
    const appHistory = createMockAppHistory({ basename: '/backstage' });

    expect(
      renderTargets(({ children }) => (
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          <MemoryRouter>{children}</MemoryRouter>
        </TestApiProvider>
      )),
    ).toEqual([
      '/backstage/catalog',
      '/backstage/search?q=https://example.com',
      'https://example.com/x',
      '//example.com/x',
      'mailto:support@example.com',
    ]);
  });

  it('should pass non-app-relative targets through on the React Router fallback too', () => {
    // No app history registered — the old frontend system path, where React
    // Router's own useHref would otherwise resolve and prefix these.
    expect(
      renderTargets(({ children }) => (
        <TestApiProvider apis={[]}>
          <MemoryRouter basename="/backstage" initialEntries={['/backstage/']}>
            {children}
          </MemoryRouter>
        </TestApiProvider>
      )),
    ).toEqual([
      '/backstage/catalog',
      '/backstage/search?q=https://example.com',
      'https://example.com/x',
      '//example.com/x',
      'mailto:support@example.com',
    ]);
  });
});
