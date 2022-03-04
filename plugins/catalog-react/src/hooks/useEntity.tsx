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
import {
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';
import React, { ReactNode } from 'react';

/** @public */
export type EntityLoadingStatus<TEntity extends Entity = Entity> = {
  entity?: TEntity;
  loading: boolean;
  error?: Error;
  refresh?: VoidFunction;
};

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
  // We provide both the old and the new context, since
  // consumers might be doing things like `useContext(EntityContext)`
  return (
    <NewEntityContext.Provider value={createVersionedValueMap({ 1: value })}>
      {children}
    </NewEntityContext.Provider>
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

/**
 * Grab the current entity from the context, throws if the entity has not yet been loaded
 * or is not available.
 *
 * @public
 */
export function useEntity<TEntity extends Entity = Entity>(): {
  entity: TEntity;
  /** @deprecated use {@link useAsyncEntity} instead */
  loading: boolean;
  /** @deprecated use {@link useAsyncEntity} instead */
  error?: Error;
  /** @deprecated use {@link useAsyncEntity} instead */
  refresh?: VoidFunction;
} {
  const versionedHolder =
    useVersionedContext<{ 1: EntityLoadingStatus }>('entity-context');

  if (!versionedHolder) {
    throw new Error('Entity context is not available');
  }

  const value = versionedHolder.atVersion(1);
  if (!value) {
    throw new Error('EntityContext v1 not available');
  }

  if (!value.entity) {
    // Once we have removed the additional fields from being returned we can drop this deprecation
    // and move to the error instead.
    // throw new Error('useEntity hook is being called outside of an EntityLayout where the entity has not been loaded. If this is intentional, please use useAsyncEntity instead.');

    // eslint-disable-next-line no-console
    console.warn(
      'DEPRECATION: useEntity hook is being called outside of an EntityLayout where the entity has not been loaded. If this is intentional, please use useAsyncEntity instead. This warning will be replaced with an error in future releases.',
    );
  }

  const { entity, loading, error, refresh } = value;
  return { entity: entity as TEntity, loading, error, refresh };
}

/**
 * Grab the current entity from the context, provides loading state and errors, and the ability to refresh.
 *
 * @public
 */
export function useAsyncEntity<
  TEntity extends Entity = Entity,
>(): EntityLoadingStatus<TEntity> {
  const versionedHolder =
    useVersionedContext<{ 1: EntityLoadingStatus }>('entity-context');

  if (!versionedHolder) {
    throw new Error('Entity context is not available');
  }
  const value = versionedHolder.atVersion(1);
  if (!value) {
    throw new Error('EntityContext v1 not available');
  }

  const { entity, loading, error, refresh } = value;
  return { entity: entity as TEntity, loading, error, refresh };
}
