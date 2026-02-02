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
  MockMemoryRouterApi,
  MockMemoryRouterApiOptions,
} from '../apis/RouterApi';
import { routerApiRef } from '@backstage/frontend-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';

/**
 * Props for TestMemoryRouterProvider.
 * @public
 */
export interface TestMemoryRouterProviderProps
  extends MockMemoryRouterApiOptions {
  /** Children to render within the router context */
  children: ReactNode;
}

/**
 * A Backstage router and provider for testing that uses MemoryRouter from React Router v6.
 *
 * @public
 */
export const TestMemoryRouterProvider = ({
  children,
  initialEntries,
  initialIndex,
}: TestMemoryRouterProviderProps) => {
  const mockRouterApi = useMemo(
    () => new MockMemoryRouterApi({ initialEntries, initialIndex }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(initialEntries), initialIndex],
  );

  const { Router } = mockRouterApi;

  return (
    <TestApiProvider apis={[[routerApiRef, mockRouterApi]]}>
      <Router basePath="">{children}</Router>
    </TestApiProvider>
  );
};
