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
import { parseFilterExpression } from '@backstage/plugin-catalog-common/alpha';
import { useEntity } from '@backstage/plugin-catalog-react';
import Grid from '@material-ui/core/Grid';
import React, { useMemo } from 'react';

interface EntityOverviewPageProps {
  cards: Array<{
    element: React.JSX.Element;
    filter?: string | ((entity: Entity) => boolean);
  }>;
}

function CardWrapper(props: {
  entity: Entity;
  element: React.JSX.Element;
  filter?: string | ((entity: Entity) => boolean);
}) {
  const { entity, element, filter } = props;

  const filterFn = useMemo<(subject: Entity) => boolean>(() => {
    if (!filter) {
      return () => true;
    } else if (typeof filter === 'function') {
      return subject => filter(subject);
    }
    return parseFilterExpression(filter);
  }, [filter]);

  return filterFn(entity) ? <>{element}</> : null;
}

export function EntityOverviewPage(props: EntityOverviewPageProps) {
  const { entity } = useEntity();
  return (
    <Grid container spacing={3} alignItems="stretch">
      {props.cards.map((card, index) => (
        <Grid key={index} item md={6} xs={12}>
          <CardWrapper
            entity={entity}
            element={card.element}
            filter={card.filter}
          />
        </Grid>
      ))}
    </Grid>
  );
}
