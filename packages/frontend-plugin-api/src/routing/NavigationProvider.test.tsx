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
import { createContext, useContext } from 'react';
import {
  createMockAppHistory,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import { appHistoryApiRef } from './AppHistoryApi';
import { NavigationProvider, useNavigation } from './NavigationProvider';
import { useAppNavigate } from './useAppNavigate';
import { useAppHref } from './useAppHref';

it('defaults to framework navigation and keeps authored targets separate from browser hrefs', () => {
  const history = createMockAppHistory({
    basename: '/base',
    initialLocation: '/base/catalog/items?view=old#top',
  });
  const { result } = renderHook(() => useNavigation(), {
    wrapper: ({ children }) => (
      <TestApiProvider apis={[[appHistoryApiRef, history]]}>
        {children}
      </TestApiProvider>
    ),
  });
  expect(result.current.pathname).toBe('/base/catalog/items');
  expect(result.current.createHref('')).toBe('/base/catalog/items');
  expect(result.current.createHref('?view=new')).toBe(
    '/base/catalog/items?view=new',
  );
  expect(result.current.createHref('#details')).toBe(
    '/base/catalog/items#details',
  );
  expect(result.current.createHref('https://example.com')).toBe(
    'https://example.com',
  );
  expect(() => result.current.createHref('details')).toThrow(
    'App routing requires',
  );
  expect(() => result.current.navigate('details')).toThrow(
    'App routing requires',
  );
  act(() =>
    result.current.navigate('/other', { state: { source: 'neutral' } }),
  );
  expect(history.location).toMatchObject({
    pathname: '/other',
    state: { source: 'neutral' },
  });
  expect(result.current.pathname).toBe('/base/other');
  act(() => result.current.navigate('?view=new#top'));
  act(() => result.current.navigate(''));
  expect(history.location).toMatchObject({
    pathname: '/other',
    search: '',
    hash: '',
  });
});

it('calls the supplied hook at the consumer and leaves strict framework hooks unchanged', () => {
  const Scope = createContext('/provider');
  const history = createMockAppHistory({
    basename: '/base',
    initialLocation: '/base/framework',
  });
  const navigate = jest.fn();
  function useScopedNavigation() {
    const scope = useContext(Scope);
    return {
      createHref: (target: string) => `/base${scope}/${target}`,
      navigate,
      pathname: `/base${scope}`,
    };
  }
  const { result } = renderHook(
    () => ({
      navigation: useNavigation(),
      strictHref: useAppHref(''),
      strictNavigate: useAppNavigate(),
    }),
    {
      wrapper: ({ children }) => (
        <TestApiProvider apis={[[appHistoryApiRef, history]]}>
          <NavigationProvider useNavigation={useScopedNavigation}>
            <Scope.Provider value="/consumer">{children}</Scope.Provider>
          </NavigationProvider>
        </TestApiProvider>
      ),
    },
  );
  expect(result.current.navigation.createHref('details')).toBe(
    '/base/consumer/details',
  );
  expect(result.current.navigation.pathname).toBe('/base/consumer');
  result.current.navigation.navigate('details');
  expect(navigate).toHaveBeenCalledWith('details');
  expect(result.current.strictHref).toBe('/base/framework');
  expect(() => result.current.strictNavigate('details')).toThrow(
    'App routing requires',
  );
});
