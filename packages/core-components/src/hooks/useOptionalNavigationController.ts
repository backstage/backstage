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

import { useContext } from 'react';
import { useApiHolder } from '@backstage/core-plugin-api';
import {
  navigationControllerApiRef,
  RoutingContractContext,
  type NavigationControllerApi,
  type RoutingContract,
} from '@backstage/frontend-plugin-api';

/**
 * Returns the framework navigation controller when the new frontend system
 * has registered one, and `undefined` otherwise (old frontend system apps,
 * or isolated tests without a navigation controller).
 *
 * Chrome (`Link`, sidebar active-state, `ErrorPage`, ...) uses this to prefer
 * framework navigation/location when available while keeping React Router
 * based behavior unchanged when it isn't.
 *
 * @internal
 */
export function useOptionalNavigationController():
  | NavigationControllerApi
  | undefined {
  return useApiHolder().get(navigationControllerApiRef);
}

/**
 * Returns the {@link RoutingContract} for the current page scope, if any is
 * in context.
 *
 * @internal
 */
export function useOptionalRoutingContract(): RoutingContract | undefined {
  return useContext(RoutingContractContext);
}
