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
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { renderHook } from '@testing-library/react';
import { navigationControllerApiRef } from '@backstage/frontend-plugin-api';
import { createMockNavigationController } from '@backstage/frontend-test-utils';
import { TestApiProvider } from '@backstage/test-utils';
import { useChromeResolvedPath } from './useChromeResolvedPath';

describe('useChromeResolvedPath', () => {
  it('returns absolute paths as plain resolved strings without React Router', () => {
    const navigationController = createMockNavigationController({
      initialLocation: '/catalog',
    });

    const { result } = renderHook(() => useChromeResolvedPath('/docs'), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider
          apis={[[navigationControllerApiRef, navigationController]]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    expect(result.current.pathname).toBe('/docs');
  });

  it('resolves relative paths against the navigation controller location (NFS)', () => {
    const navigationController = createMockNavigationController({
      initialLocation: '/catalog/entities',
    });

    const { result } = renderHook(() => useChromeResolvedPath('../docs'), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <TestApiProvider
          apis={[[navigationControllerApiRef, navigationController]]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    expect(result.current.pathname).toBe('/catalog/docs');
  });

  it('resolves relative paths via React Router when no controller is registered (OFS)', () => {
    const { result } = renderHook(() => useChromeResolvedPath('widgets'), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <MemoryRouter initialEntries={['/catalog']}>
          <Routes>
            <Route path="/catalog" element={children} />
          </Routes>
        </MemoryRouter>
      ),
    });

    expect(result.current.pathname).toBe('/catalog/widgets');
  });
});
