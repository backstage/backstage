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
 * Supplies a React Router context for app chrome that uses react-router APIs
 * (`useResolvedPath`, relative `Link` targets, old frontend system trees).
 * The app history remains the history authority — this never owns
 * `window.history` via push/replace.
 *
 * New chrome should read the app history directly instead — `appHistoryApiRef`
 * for the live location, and `RouteLink` / `useNavigateRouteRef` for
 * navigation — so that this projection can eventually be dropped. Chrome that
 * still has to work under both frontend systems goes through the `useApp*`
 * helpers in `@internal/frontend`, which pick the authority for it.
 *
 * Target removal of this compatibility projection by August 2027. Remove it
 * once all first-party new frontend system chrome runs without an ambient
 * React Router context, routerless conformance tests cover that behavior, and
 * dependency enforcement prevents new React Router v6 imports in that chrome.
 * If those gates are not met by August 2027, re-evaluate the remaining
 * dependencies and set a new removal target.
 */
export function RootReactRouterV6(props: { children: ReactNode }) {
  const { children } = props;
  const appHistory = useApi(appHistoryApiRef);

  return <RootHistoryRouter history={appHistory}>{children}</RootHistoryRouter>;
}
