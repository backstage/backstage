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

import { useRef } from 'react';

interface NavigationEntry {
  url: string | null;
  index: number;
}

interface NavigationAPI {
  currentEntry: NavigationEntry;
  entries(): NavigationEntry[];
}

function getEntryReferrer(entityBasePath: string): string | undefined {
  const nav = (window as any).navigation as NavigationAPI | undefined;
  if (!nav) {
    return undefined;
  }

  const entries = nav.entries();
  const currentIndex = nav.currentEntry.index;

  for (let i = currentIndex - 1; i >= 0; i--) {
    const entry = entries[i];
    if (!entry.url) {
      continue;
    }
    try {
      const parsed = new URL(entry.url);
      if (!parsed.pathname.startsWith(entityBasePath)) {
        return parsed.pathname + parsed.search + parsed.hash;
      }
    } catch {
      // skip malformed URLs
    }
  }

  return undefined;
}

/**
 * Returns the URL the user navigated from before arriving at the current
 * entity page. Uses the Navigation API to walk backward through the
 * session history and find the first entry whose path is outside the
 * current entity page's base path.
 *
 * The value is captured once on mount and remains stable across tab
 * switches within the entity page.
 *
 * Returns `undefined` when the Navigation API is unavailable or when
 * there is no qualifying previous entry (e.g. the user opened the
 * entity page directly).
 */
export function useEntryReferrer(entityBasePath: string): string | undefined {
  const referrerRef = useRef<string | undefined | null>(null);

  if (referrerRef.current === null) {
    referrerRef.current = getEntryReferrer(entityBasePath);
  }

  // Reset when navigating to a different entity page
  const basePathRef = useRef(entityBasePath);
  if (basePathRef.current !== entityBasePath) {
    basePathRef.current = entityBasePath;
    referrerRef.current = getEntryReferrer(entityBasePath);
  }

  return referrerRef.current;
}
