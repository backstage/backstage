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

import {
  Entity,
  CompoundEntityRef,
  DEFAULT_NAMESPACE,
  parseEntityRef,
} from '@backstage/catalog-model';
import React, { forwardRef } from 'react';
import { entityRouteRef } from '../../routes';
import { humanizeEntityRef } from './humanize';
import { Link, LinkProps } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { Tooltip } from '@material-ui/core';

/**
 * Props for {@link EntityRefLink}.
 *
 * @public
 */
export type EntityRefLinkProps = {
  entityRef: Entity | CompoundEntityRef | string;
  defaultKind?: string;
  title?: string;
  children?: React.ReactNode;
} & Omit<LinkProps, 'to'>;

/**
 * Shows a clickable link to an entity.
 *
 * @public
 */
export const EntityRefLink = forwardRef<any, EntityRefLinkProps>(
  (props, ref) => {
    const { entityRef, defaultKind, title, children, ...linkProps } = props;
    const entityRoute = useRouteRef(entityRouteRef);

    let kind;
    let namespace;
    let name;

    if (typeof entityRef === 'string') {
      const parsed = parseEntityRef(entityRef);
      kind = parsed.kind;
      namespace = parsed.namespace;
      name = parsed.name;
    } else if ('metadata' in entityRef) {
      kind = entityRef.kind;
      namespace = entityRef.metadata.namespace;
      name = entityRef.metadata.name;
    } else {
      kind = entityRef.kind;
      namespace = entityRef.namespace;
      name = entityRef.name;
    }

    kind = kind.toLocaleLowerCase('en-US');
    namespace = namespace?.toLocaleLowerCase('en-US') ?? DEFAULT_NAMESPACE;

    const routeParams = { kind, namespace, name };
    const formattedEntityRefTitle = humanizeEntityRef(
      { kind, namespace, name },
      { defaultKind },
    );

    const link = (
      <Link {...linkProps} ref={ref} to={entityRoute(routeParams)}>
        {children}
        {!children && (title ?? formattedEntityRefTitle)}
      </Link>
    );

    return title ? (
      <Tooltip title={formattedEntityRefTitle}>{link}</Tooltip>
    ) : (
      link
    );
  },
) as (props: EntityRefLinkProps) => JSX.Element;
