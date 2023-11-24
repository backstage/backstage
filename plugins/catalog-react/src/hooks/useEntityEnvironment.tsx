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
import { useApi } from '@backstage/core-plugin-api';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { catalogApiRef } from '../api';
import useAsync from 'react-use/lib/useAsync';
import {
  ComponentEntityV1alpha1,
  Entity,
  EnvironmentEntityV1alpha1,
} from '@backstage/catalog-model';

type EntityEnvironmentContextProps = {
  environments?: EnvironmentEntityV1alpha1[];
  loading: boolean;
  error?: Error;
};

/**
 * Creates new context for entity listing and filtering.
 * @public
 */
export const EntityEnvironmentContext = createContext<
  EntityEnvironmentContextProps | undefined
>(undefined);

/**
 * Provides entities and filters for a catalog listing.
 * @public
 */
export const EntityEnvironmentProvider = (props: PropsWithChildren<{}>) => {
  const catalogApi = useApi(catalogApiRef);

  const {
    loading,
    error,
    value: environments,
  } = useAsync(async () => {
    return (
      await catalogApi.getEntities({
        filter: [{ kind: 'Environment' }],
      })
    ).items as EnvironmentEntityV1alpha1[];
  }, [catalogApi]);

  const value = useMemo(
    () => ({
      environments,
      loading,
      error,
    }),
    [environments, loading, error],
  );

  return (
    <EntityEnvironmentContext.Provider value={value}>
      {props.children}
    </EntityEnvironmentContext.Provider>
  );
};

/**
 * Hook for interacting with the entity list context provided by the {@link EntityEnvironmentProvider}.
 * @public
 */
export function useEntityEnvironment(): EntityEnvironmentContextProps {
  const context = useContext(EntityEnvironmentContext);
  if (!context)
    throw new Error(
      'useEntityEnvironment must be used within EntityEnvironmentContext',
    );
  return context;
}

export const resolveAnnotationForEnvironment = (
  entity: Entity,
  environment: string,
  annotation: string,
) => {
  if (entity.kind === 'Component') {
    const component = entity as ComponentEntityV1alpha1;
    const environmentOverride =
      component.spec.environmentOverrides?.[environment];
    if (environmentOverride && environmentOverride.annotations[annotation]) {
      return environmentOverride.annotations[annotation];
    }
  }
  return entity.metadata.annotations?.annotation;
};
