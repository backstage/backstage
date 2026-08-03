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

import { createContext, useContext } from 'react';
import { useHref, useInRouterContext } from 'react-router-dom';
import { isExternalLink, sanitizeHref } from '../utils/linkUtils';

/**
 * Whether a resolver the host app injected into `BUIProvider` is the authority
 * for every href rendered below it.
 *
 * A target is resolved once, and this is what says by whom. react-aria calls
 * the injected resolver at each anchor's own position, where it can still tell
 * which page the target was written in and can apply the app's deploy
 * basename. react-router resolves against the context it is asked from, which
 * for page chrome is the app root rather than the page. Only one of them may
 * run: a fragment-only or relative target react-router has already resolved
 * against the root has lost the page, and nothing downstream can put it back.
 *
 * @internal
 */
export const InjectedHrefResolverContext = createContext(false);

/**
 * Whether the surrounding `BUIProvider` was given a `useHref` that governs the
 * rendered href — see {@link InjectedHrefResolverContext}.
 *
 * @internal
 */
export function useHasInjectedHrefResolver(): boolean {
  return useContext(InjectedHrefResolverContext);
}

/**
 * Resolves an href for rendering. External URLs are returned unchanged;
 * internal paths are resolved through react-router's useHref so they
 * respect the current basename and route context.
 *
 * Hrefs a browser would execute rather than navigate to are made inert first.
 * `useDefinition` already does this for every BUI component, so in practice
 * this only bites for hrefs that arrive some other way — `BUIProvider` hands
 * this hook to react-aria's `RouterProvider` as its `useHref`, which is a path
 * into the DOM that does not pass through a component definition.
 *
 * @internal
 */
export function useResolvedHref(href: string): string;
export function useResolvedHref(href: string | undefined): string | undefined;
export function useResolvedHref(href: string | undefined): string | undefined {
  const safeHref = sanitizeHref(href);
  const hasRouter = useInRouterContext();
  // useHref throws outside a Router, so we guard with useInRouterContext.
  // The guard is safe because a component's router context does not
  // change during its lifetime, keeping the hook call count stable.
  if (!hasRouter) {
    return safeHref;
  }
  const resolved = useHref(safeHref ?? '');
  if (!safeHref || isExternalLink(safeHref)) {
    return safeHref;
  }
  return resolved;
}
