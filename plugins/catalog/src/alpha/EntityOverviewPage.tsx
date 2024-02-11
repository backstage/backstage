/*
 * Copyright 2023 The Backstage Authors
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
import { useEntity } from '@backstage/plugin-catalog-react';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { FilterWrapper } from './filter/FilterWrapper';

interface EntityOverviewPageProps {
  cards: Array<{
    element: React.JSX.Element;
    filterFunction?: (entity: Entity) => boolean;
    filterExpression?: string;
  }>;
}

export function EntityOverviewPage(props: EntityOverviewPageProps) {
  const { entity } = useEntity();
  return (
    <Grid container spacing={3} alignItems="stretch">
      {props.cards.map((card, index) => (
        <FilterWrapper key={index} entity={entity} {...card} />
      ))}
    </Grid>
  );
}
