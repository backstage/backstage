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

import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import type { RenderResult } from '@testing-library/react';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createMemoryHistoryBackend } from '../../../frontend-app-api/src/routing/HistoryBackend';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { createAppHistory } from '../../../frontend-app-api/src/routing/AppHistory';
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
   * The app history backed by in-memory history. Use this to drive and assert
   * on navigation in tests.
   */
  appHistory: AppHistoryApi;
};

/**
 * Creates an AppHistory backed by in-memory history for test apps.
 *
 * When `app.baseUrl` includes a basename, initial entries are app-relative
 * paths that are stored under the basename on the history backend — matching
 * production AppHistory behavior.
 *
 * @internal
 */
export function createTestNavigation(options?: {
  initialEntries?: string[];
  config?: JsonObject;
}): AppHistoryApi {
  const basename = options?.config
    ? getBasePath(
        ConfigReader.fromConfigs([{ context: 'test', data: options.config }]),
      )
    : '';

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
  return createAppHistory({
    history,
    basename: basename || undefined,
  });
}
