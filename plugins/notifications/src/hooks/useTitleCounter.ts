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
import throttle from 'lodash/throttle';

const getPrefix = (value: number) => (value === 0 ? '' : `(${value}) `);

const cleanTitle = (currentTitle: string) =>
  currentTitle.replace(/^\(\d+\)\s/, '');

const throttledSetTitle = throttle((shownTitle: string) => {
  document.title = shownTitle;
}, 100);

/** @internal */
export function useTitleCounter() {
  const [title, setTitle] = useState(document.title);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const baseTitle = cleanTitle(title);
    const shownTitle = `${getPrefix(count)}${baseTitle}`;
    if (document.title !== shownTitle) {
      throttledSetTitle(shownTitle);
    }
    return () => {
      document.title = cleanTitle(title);
    };
  }, [count, title]);

  useEffect(() => {
    const titleElement = document.querySelector('title');
    let observer: MutationObserver | undefined;
    if (titleElement) {
      observer = new MutationObserver(mutations => {
        if (mutations?.[0]?.target?.textContent) {
          setTitle(mutations[0].target.textContent);
        }
      });
      observer.observe(titleElement, {
        characterData: true,
        childList: true,
      });
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const setNotificationCount = useCallback(
    (newCount: number) => setCount(newCount),
    [],
  );

  return { setNotificationCount };
}
