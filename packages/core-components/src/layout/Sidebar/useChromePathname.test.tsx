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

import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { renderHook, act } from '@testing-library/react';
import { appHistoryApiRef } from '@backstage/frontend-plugin-api';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { TestApiProvider } from '@backstage/test-utils';
import { useChromePathname } from './useChromePathname';

describe('useChromePathname', () => {
  it('reads pathname from the app history without React Router (NFS)', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog/default/component/widget',
    });

    const { result } = renderHook(() => useChromePathname(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          {children}
        </TestApiProvider>
      ),
    });

    expect(result.current).toBe('/catalog/default/component/widget');
  });

  it('updates when the app history emits a new location', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog',
    });

    const { result } = renderHook(() => useChromePathname(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          {children}
        </TestApiProvider>
      ),
    });

    act(() => {
      appHistory.navigate('/docs');
    });

    expect(result.current).toBe('/docs');
  });

  it('falls back to React Router useLocation when there is no app history (OFS)', () => {
    const { result } = renderHook(() => useChromePathname(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <MemoryRouter initialEntries={['/explore']}>{children}</MemoryRouter>
      ),
    });

    expect(result.current).toBe('/explore');
  });

  it('prefers the app history over React Router when both are present', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/from-app-history',
    });

    const { result } = renderHook(() => useChromePathname(), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
          <MemoryRouter initialEntries={['/from-router']}>
            {children}
          </MemoryRouter>
        </TestApiProvider>
      ),
    });

    expect(result.current).toBe('/from-app-history');
  });
});
