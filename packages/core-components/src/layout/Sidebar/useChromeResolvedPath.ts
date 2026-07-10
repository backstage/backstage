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

import { resolvePath, type Path, type To } from 'react-router-dom';
import { useChromePathname } from './useChromePathname';

function toPathname(to: To): string {
  if (typeof to === 'string') {
    return to;
  }
  return to.pathname ?? '';
}

/**
 * Resolves a chrome link target for active-state matching.
 *
 * Absolute paths are returned as plain resolved strings (no React Router).
 * Relative paths resolve against {@link useChromePathname} so NFS chrome
 * without a root RR projection still works; OFS keeps working via the
 * pathname fallback inside `useChromePathname`.
 *
 * @internal
 */
export function useChromeResolvedPath(to: To): Path {
  const pathname = toPathname(to);
  const chromePathname = useChromePathname();

  if (pathname.startsWith('/')) {
    return resolvePath(to);
  }
  return resolvePath(to, chromePathname);
}
