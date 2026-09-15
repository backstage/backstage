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

import { useVersionedContext } from '@backstage/version-bridge';
import type { BUIContextVersions } from './BUIContext';
import { isBrowserOwnedHref } from '../utils/linkUtils';

/**
 * Routing at the consuming BUI component's position in the app.
 *
 * @remarks
 * Returned by the host hook passed to {@link BUIProvider}. Resolution is a
 * normal function, so collections can resolve all their items in one render.
 * Both hrefs and the active pathname include the deployment basename.
 *
 * @public
 */
export type BUIRouter = {
  /** Navigates to an authored target using the same scope as resolveHref. */
  navigate: (href: string, options?: { replace?: boolean }) => void;
  /** Returns a browser-ready href, leaving external targets unchanged. */
  resolveHref: (href: string) => string;
  /** Current browser pathname, including any deployment basename. */
  pathname: string;
};

/** Returns the internal pathname of a resolved href, excluding query/hash. */
export function getBUIRouterPathname(href: string): string | undefined {
  if (isBrowserOwnedHref(href)) {
    return undefined;
  }
  try {
    return new URL(href, 'http://bui.local').pathname;
  } catch {
    return undefined;
  }
}

/** Returns the host hook, to be called at each consuming component's scope. */
export function useBUIRouter(): (() => BUIRouter) | undefined {
  return useVersionedContext<BUIContextVersions>('bui')?.atVersion(3)
    ?.useRouter;
}
