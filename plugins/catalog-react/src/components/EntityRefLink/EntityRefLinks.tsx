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
import { LinkProps } from '@backstage/core-components';
import { FetchedEntityRefLinks } from './FetchedEntityRefLinks';

/**
 * Props for {@link EntityRefLink}.
 *
 * @public
 */
export type EntityRefLinksProps<
  TRef extends string | CompoundEntityRef | Entity,
> = (
  | {
      defaultKind?: string;
      entityRefs: TRef[];
      fetchEntities?: false;
      getTitle?(entity: TRef): string | undefined;
    }
  | {
      defaultKind?: string;
      entityRefs: TRef[];
      fetchEntities: true;
      getTitle(entity: Entity): string | undefined;
    }
) &
  Omit<LinkProps, 'to'>;

/**
 * Shows a list of clickable links to entities.
 *
 * @public
 */
export function EntityRefLinks<
  TRef extends string | CompoundEntityRef | Entity,
>(props: EntityRefLinksProps<TRef>) {
  const { entityRefs, defaultKind, fetchEntities, getTitle, ...linkProps } =
    props;

  if (fetchEntities) {
    return (
      <FetchedEntityRefLinks
        {...linkProps}
        defaultKind={defaultKind}
        entityRefs={entityRefs}
        getTitle={getTitle}
      />
    );
  }

  return (
    <>
      {entityRefs.map((r: TRef, i: number) => {
        return (
          <React.Fragment key={i}>
            {i > 0 && ', '}
            <EntityRefLink
              {...linkProps}
              defaultKind={defaultKind}
              entityRef={r}
              title={getTitle ? getTitle(r) : undefined}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
