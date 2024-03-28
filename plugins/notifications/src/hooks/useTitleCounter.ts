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

/** @public */
export function useTitleCounter() {
  const [title, setTitle] = useState(document.title);
  const [count, setCount] = useState(0);

  const getPrefix = (value: number) => {
    return value === 0 ? '' : `(${value}) `;
  };

  const cleanTitle = (currentTitle: string) => {
    return currentTitle.replace(/^\(\d+\)\s/, '');
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const baseTitle = cleanTitle(title);
    setTitle(`${getPrefix(count)}${baseTitle}`);
    return () => {
      document.title = cleanTitle(title);
    };
  }, [title, count]);

  const titleElement = document.querySelector('title');
  if (titleElement) {
    new MutationObserver(() => {
      setTitle(document.title);
    }).observe(titleElement, {
      subtree: true,
      characterData: true,
      childList: true,
    });
  }

  const setNotificationCount = useCallback(
    (newCount: number) => setCount(newCount),
    [],
  );

  return { setNotificationCount };
}
