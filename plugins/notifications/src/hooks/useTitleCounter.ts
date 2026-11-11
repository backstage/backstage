/*
 * Copyright 2024 The Backstage Authors
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
import { useCallback, useEffect, useState } from 'react';

const cleanTitle = (currentTitle: string) =>
  currentTitle.replace(/^\(\d+\)\s/, '');

/** @internal */
export function useTitleCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // With nothing to show, the title is left to the page entirely, which is also
    // how a disabled counter stays out of the way.
    if (count === 0) {
      return undefined;
    }

    // Always prefixes the title as it is now, never a remembered one: a page may
    // retitle itself at any moment, and writing back an older title would undo it.
    // Once the prefix is right there is nothing to write, so the hook's own write
    // does not trigger another.
    const showCount = () => {
      const shownTitle = `(${count}) ${cleanTitle(document.title)}`;
      if (document.title !== shownTitle) {
        document.title = shownTitle;
      }
    };
    showCount();

    const titleElement = document.querySelector('title');
    let observer: MutationObserver | undefined;
    if (titleElement) {
      observer = new MutationObserver(showCount);
      observer.observe(titleElement, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
    return () => {
      observer?.disconnect();
      document.title = cleanTitle(document.title);
    };
  }, [count]);

  const setNotificationCount = useCallback(
    (newCount: number) => setCount(newCount),
    [],
  );

  return { setNotificationCount };
}
