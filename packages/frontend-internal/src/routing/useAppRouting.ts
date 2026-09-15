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

import { useMemo } from 'react';
import type {
  AppHistoryApi,
  AppNavigateOptions,
} from '@backstage/frontend-plugin-api';
import { createPath, resolveAppPath } from './AppRouting';
import { isExternalTarget } from './isExternalTarget';
import { usePageMountBasePaths } from './PageMountContext';
import { useAppHistoryLocation } from './useAppHistoryLocation';

/**
 * Binds href resolution and navigation to the consuming extension's route
 * ancestry. Both operations resolve the same logical destination before the
 * host history applies its deployment basename.
 */
export function useAppRouting(appHistory: AppHistoryApi | undefined) {
  const basePaths = usePageMountBasePaths();
  const location = useAppHistoryLocation(appHistory);
  return useMemo(() => {
    if (!appHistory || !location) {
      return undefined;
    }
    const resolveTo = (to: string) =>
      isExternalTarget(to)
        ? to
        : createPath(
            resolveAppPath(to, basePaths, appHistory.location.pathname),
          );
    return {
      location,
      createHref: (to: string) => appHistory.createHref(resolveTo(to)),
      navigate: (to: string, options?: AppNavigateOptions) =>
        appHistory.navigate(resolveTo(to), options),
    };
  }, [appHistory, basePaths, location]);
}
