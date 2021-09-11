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
import { Entity } from '@backstage/catalog-model';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import {
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';
import React, {
  ReactNode,
  useEffect,
  createContext,
  useContext,
  Provider,
  Context,
} from 'react';
import { useNavigate } from 'react-router';
import { useAsyncRetry } from 'react-use';
import { catalogApiRef } from '../api';
import { useEntityCompoundName } from './useEntityCompoundName';

type EntityLoadingStatus = {
  entity?: Entity;
  loading: boolean;
  error?: Error;
  refresh?: VoidFunction;
};

/**
 * @public
 * @deprecated use `useEntity` and `EntityProvider` or `AsyncEntityProvider` instead.
 */
export const EntityContext: Context<EntityLoadingStatus> =
  createContext<EntityLoadingStatus>({
    entity: undefined,
    loading: true,
    error: undefined,
    refresh: () => {},
  });
const OldEntityProvider = EntityContext.Provider;

// This context has support for multiple concurrent versions of this package.
// It is currently used in parallel with the old context in order to provide
// a smooth transition, but will eventually be the only context we use.
const NewEntityContext =
  createVersionedContext<{ 1: EntityLoadingStatus }>('entity-context');

/**
 * Properties for the AsyncEntityProvider component.
 *
 * @public
 */
export interface AsyncEntityProviderProps {
  children: ReactNode;
  entity?: Entity;
  loading: boolean;
  error?: Error;
  refresh?: VoidFunction;
}

/**
 * Provides a loaded entity to be picked up by the `useEntity` hook.
 *
 * @public
 */
export const AsyncEntityProvider = ({
  children,
  entity,
  loading,
  error,
  refresh,
}: AsyncEntityProviderProps) => {
  const value = { entity, loading, error, refresh };
  return (
    <OldEntityProvider value={value}>
      <NewEntityContext.Provider value={createVersionedValueMap({ 1: value })}>
        {children}
      </NewEntityContext.Provider>
    </OldEntityProvider>
  );
};

/**
 * Properties for the EntityProvider component.
 *
 * @public
 */
export interface EntityProviderProps {
  children: ReactNode;
  entity?: Entity;
}

/**
 * Provides an entity to be picked up by the `useEntity` hook.
 *
 * @public
 */
export const EntityProvider = ({ entity, children }: EntityProviderProps) => (
  <AsyncEntityProvider
    entity={entity}
    loading={!Boolean(entity)}
    error={undefined}
    refresh={undefined}
    children={children}
  />
);

// This is used for forwards compatibility with the new entity context
EntityContext.Provider =
  EntityProvider as unknown as Provider<EntityLoadingStatus>;

export const useEntityFromUrl = (): EntityLoadingStatus => {
  const { kind, namespace, name } = useEntityCompoundName();
  const navigate = useNavigate();
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);

  const {
    value: entity,
    error,
    loading,
    retry: refresh,
  } = useAsyncRetry(
    () => catalogApi.getEntityByName({ kind, namespace, name }),
    [catalogApi, kind, namespace, name],
  );

  useEffect(() => {
    if (!name) {
      errorApi.post(new Error('No name provided!'));
      navigate('/');
    }
  }, [errorApi, navigate, error, loading, entity, name]);

  return { entity, loading, error, refresh };
};

/**
 * Grab the current entity from the context and its current loading state.
 *
 * @public
 */
export function useEntity<T extends Entity = Entity>() {
  const versionedHolder =
    useVersionedContext<{ 1: EntityLoadingStatus }>('entity-context');
  const oldContextValue = useContext(EntityContext);

  if (!versionedHolder) {
    const { entity, loading, error, refresh } = oldContextValue;
    return { entity: entity as T, loading, error, refresh };

    // TODO(Rugvip): Throw this once we fully migrate to the new context
    // throw new Error(
    //   'Component can not be used outside of the context of an Entity',
    // );
  }

  const value = versionedHolder.atVersion(1);

  if (!value) {
    throw new Error('EntityContext v1 not available');
  }

  const { entity, loading, error, refresh } = value;
  return { entity: entity as T, loading, error, refresh };
}
