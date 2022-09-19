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

/**
 * Props for {@link EntityRefLink}.
 *
 * @public
 */
export type EntityRefLinksProps = {
  entityRefs: (string | Entity | CompoundEntityRef)[];
  defaultKind?: string;
  getTitle?: (cer: CompoundEntityRef) => string;
} & Omit<LinkProps, 'to'>;

/**
 * Shows a list of clickable links to entities.
 *
 * @public
 */
export function EntityRefLinks(props: EntityRefLinksProps) {
  const { entityRefs, defaultKind, getTitle, ...linkProps } = props;
  return (
    <>
      {entityRefs.map((r, i) => {
        const isCompoundEntityRef =
          getTitle && typeof r !== 'string' && !('metadata' in r && getTitle);

        const title = isCompoundEntityRef
          ? getTitle(r as CompoundEntityRef)
          : undefined;

        return (
          <React.Fragment key={i}>
            {i > 0 && ', '}
            <EntityRefLink
              {...linkProps}
              entityRef={r}
              defaultKind={defaultKind}
              title={title}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
