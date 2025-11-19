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

import { useVersionedContext } from '@backstage/version-bridge';
import { RoutingContextType } from './RoutingContext';

/**
 * Hook to access the routing context.
 *
 * Returns an object with static components (Route, Routes, Link, Outlet) and
 * lazy hooks (useLocation, useParams, useNavigate). Only components that call
 * the lazy hooks will rerender when the underlying values change.
 *
 * @example
 * ```tsx
 * // Static values - never cause rerenders
 * const { Link, Route, Routes } = useRouting();
 *
 * // Lazy hooks - only rerender when called
 * const { useLocation, useParams, useNavigate } = useRouting();
 * const location = useLocation(); // Only this component rerenders on location change
 * const params = useParams();     // Only this component rerenders on params change
 * const navigate = useNavigate(); // Stable function, doesn't cause rerenders
 * ```
 *
 * @public
 */
export function useRouting(): RoutingContextType {
  const versionedContext = useVersionedContext<{ 1: RoutingContextType }>(
    'frontend-routing-context',
  );
  const context = versionedContext?.atVersion(1);
  if (!context) {
    throw new Error('useRouting must be used within a RoutingProvider');
  }
  return context;
}
