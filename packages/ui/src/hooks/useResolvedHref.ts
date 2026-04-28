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

import { useHref, useInRouterContext } from 'react-router-dom';
import { isExternalLink } from '../utils/linkUtils';

/**
 * Resolves an href for rendering. External URLs are returned unchanged;
 * internal paths are resolved through react-router's useHref so they
 * respect the current basename and route context.
 *
 * @internal
 */
export function useResolvedHref(href: string): string;
export function useResolvedHref(href: string | undefined): string | undefined;
export function useResolvedHref(href: string | undefined): string | undefined {
  const hasRouter = useInRouterContext();
  // useHref throws outside a Router, so we guard with useInRouterContext.
  // The guard is safe because a component's router context does not
  // change during its lifetime, keeping the hook call count stable.
  if (!hasRouter) {
    return href;
  }
  const resolved = useHref(href ?? '');
  if (!href || isExternalLink(href)) {
    return href;
  }
  return resolved;
}
