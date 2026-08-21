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
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { useAppHistoryLocation } from './useAppHistoryLocation';

describe('useAppHistoryLocation', () => {
  it('tracks the app history location and keeps a stable snapshot reference', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog?q=1',
    });

    const { result } = renderHook(() => useAppHistoryLocation(appHistory));

    expect(result.current).toEqual({
      pathname: '/catalog',
      search: '?q=1',
      hash: '',
      state: undefined,
    });

    const state = { from: 'catalog' };
    act(() => {
      appHistory.navigate('/create#top', { state });
    });

    expect(result.current).toEqual({
      pathname: '/create',
      search: '',
      hash: '#top',
      state,
    });

    // Navigating to the location we are already on must not produce a new
    // snapshot reference — that is the invariant `AppHistoryApi.location`
    // guarantees, and the reason no local mirror of `location$` is needed.
    const previous = result.current;
    act(() => {
      appHistory.navigate('/create#top', { state });
    });

    expect(result.current).toBe(previous);
  });

  it('returns undefined when there is no app history', () => {
    const { result } = renderHook(() => useAppHistoryLocation(undefined));

    expect(result.current).toBeUndefined();
  });
});
