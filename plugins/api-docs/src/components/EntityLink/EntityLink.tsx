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

import { Entity } from '@backstage/catalog-model';
import { entityRoute, entityRouteParams } from '@backstage/plugin-catalog';
import { Link } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import { generatePath, Link as RouterLink } from 'react-router-dom';

type Props = {
  entity: Entity;
};

// TODO: Could be useful for others too, as part of the catalog plugin
export const EntityLink = ({ entity, children }: PropsWithChildren<Props>) => {
  return (
    <Link
      component={RouterLink}
      to={generatePath(
        `/catalog/${entityRoute.path}`,
        entityRouteParams(entity),
      )}
    >
      {children}
    </Link>
  );
};
