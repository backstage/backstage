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

import { useContext, useMemo, type ReactNode } from 'react';
import { useApi } from '../apis';
import { navigationControllerApiRef } from './NavigationControllerApi';
import { RoutingContractContext } from './RoutingContractContext';
import { joinRouteDescriptorPaths } from './routeDescriptorPath';

/**
 * Props for {@link NestedRoutingContractProvider}.
 *
 * @alpha
 */
export interface NestedRoutingContractProviderProps {
  /** Relative path of the nested scope beneath the parent contract. */
  subPath: string;
  children: ReactNode;
}

/**
 * Mints a child routing contract scoped to `subPath` beneath the
 * current routing contract context, and provides it to `children`.
 *
 * Shared by page router adapter compilers (e.g. React Router, TanStack
 * Router) so every adapter derives the same nested contract identity from
 * the same parent contract and route-descriptor sub-path.
 *
 * Renders `children` unchanged when there is no parent contract to nest
 * under (e.g. outside a `PageBlueprint` router).
 *
 * @alpha
 */
export function NestedRoutingContractProvider(
  props: NestedRoutingContractProviderProps,
) {
  const { subPath, children } = props;
  const parentContract = useContext(RoutingContractContext);
  const navigationController = useApi(navigationControllerApiRef);

  const childContract = useMemo(() => {
    if (!parentContract) {
      return undefined;
    }
    const parentPattern =
      parentContract.routePattern ?? parentContract.basePath;
    const childBasePath = joinRouteDescriptorPaths(
      parentContract.basePath,
      subPath,
    );
    const childRoutePattern = joinRouteDescriptorPaths(parentPattern, subPath);
    return navigationController.createContract(childBasePath, {
      routePattern: childRoutePattern,
    });
  }, [parentContract, navigationController, subPath]);

  if (!childContract) {
    return <>{children}</>;
  }

  return (
    <RoutingContractContext.Provider value={childContract}>
      {children}
    </RoutingContractContext.Provider>
  );
}
