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

import { ReactNode } from 'react';
import { appHistoryApiRef, useApi } from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { RootHistoryRouter } from '../../../../packages/frontend-app-api/src/routing/RootHistoryRouter';

/**
 * Root-level React Router v6 projection of the app history.
 *
 * Residual: supplies RR context for chrome that still needs react-router APIs
 * (`useResolvedPath`, relative `Link` targets, OFS-compatible trees). History
 * authority remains the AppHistory — this never owns `window.history` via
 * push/replace.
 *
 * Prefer framework location/nav for new chrome (`useFrameworkLocation`,
 * `useChromePathname`, `RouteLink`, `useNavigateRouteRef`). Remove this
 * projection once remaining chrome no longer requires a root RR context.
 */
export function RootReactRouterV6(props: { children: ReactNode }) {
  const { children } = props;
  const appHistory = useApi(appHistoryApiRef);

  return <RootHistoryRouter history={appHistory}>{children}</RootHistoryRouter>;
}
