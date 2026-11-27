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
import { PropsWithChildren, useLayoutEffect } from 'react';
import { act, renderHook } from '@testing-library/react';
import { useTitleCounter } from './useTitleCounter';

describe('useTitleCounter', () => {
  it('does not restore a stale title when mounted alongside a page title', () => {
    document.title = 'Parent | Backstage';

    const Wrapper = ({ children }: PropsWithChildren) => {
      useLayoutEffect(() => {
        document.title = 'Parent | Sub-page | Backstage';
      }, []);
      return <>{children}</>;
    };

    renderHook(() => useTitleCounter(), { wrapper: Wrapper });

    expect(document.title).toBe('Parent | Sub-page | Backstage');
  });

  it('preserves a page title update after the notification count changes', async () => {
    document.title = 'Parent | Backstage';
    const { result, unmount } = renderHook(() => useTitleCounter());

    act(() => result.current.setNotificationCount(1));
    expect(document.title).toBe('(1) Parent | Backstage');

    await act(async () => {
      document.title = 'Parent | Sub-page | Backstage';
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(document.title).toBe('(1) Parent | Sub-page | Backstage');
    unmount();
    expect(document.title).toBe('Parent | Sub-page | Backstage');
  });
});
