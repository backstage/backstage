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
import { act, renderHook, waitFor } from '@testing-library/react';
import { useTitleCounter } from './useTitleCounter';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('useTitleCounter', () => {
  beforeEach(() => {
    document.title = 'Home | Backstage';
  });

  it('prefixes the title with the count, and removes the prefix on unmount', () => {
    const { result, unmount } = renderHook(() => useTitleCounter());

    act(() => result.current.setNotificationCount(3));
    expect(document.title).toBe('(3) Home | Backstage');

    act(() => result.current.setNotificationCount(0));
    expect(document.title).toBe('Home | Backstage');

    act(() => result.current.setNotificationCount(5));
    unmount();
    expect(document.title).toBe('Home | Backstage');
  });

  it('prefixes a title the page sets later', async () => {
    const { result } = renderHook(() => useTitleCounter());
    act(() => result.current.setNotificationCount(3));

    document.title = 'Catalog | Backstage';

    await waitFor(() => expect(document.title).toBe('(3) Catalog | Backstage'));
  });

  it('leaves the title alone while there is nothing unread', async () => {
    renderHook(() => useTitleCounter());

    document.title = '(2) Inbox | Backstage';
    await sleep(150);

    expect(document.title).toBe('(2) Inbox | Backstage');
  });

  describe('with updates scheduled as in a browser', () => {
    // Inside act(), React batches the updates the title observer causes, which
    // hides a loop between a page's previous and current title.
    let actEnvironment: unknown;
    beforeEach(() => {
      actEnvironment = (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
      (globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
    });
    afterEach(() => {
      (globalThis as any).IS_REACT_ACT_ENVIRONMENT = actEnvironment;
    });

    it('keeps the latest title when a page retitles itself twice in quick succession', async () => {
      const { result } = renderHook(() => useTitleCounter());
      result.current.setNotificationCount(3);
      await sleep(20);

      const titles: string[] = [];
      const observer = new MutationObserver(() => titles.push(document.title));
      observer.observe(document.querySelector('title')!, {
        characterData: true,
        childList: true,
        subtree: true,
      });
      document.title = 'Catalog | Backstage';
      await sleep(10);
      document.title = 'Catalog | 3 entities | Backstage';
      await sleep(300);
      observer.disconnect();

      expect(document.title).toBe('(3) Catalog | 3 entities | Backstage');
      expect(titles.length).toBeLessThanOrEqual(4);
    });
  });
});
