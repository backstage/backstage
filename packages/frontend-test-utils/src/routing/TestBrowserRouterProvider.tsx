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

import { useMemo, ReactNode } from 'react';
import {
  MockBrowserRouterApi,
  MockBrowserRouterApiOptions,
} from '../apis/RouterApi';
import { routerApiRef } from '@backstage/frontend-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';

/**
 * Props for TestBrowserRouterProvider.
 * @public
 */
export interface TestBrowserRouterProviderProps
  extends MockBrowserRouterApiOptions {
  /** Children to render within the router context */
  children: ReactNode;
}

/**
 * A Backstage router and provider for testing that uses BrowserRouter from React Router v6.
 *
 * Use this when tests require real browser history APIs such as
 * `window.location`, `window.history.pushState()`, or `window.history.back()`.
 *
 * Tests using this provider should reset URL state in `beforeEach`/`afterEach`
 * to avoid test pollution, as browser history is global state.
 *
 * @public
 */
export const TestBrowserRouterProvider = ({
  children,
  basePath,
}: TestBrowserRouterProviderProps) => {
  const mockRouterApi = useMemo(
    () => new MockBrowserRouterApi({ basePath }),
    [basePath],
  );

  const { Router } = mockRouterApi;

  return (
    <TestApiProvider apis={[[routerApiRef, mockRouterApi]]}>
      <Router basePath="">{children}</Router>
    </TestApiProvider>
  );
};
