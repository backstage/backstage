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
import { renderHook } from '@testing-library/react';
import { type PageMount } from '@internal/frontend';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { PageMountProvider } from '../../../frontend-test-utils/src/internal/TestPageMount';
import { useAppBasePath } from './appRouting';

describe('useAppBasePath', () => {
  const wrapper =
    (mount?: PageMount) =>
    ({ children }: PropsWithChildren<{}>) =>
      mount ? (
        <PageMountProvider mount={mount}>{children}</PageMountProvider>
      ) : (
        <>{children}</>
      );

  it('reports the page mount as a concatenable prefix, and nothing outside a page', () => {
    expect(renderHook(() => useAppBasePath()).result.current).toBe('');
    expect(
      renderHook(() => useAppBasePath(), {
        wrapper: wrapper({ basePath: '/catalog', routePattern: '/catalog' }),
      }).result.current,
    ).toBe('/catalog');
    // The app root normalizes to an empty prefix rather than to `/`, so it can
    // be concatenated with a `/`-prefixed suffix without doubling.
    expect(
      renderHook(() => useAppBasePath(), {
        wrapper: wrapper({ basePath: '/', routePattern: '/' }),
      }).result.current,
    ).toBe('');
  });
});
