/*
 * Copyright 2023 The Backstage Authors
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

import { RouteRef } from '@backstage/core-plugin-api';
import React, { createContext, ReactNode } from 'react';

export interface RoutingContextType {
  resolve(
    routeRef: RouteRef,
    options: { pathname: string },
  ): (() => string) | undefined;
}

export const RoutingContext = createContext<RoutingContextType>({
  resolve: () => () => '',
});

export class RouteResolver {
  constructor(private readonly routePaths: Map<RouteRef, string>) {}

  resolve(anyRouteRef: RouteRef<{}>): (() => string) | undefined {
    const basePath = this.routePaths.get(anyRouteRef);
    if (!basePath) {
      return undefined;
    }
    return () => basePath;
  }
}

export function RoutingProvider(props: {
  routePaths: Map<RouteRef, string>;
  children?: ReactNode;
}) {
  return (
    <RoutingContext.Provider value={new RouteResolver(props.routePaths)}>
      {props.children}
    </RoutingContext.Provider>
  );
}
