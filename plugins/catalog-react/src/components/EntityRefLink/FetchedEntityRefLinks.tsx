/*
 * Copyright 2022 The Backstage Authors
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
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import React from 'react';
import { EntityRefLink } from './EntityRefLink';
import { ErrorPanel, LinkProps, Progress } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';

/**
 * Props for {@link EntityRefLink}.
 *
 * @public
 */
export type FetchedEntityRefLinksProps<
  TRef extends string | CompoundEntityRef | Entity,
> = {
  defaultKind?: string;
  entityRefs: TRef[];
  fetchEntities: true;
  getTitle?(entity: Entity): string | undefined;
} & Omit<LinkProps, 'to'>;

/**
 * Shows a list of clickable links to entities with auto-fetching of entities
 * for customising a displayed text via title attribute.
 *
 * @public
 */
export function FetchedEntityRefLinks<
  TRef extends string | CompoundEntityRef | Entity,
>(props: FetchedEntityRefLinksProps<TRef>) {
  const { entityRefs, defaultKind, fetchEntities, getTitle, ...linkProps } =
    props;

  const catalogApi = useApi(catalogApiRef);

  const {
    value: refToEntity = new Map<TRef, Entity>(),
    loading,
    error,
  } = useAsync(
    () =>
      entityRefs.reduce(
        async (promisedAcc: Promise<Map<TRef, Entity>>, entityRef: TRef) => {
          const acc = await promisedAcc;
          const entity: Entity | undefined =
            'metadata' in entityRef
              ? (entityRef as Entity)
              : await catalogApi.getEntityByRef(
                  entityRef as string | CompoundEntityRef,
                );
          if (entity) {
            acc.set(entityRef, entity);
          }
          return acc;
        },
        Promise.resolve(new Map<TRef, Entity>()),
      ),
    [catalogApi, entityRefs],
  );

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <>
        <ErrorPanel error={error} />
      </>
    );
  }

  return (
    <>
      {entityRefs.map((r: TRef, i) => {
        let title: string | undefined;

        if (typeof r === 'string' || !('metadata' in r)) {
          const entity = refToEntity.get(r);
          title = getTitle && entity ? getTitle(entity) : undefined;
        } else {
          title = getTitle ? getTitle(r as Entity) : undefined;
        }

        return (
          <React.Fragment key={i}>
            {i > 0 && ', '}
            <EntityRefLink
              {...linkProps}
              defaultKind={defaultKind}
              entityRef={r}
              title={title}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
