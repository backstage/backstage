/*
 * Copyright 2020 Spotify AB
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
  ENTITY_DEFAULT_NAMESPACE,
  EntityName,
} from '@backstage/catalog-model';
import { Link } from '@backstage/core';
import React from 'react';
import { generatePath } from 'react-router';
import { entityRoute } from '../../routes';
import { formatEntityRefTitle } from './format';

type EntityRefLinkProps = {
  entityRef: Entity | EntityName;
  defaultKind?: string;
  children?: React.ReactNode;
};

export const EntityRefLink = React.forwardRef<any, EntityRefLinkProps>(
  (props, ref) => {
    const { entityRef, defaultKind, children } = props;

    let kind;
    let namespace;
    let name;

    if ('metadata' in entityRef) {
      kind = entityRef.kind;
      namespace = entityRef.metadata.namespace;
      name = entityRef.metadata.name;
    } else {
      kind = entityRef.kind;
      namespace = entityRef.namespace;
      name = entityRef.name;
    }

    kind = kind.toLowerCase();

    const routeParams = {
      kind,
      namespace: namespace?.toLowerCase() ?? ENTITY_DEFAULT_NAMESPACE,
      name,
    };

    // TODO: Use useRouteRef here to generate the path
    return (
      <Link
        ref={ref}
        to={generatePath(`/catalog/${entityRoute.path}`, routeParams)}
        {...props}
      >
        {children}
        {!children && formatEntityRefTitle(entityRef, { defaultKind })}
      </Link>
    );
  },
);
