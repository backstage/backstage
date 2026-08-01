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
  const appHistory = createMockAppHistory({ basename: '/backstage' });

  const targets = [
    '/catalog',
    '/search?q=https://example.com',
    'https://example.com/x',
    '//example.com/x',
    'mailto:support@example.com',
    'tel:+15555550123',
  ];

  // Every spelling a browser executes rather than navigates to, including the
  // ones it only executes after dropping the tabs and newlines from the URL.
  const executableTargets = [
    // eslint-disable-next-line no-script-url
    'javascript:alert(1)',
    // eslint-disable-next-line no-script-url
    'JavaScript:alert(1)',
    '\tjavascript:alert(1)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
  ];

  const withAppHistory = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
      <MemoryRouter>{children}</MemoryRouter>
    </TestApiProvider>
  );

  // No app history registered — the old frontend system path, where React
  // Router's own useHref would otherwise resolve and prefix these.
  const withReactRouterOnly = ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider apis={[]}>
      <MemoryRouter basename="/backstage" initialEntries={['/backstage/']}>
        {children}
      </MemoryRouter>
    </TestApiProvider>
  );

  const renderTargets = (
    wrapper: (props: PropsWithChildren<{}>) => JSX.Element,
    hrefs: string[] = targets,
  ) =>
    hrefs.map(to => renderHook(() => useHref(to), { wrapper }).result.current);

  it('should apply the app basename to app-relative targets and pass others through', () => {
    expect(renderTargets(withAppHistory)).toEqual([
      '/backstage/catalog',
      '/backstage/search?q=https://example.com',
      'https://example.com/x',
      '//example.com/x',
      'mailto:support@example.com',
      'tel:+15555550123',
    ]);
  });

  it('should pass non-app-relative targets through on the React Router fallback too', () => {
    expect(renderTargets(withReactRouterOnly)).toEqual([
      '/backstage/catalog',
      '/backstage/search?q=https://example.com',
      'https://example.com/x',
      '//example.com/x',
      'mailto:support@example.com',
      'tel:+15555550123',
    ]);
  });

  it('should hand the target back when there is no router at all', () => {
    // A framework app can legitimately have no React Router: `RouterBlueprint`
    // may be swapped for a passthrough, and `createSpecializedApp` without
    // `@backstage/plugin-app` mounts none. React Router's own `useHref` throws
    // there, so this hook must not be built on it.
    const withoutRouter = ({ children }: PropsWithChildren<{}>) => (
      <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
        {children}
      </TestApiProvider>
    );
    const withNeitherAuthority = ({ children }: PropsWithChildren<{}>) => (
      <TestApiProvider apis={[]}>{children}</TestApiProvider>
    );

    // The app history still knows the deploy basename without a router.
    expect(renderTargets(withoutRouter)).toEqual([
      '/backstage/catalog',
      '/backstage/search?q=https://example.com',
      'https://example.com/x',
      '//example.com/x',
      'mailto:support@example.com',
      'tel:+15555550123',
    ]);
    // With neither authority there is no basename and nothing to render the
    // href with, so every target comes back as written.
    expect(renderTargets(withNeitherAuthority)).toEqual(targets);
  });

  it('should return an inert href for targets a browser would execute', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const inert = executableTargets.map(() => 'about:blank');

    expect(renderTargets(withAppHistory, executableTargets)).toEqual(inert);
    expect(renderTargets(withReactRouterOnly, executableTargets)).toEqual(
      inert,
    );

    // Matched on the message: React Router warns about its own future flags
    // through the same spy.
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('about:blank'));
    warn.mockRestore();
  });
});
