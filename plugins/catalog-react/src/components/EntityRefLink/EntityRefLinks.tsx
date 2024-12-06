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
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Fragment } from 'react';
import { EntityRefLink } from './EntityRefLink';
import { LinkProps } from '@backstage/core-components';

/**
 * Props for {@link EntityRefLink}.
 *
 * @public
 */
export type EntityRefLinksProps<
  TRef extends string | CompoundEntityRef | Entity,
> = {
  defaultKind?: string;
  entityRefs: TRef[];
  hideIcons?: boolean;
  /** @deprecated This option is no longer used; presentation is handled by entityPresentationApiRef instead */
  fetchEntities?: boolean;
  /** @deprecated This option is no longer used; presentation is handled by entityPresentationApiRef instead */
  getTitle?(entity: TRef): string | undefined;
} & Omit<LinkProps, 'to'>;

/**
 * Shows a list of clickable links to entities.
 *
 * @public
 */
export function EntityRefLinks<
  TRef extends string | CompoundEntityRef | Entity,
>(props: EntityRefLinksProps<TRef>) {
  const { entityRefs, hideIcons, ...linkProps } = props;

  return (
    <>
      {entityRefs.map((r: TRef, i: number) => {
        const entityRefString =
          typeof r === 'string' ? r : stringifyEntityRef(r);
        return (
          <Fragment key={`${i}.${entityRefString}`}>
            {i > 0 && ', '}
            <EntityRefLink {...linkProps} entityRef={r} hideIcon={hideIcons} />
          </Fragment>
        );
      })}
    </>
  );
}
