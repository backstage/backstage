/*
 * Copyright 2022 The Backstage Authors
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

import { useLocation } from 'react-use';

const removeTrailingSlash = (path: string) =>
  path === '/' ? '/' : path.replace(/\/+$/g, '');
const cleanSearch = (search: string) => (search === '?' ? '' : search);
const cleanHash = (hash: string) => (hash === '#' ? '' : hash);

export function useCleanPath(url: string): string {
  try {
    const location = new URL(url, window.origin);
    return (
      removeTrailingSlash(location.pathname) +
      cleanSearch(location.search) +
      cleanHash(location.hash)
    );
  } catch (_err) {
    return url;
  }
}

// Works inside and outside a <Router> context
function useSafeLocation(): Required<ReturnType<typeof useLocation>> | URL {
  const location = useLocation();
  if (typeof location.pathname === 'string') {
    return location as Required<ReturnType<typeof useLocation>>;
  }
  const url = new URL(window.location.toString());
  return url;
}

export function useCurrentCleanPath(): string {
  const location = useSafeLocation();
  return (
    removeTrailingSlash(location.pathname) +
    cleanSearch(location.search) +
    cleanHash(location.hash)
  );
}
