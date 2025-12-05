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

import { useApi, routerApiRef } from '../apis';
import type { Location, To, Path, NavigateFunction } from './routerTypes';

/**
 * Returns the current location object.
 *
 * @example
 * ```tsx
 * const location = useLocation();
 * console.log(location.pathname); // "/users/123"
 * ```
 *
 * @public
 */
export function useLocation(): Location {
  const routerApi = useApi(routerApiRef);
  return routerApi.useLocation();
}

/**
 * Returns the current URL parameters as an object.
 *
 * @example
 * ```tsx
 * // For route "/users/:id"
 * const { id } = useParams();
 * ```
 *
 * @public
 */
export function useParams<
  T extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
>(): T {
  const routerApi = useApi(routerApiRef);
  return routerApi.useParams<T>();
}

/**
 * Returns a function to navigate programmatically.
 *
 * @example
 * ```tsx
 * const navigate = useNavigate();
 * navigate('/home');
 * navigate('/login', { replace: true });
 * navigate(-1); // Go back
 * ```
 *
 * @public
 */
export function useNavigate(): NavigateFunction {
  const routerApi = useApi(routerApiRef);
  return routerApi.useNavigate();
}

/**
 * Returns the current search params and a function to update them.
 *
 * @example
 * ```tsx
 * const [searchParams, setSearchParams] = useSearchParams();
 * const query = searchParams.get('q');
 * setSearchParams({ q: 'new query' });
 * ```
 *
 * @public
 */
export function useSearchParams(): [
  URLSearchParams,
  (
    nextInit: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
    navigateOptions?: { replace?: boolean; state?: unknown },
  ) => void,
] {
  const routerApi = useApi(routerApiRef);
  return routerApi.useSearchParams();
}

/**
 * Resolves a relative path against the current location.
 *
 * @example
 * ```tsx
 * const resolved = useResolvedPath('../settings');
 * ```
 *
 * @public
 */
export function useResolvedPath(to: To): Path {
  const routerApi = useApi(routerApiRef);
  return routerApi.useResolvedPath(to);
}

/**
 * Returns the href string for a given destination.
 *
 * @example
 * ```tsx
 * const href = useHref('/about');
 * ```
 *
 * @public
 */
export function useHref(to: To): string {
  const routerApi = useApi(routerApiRef);
  return routerApi.useHref(to);
}
