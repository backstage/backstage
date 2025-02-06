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

import React, { useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import {
  OverviewEntityContentLauyoutBlueprint,
  OverviewEntityContentLayoutProps,
} from '@backstage/plugin-catalog-react/alpha';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  [theme.breakpoints.up('sm')]: {
    infoArea: {
      order: 1,
    },
    card: {
      alignSelf: 'stretch',
      '& > *': {
        height: '100%',
        minHeight: 400,
      },
    },
  },
}));

function StickyEntityContentOverviewLayout(
  props: OverviewEntityContentLayoutProps,
) {
  const { cards, buildFilterFn } = props;

  const classes = useStyles();

  const { entity } = useEntity();

  const catalogEntityFilter = useCallback(
    (options: {
      filterFunction?: (entity: Entity) => boolean;
      filterExpression?: string;
    }) => {
      const { filterFunction, filterExpression } = options;
      return buildFilterFn(filterFunction, filterExpression)(entity);
    },
    [entity, buildFilterFn],
  );

  return (
    <Grid container spacing={3}>
      <Grid
        className={classes.infoArea}
        xs={12}
        md={4}
        style={{
          position: 'sticky',
          top: -16,
          alignSelf: 'flex-start',
        }}
        item
      >
        <Grid container spacing={3}>
          {cards
            .filter(catalogEntityFilter)
            .filter(card => card.area === 'info')
            .map((card, index) => (
              <Grid key={index} xs={12} item>
                {card.element}
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid xs={12} md={8} item>
        <Grid container spacing={3}>
          {cards
            .filter(catalogEntityFilter)
            .filter(card => card.area === 'glance')
            .map((card, index) => (
              <Grid key={index} className={classes.card} xs={12} md={6} item>
                {card.element}
              </Grid>
            ))}
          {cards
            .filter(catalogEntityFilter)
            .filter(card => !card.area || card.area === 'main')
            .map((card, index) => (
              <Grid key={index} className={classes.card} xs={12} md={6} item>
                {card.element}
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export const customEntityContentOverviewLayoutModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    OverviewEntityContentLauyoutBlueprint.make({
      name: 'sticky',
      params: {
        areas: ['info', 'glance', 'main'],
        defaultArea: 'main',
        loader: async () => StickyEntityContentOverviewLayout,
      },
    }),
  ],
});
