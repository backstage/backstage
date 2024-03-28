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
  useState,
} from 'react';
import { catalogApiRef } from '../api';
import useAsync from 'react-use/lib/useAsync';
import {
  ComponentEntityV1alpha1,
  EnvironmentEntityV1alpha1,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useEntity } from './useEntity';

/**
 * @public
 */
export type EntityEnvironmentContextProps = {
  environments?: EnvironmentEntityV1alpha1[];
  environment?: EnvironmentEntityV1alpha1;
  setEnvironment: (environment: EnvironmentEntityV1alpha1 | undefined) => void;
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
  const [environment, setEnvironment] = useState<
    EnvironmentEntityV1alpha1 | undefined
  >();

  const {
    loading,
    error,
    value: environments,
  } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: [{ kind: 'Environment' }],
    });
    const items = response.items as EnvironmentEntityV1alpha1[];
    if (items.length) {
      setEnvironment(items[0]);
    }
    return items;
  }, [catalogApi]);

  const value = useMemo(
    () => ({
      environments,
      environment,
      setEnvironment,
      loading,
      error,
    }),
    [environments, loading, error, environment, setEnvironment],
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

/**
 * @param annotation - the annotation key to retrieve by context
 * @public
 */
export const useEntityAnnotation = (annotation: string) => {
  const { entity } = useEntity();
  const { environment } = useEntityEnvironment();

  if (!environment) return entity.metadata.annotations?.[annotation] ?? '';

  const environmentRef = stringifyEntityRef(environment);
  if (entity.kind === 'Component') {
    const component = entity as ComponentEntityV1alpha1;
    const environmentOverride =
      component.spec.environmentOverrides?.[environmentRef];
    if (environmentOverride && environmentOverride.annotations[annotation]) {
      return environmentOverride.annotations[annotation] ?? '';
    }
  }
  return entity.metadata.annotations?.annotation ?? '';
};
