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

import type { ReactNode } from 'react';
import { RouterProvider } from 'react-aria-components';
import { useNavigate, useHref } from 'react-router-dom';

/**
 * Provides React Aria's RouterProvider for client-side navigation.
 * Must be rendered within a React Router context.
 *
 * @public
 */
export function BUIRouterProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      {children}
    </RouterProvider>
  );
}
