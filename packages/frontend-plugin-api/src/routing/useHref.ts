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

import { useHref as useReactRouterHref } from 'react-router-dom';
import { useApiHolder } from '../apis/system';
import { appHistoryApiRef } from './AppHistoryApi';

/**
 * Resolves an app-relative path to a browser-ready href (including the app's
 * deploy basename), the react-aria-style counterpart to {@link useAppNavigate}.
 *
 * Falls back to React Router's `useHref` when no {@link appHistoryApiRef} is
 * registered (old frontend system).
 *
 * @public
 */
export function useHref(to: string): string {
  const appHistory = useApiHolder().get(appHistoryApiRef);
  // Called unconditionally so this hook works the same under both frontend
  // systems — mirrors the useAppNavigate fallback pattern.
  const reactRouterHref = useReactRouterHref(to);
  return appHistory ? appHistory.createHref(to) : reactRouterHref;
}
