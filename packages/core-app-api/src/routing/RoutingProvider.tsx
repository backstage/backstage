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

import React, { ReactNode } from 'react';
import {
  ExternalRouteRef,
  RouteRef,
  SubRouteRef,
} from '@backstage/core-plugin-api';
import {
  createVersionedValueMap,
  createVersionedContext,
} from '@backstage/version-bridge';
import { RouteResolver } from './RouteResolver';
import { BackstageRouteObject } from './types';

const RoutingContext = createVersionedContext<{ 1: RouteResolver }>(
  'routing-context',
);

type ProviderProps = {
  routePaths: Map<RouteRef, string>;
  routeParents: Map<RouteRef, RouteRef | undefined>;
  routeObjects: BackstageRouteObject[];
  routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>;
  basePath?: string;
  children: ReactNode;
};

export const RoutingProvider = ({
  routePaths,
  routeParents,
  routeObjects,
  routeBindings,
  basePath = '',
  children,
}: ProviderProps) => {
  const resolver = new RouteResolver(
    routePaths,
    routeParents,
    routeObjects,
    routeBindings,
    basePath,
  );

  const versionedValue = createVersionedValueMap({ 1: resolver });
  return (
    <RoutingContext.Provider value={versionedValue}>
      {children}
    </RoutingContext.Provider>
  );
};
