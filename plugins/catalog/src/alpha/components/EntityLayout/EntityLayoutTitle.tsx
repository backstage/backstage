/*
 * Copyright 2025 The Backstage Authors
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

import React from 'react';
import Box from '@material-ui/core/Box';
import { Entity } from '@backstage/catalog-model';
import {
  EntityDisplayName,
  FavoriteEntity,
} from '@backstage/plugin-catalog-react';

type EntityLayoutTitleProps = {
  title: string;
  entity: Entity | undefined;
};

export function EntityLayoutTitle(props: EntityLayoutTitleProps) {
  const { entity, title } = props;
  return (
    <Box display="inline-flex" alignItems="center" height="1em" maxWidth="100%">
      <Box
        component="span"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
      >
        {entity ? <EntityDisplayName entityRef={entity} hideIcon /> : title}
      </Box>
      {entity && <FavoriteEntity entity={entity} />}
    </Box>
  );
}
