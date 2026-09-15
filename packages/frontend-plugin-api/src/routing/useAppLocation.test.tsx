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

import { act, renderHook } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { MemoryRouter } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { appHistoryApiRef } from './AppHistoryApi';
import { useAppLocation } from './useAppLocation';
import { useAppNavigate } from './useAppNavigate';
import { useAppSearchParams } from './useAppSearchParams';

describe.each(['app history', 'legacy router'])(
  '%s location and query hooks',
  mode => {
    it('reads the location, updates repeated query values, clears defaults, and traverses history', () => {
      const history = createMockAppHistory({
        initialLocation: '/base/page?tag=one&tag=two#section',
        basename: '/base',
      });
      const wrapper = ({ children }: PropsWithChildren<{}>) =>
        mode === 'app history' ? (
          <TestApiProvider apis={[[appHistoryApiRef, history]]}>
            {children}
          </TestApiProvider>
        ) : (
          <TestApiProvider apis={[]}>
            <MemoryRouter
              initialEntries={['/base/page?tag=one&tag=two#section']}
              basename="/base"
            >
              {children}
            </MemoryRouter>
          </TestApiProvider>
        );
      const { result } = renderHook(
        () => ({
          location: useAppLocation(),
          query: useAppSearchParams({ view: 'list', tag: ['default'] }),
          navigate: useAppNavigate(),
        }),
        { wrapper },
      );
      expect(result.current.location).toMatchObject({
        pathname: '/page',
        search: '?tag=one&tag=two',
        hash: '#section',
      });
      expect(result.current.query[0].getAll('tag')).toEqual(['one', 'two']);
      expect(result.current.query[0].get('view')).toBe('list');
      const originalParams = result.current.query[0];
      act(() =>
        result.current.query[1](
          previous => {
            previous.append('tag', 'three');
            return previous;
          },
          { state: { source: 'filter' } },
        ),
      );
      expect(originalParams.getAll('tag')).toEqual(['one', 'two']);
      expect(result.current.location).toMatchObject({
        pathname: '/page',
        hash: '',
        state: { source: 'filter' },
      });
      expect(result.current.query[0].getAll('tag')).toEqual([
        'one',
        'two',
        'three',
      ]);
      act(() => result.current.query[1]({}, { replace: true }));
      expect(result.current.location.search).toBe('');
      expect(result.current.query[0].has('view')).toBe(false);
      act(() => result.current.navigate(-1));
      expect(result.current.location.search).toBe('?tag=one&tag=two');
      expect(result.current.location.hash).toBe('#section');
      expect(result.current.query[0].has('view')).toBe(false);
      act(() =>
        result.current.query[1]({
          q: 'https://example.com?a=b',
          tag: ['a', 'b'],
        }),
      );
      expect(result.current.query[0].get('q')).toBe('https://example.com?a=b');
      expect(result.current.query[0].getAll('tag')).toEqual(['a', 'b']);
    });
  },
);

it('prefers app history over a nested router location and follows external updates', () => {
  const history = createMockAppHistory({
    initialLocation: '/catalog/default/component/example',
  });
  const { result, unmount } = renderHook(() => useAppLocation(), {
    wrapper: ({ children }: PropsWithChildren<{}>) => (
      <TestApiProvider apis={[[appHistoryApiRef, history]]}>
        <MemoryRouter initialEntries={['/local']}>{children}</MemoryRouter>
      </TestApiProvider>
    ),
  });
  expect(result.current.pathname).toBe('/catalog/default/component/example');
  act(() => history.navigate('/search?q=example'));
  expect(result.current).toMatchObject({
    pathname: '/search',
    search: '?q=example',
  });
  unmount();
});
