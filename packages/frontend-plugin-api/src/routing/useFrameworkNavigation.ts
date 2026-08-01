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

import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';
import type { FrameworkNavigateOptions } from './FrameworkLocation';

/**
 * Returns a navigate function backed by the framework's app history, or
 * `undefined` when no app history is registered (old frontend system / OFS).
 *
 * Not exported from the package: {@link useAppNavigate} is the supported
 * entry point and applies the React Router fallback for you. App shell code
 * that genuinely needs the optional navigate itself should read
 * {@link appHistoryApiRef} from the API holder directly.
 *
 * @internal
 */
export function useOptionalFrameworkNavigate():
  | ((path: string, options?: FrameworkNavigateOptions) => void)
  | undefined {
  const appHistory = useApiHolder().get(appHistoryApiRef);
  const navigate = useCallback(
    (path: string, options?: FrameworkNavigateOptions) => {
      appHistory?.navigate(path, options);
    },
    [appHistory],
  );
  return appHistory ? navigate : undefined;
}

/**
 * Navigate using the framework's app history when registered, otherwise
 * React Router's `useNavigate`.
 *
 * Prefer this in shared plugin code that must run under both the new and old
 * frontend systems. Paths should be app-absolute (basename-stripped).
 *
 * The react-aria-style counterpart to this hook is {@link useHref}.
 *
 * @public
 */
export function useAppNavigate(): (
  path: string,
  options?: FrameworkNavigateOptions,
) => void {
  const frameworkNavigate = useOptionalFrameworkNavigate();
  const reactRouterNavigate = useNavigate();
  return useMemo(
    () =>
      frameworkNavigate ??
      ((to: string, options?: FrameworkNavigateOptions) => {
        if (options) {
          reactRouterNavigate(to, options);
        } else {
          reactRouterNavigate(to);
        }
      }),
    [frameworkNavigate, reactRouterNavigate],
  );
}
