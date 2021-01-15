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
  EntityName,
  ENTITY_DEFAULT_NAMESPACE,
  serializeEntityRef,
} from '@backstage/catalog-model';
import { Link } from '@material-ui/core';
import React from 'react';
import { generatePath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { entityRoute } from '../../routes';

type EntityRefLinkProps = {
  entityRef: Entity | EntityName;
};

// TODO: This component is private for now, as it should probably belong into
// some kind of helper module for the catalog plugin to avoid a dependency on
// the catalog plugin itself.
export const EntityRefLink = ({ entityRef }: EntityRefLinkProps) => {
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

  if (namespace === ENTITY_DEFAULT_NAMESPACE) {
    namespace = undefined;
  }

  kind = kind.toLowerCase();

  const title = `${serializeEntityRef({
    kind,
    name,
    namespace,
  })}`;
  const routeParams = {
    kind,
    namespace: namespace?.toLowerCase() ?? ENTITY_DEFAULT_NAMESPACE,
    name,
  };

  return (
    <Link
      component={RouterLink}
      to={generatePath(`/catalog/${entityRoute.path}`, routeParams)}
    >
      {title}
    </Link>
  );
};
