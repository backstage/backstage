/*
 * Copyright 2020 The Backstage Authors
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

import {
  RouteRef,
  SubRouteRef,
  ExternalRouteRef,
} from '@backstage/core-plugin-api';
import { AppOptions, AppRouteBinder } from './types';

export function resolveRouteBindings(bindRoutes: AppOptions['bindRoutes']) {
  const result = new Map<ExternalRouteRef, RouteRef | SubRouteRef>();

  if (bindRoutes) {
    const bind: AppRouteBinder = (
      externalRoutes,
      targetRoutes: { [name: string]: RouteRef | SubRouteRef },
    ) => {
      for (const [key, value] of Object.entries(targetRoutes)) {
        const externalRoute = externalRoutes[key];
        if (!externalRoute) {
          throw new Error(`Key ${key} is not an existing external route`);
        }
        if (!value && !externalRoute.optional) {
          throw new Error(
            `External route ${key} is required but was undefined`,
          );
        }
        if (value) {
          result.set(externalRoute, value);
        }
      }
    };
    bindRoutes({ bind });
  }

  return result;
}
