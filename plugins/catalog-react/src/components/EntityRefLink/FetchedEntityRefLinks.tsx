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
import {
  Entity,
  CompoundEntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';
import React from 'react';
import { EntityRefLink } from './EntityRefLink';
import { ErrorPanel, LinkProps, Progress } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';

/**
 * Props for {@link FetchedEntityRefLinks}.
 *
 * @public
 */
export type FetchedEntityRefLinksProps<
  TRef extends string | CompoundEntityRef | Entity,
> = {
  defaultKind?: string;
  entityRefs: TRef[];
  getTitle(entity: Entity): string | undefined;
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
  const { entityRefs, defaultKind, getTitle, ...linkProps } = props;

  const catalogApi = useApi(catalogApiRef);

  const {
    value: entities = new Array<Entity>(),
    loading,
    error,
  } = useAsync(async () => {
    const refs = entityRefs.reduce((acc, current) => {
      return 'metadata' in current ? acc : [...acc, parseEntityRef(current)];
    }, new Array<CompoundEntityRef>());

    const pureEntities = entityRefs.filter(
      ref => 'metadata' in ref,
    ) as Array<Entity>;

    return refs.length > 0
      ? [
          ...(
            await catalogApi.getEntities({
              filter: refs.map(ref => ({
                kind: ref.kind,
                'metadata.namespace': ref.namespace,
                'metadata.name': ref.name,
              })),
            })
          ).items,
          ...pureEntities,
        ]
      : pureEntities;
  }, [entityRefs]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  return (
    <>
      {entities.map((r: Entity, i) => {
        return (
          <React.Fragment key={i}>
            {i > 0 && ', '}
            <EntityRefLink
              {...linkProps}
              defaultKind={defaultKind}
              entityRef={r}
              title={getTitle(r as Entity)}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
