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
import { MemoryRouter } from 'react-router-dom';
import { useResolvedHref } from './useResolvedHref';

describe('useResolvedHref', () => {
  it('preserves the app root when react-router resolves "/" to an empty string', () => {
    const { result } = renderHook(() => useResolvedHref('/'), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
      ),
    });

    expect(result.current).toBe('/');
  });

  it('preserves the app root when a basename is configured', () => {
    const { result } = renderHook(() => useResolvedHref('/'), {
      wrapper: ({ children }) => (
        <MemoryRouter basename="/docs" initialEntries={['/docs']}>
          {children}
        </MemoryRouter>
      ),
    });

    // With a basename, useHref('/') typically yields '/docs' (or '/docs/').
    // If RR ever collapses the root to ''/'.', we still keep '/'.
    expect(result.current === '/' || result.current.startsWith('/docs')).toBe(
      true,
    );
    expect(result.current).not.toBe('');
    expect(result.current).not.toBe('.');
  });

  it('leaves external URLs unchanged', () => {
    const { result } = renderHook(
      () => useResolvedHref('https://example.com/docs'),
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
        ),
      },
    );

    expect(result.current).toBe('https://example.com/docs');
  });
});
