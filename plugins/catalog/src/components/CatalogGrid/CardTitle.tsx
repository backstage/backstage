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
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import React from 'react';
import { Box } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { CardIcon } from './CardIcon';

export interface CardTitleOptions {
  defaultKind?: string;
  defaultIcon?: any;
  alwaysShowPagination?: boolean;
  hideIcons?: boolean;
}

export interface CardTitleProps {
  entity: Entity;
  options?: CardTitleOptions;
}

export const CardTitle = ({ entity, options }: CardTitleProps) => {
  const title = entity.metadata.title ?? entity.metadata.name;
  return (
    <Box display="flex" alignItems="center">
      {!options?.hideIcons && <CardIcon entity={entity} options={options} />}
      <Box>
        <EntityRefLink
          entityRef={entity}
          defaultKind={options?.defaultKind || 'Component'}
          title={title}
        />
      </Box>
    </Box>
  );
};
