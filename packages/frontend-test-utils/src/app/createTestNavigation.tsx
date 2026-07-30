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

import { type ReactNode } from 'react';
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import type { RenderResult } from '@testing-library/react';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  createMemoryHistoryBackend,
  type HistoryBackend,
} from '../../../frontend-app-api/src/routing/HistoryBackend';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  createAppHistory,
  type AppHistory,
} from '../../../frontend-app-api/src/routing/AppHistory';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { RootHistoryRouter } from '../../../frontend-app-api/src/routing/RootHistoryRouter';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { getBasePath } from '../../../frontend-app-api/src/routing/getBasePath';
import { ConfigReader } from '@backstage/config';
import type { JsonObject } from '@backstage/types';

/**
 * Result of {@link renderInTestApp} / {@link renderTestApp}.
 *
 * @public
 */
export type TestAppRenderResult = RenderResult & {
  /**
   * Framework app history backed by in-memory history.
   * Prefer this (or `appHistoryApiRef`) over a root React Router for
   * asserting and driving navigation in tests.
   */
  navigationController: AppHistoryApi;
};

/**
 * Result of creating the shared test navigation stack.
 *
 * @internal
 */
export interface TestNavigation {
  controller: AppHistory;
  history: HistoryBackend;
  basename: string;
}

/**
 * Creates an AppHistory backed by in-memory history for test apps.
 *
 * When `basename` is set (from `app.baseUrl`), initial entries are app-relative
 * paths that are stored under the basename on the history backend — matching
 * production AppHistory behavior.
 *
 * @internal
 */
export function createTestNavigation(options?: {
  initialEntries?: string[];
  basename?: string;
  config?: JsonObject;
}): TestNavigation {
  const basename =
    options?.basename ??
    (options?.config
      ? getBasePath(
          ConfigReader.fromConfigs([{ context: 'test', data: options.config }]),
        )
      : '');

  const appRelativeEntries = options?.initialEntries?.length
    ? options.initialEntries
    : ['/'];
  const historyEntries = appRelativeEntries.map(entry => {
    if (!basename) {
      return entry;
    }
    const url = new URL(entry, 'http://localhost');
    return `${basename}${url.pathname}${url.search}${url.hash}`;
  });

  const history = createMemoryHistoryBackend({
    initialEntries: historyEntries,
  });
  const controller = createAppHistory({
    history,
    basename: basename || undefined,
  });
  return { controller, history, basename };
}

/**
 * Root React Router v6 projection of the app history for test apps.
 *
 * History authority remains the AppHistory — this does not own
 * `window.history` via push/replace.
 *
 * @internal
 */
export function TestAppRouter(props: {
  children: ReactNode;
  controller: AppHistory;
}) {
  const { children, controller } = props;
  return <RootHistoryRouter history={controller}>{children}</RootHistoryRouter>;
}
