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
import { InfoCard, Progress, useApi } from '@backstage/core';
import {
  catalogApiRef,
  isOwnerOf,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { pageTheme } from '@backstage/theme';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useAsync } from 'react-use';

type EntitiesKinds = 'Component' | 'API';
type EntitiesTypes =
  | 'service'
  | 'website'
  | 'library'
  | 'documentation'
  | 'api'
  | 'tool';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      borderRadius: '4px',
      padding: theme.spacing(2),
      color: '#fff',
      transition: `${theme.transitions.duration.standard}ms`,
      '&:hover': {
        boxShadow: theme.shadows[4],
      },
    },
    bold: {
      fontWeight: theme.typography.fontWeightBold,
    },
    service: {
      background: `${pageTheme.home.shape}, linear-gradient(90deg, ${pageTheme.service.colors})`,
    },
    website: {
      background: `${pageTheme.home.shape}, linear-gradient(90deg, ${pageTheme.website.colors})`,
    },
    library: {
      background: `${pageTheme.home.shape}, linear-gradient(90deg, ${pageTheme.library.colors})`,
    },
    documentation: {
      background: `${pageTheme.home.shape}, linear-gradient(90deg, ${pageTheme.documentation.colors})`,
    },
    api: {
      background: `${pageTheme.home.shape}, linear-gradient(90deg, #005B4B, #005B4B)`,
    },
    tool: {
      background: `${pageTheme.home.shape}, linear-gradient(90deg, ${pageTheme.tool.colors})`,
    },
  }),
);

const countEntitiesBy = (
  entities: Array<Entity>,
  kind: EntitiesKinds,
  type?: EntitiesTypes,
) =>
  entities.filter(
    e => e.kind === kind && (type ? e?.spec?.type === type : true),
  ).length;

const EntityCountTile = ({
  counter,
  className,
  name,
}: {
  counter: number;
  className: EntitiesTypes;
  name: string;
}) => {
  const classes = useStyles();
  return (
    <Box
      className={`${classes.card} ${classes[className]}`}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography className={classes.bold} variant="h6">
        {counter}
      </Typography>
      <Typography className={classes.bold} variant="h6">
        {name}
      </Typography>
    </Box>
  );
};

export const OwnershipCard = ({
  variant,
}: {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
  variant: string;
}) => {
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const {
    loading,
    error,
    value: componentsWithCounters,
  } = useAsync(async () => {
    const entitiesList = await catalogApi.getEntities();
    const ownedEntitiesList = entitiesList.items.filter(component =>
      isOwnerOf(entity, component),
    );

    return [
      {
        counter: countEntitiesBy(ownedEntitiesList, 'Component', 'service'),
        className: 'service',
        name: 'Services',
      },
      {
        counter: countEntitiesBy(
          ownedEntitiesList,
          'Component',
          'documentation',
        ),
        className: 'documentation',
        name: 'Documentation',
      },
      {
        counter: countEntitiesBy(ownedEntitiesList, 'API'),
        className: 'api',
        name: 'APIs',
      },
      {
        counter: countEntitiesBy(ownedEntitiesList, 'Component', 'library'),
        className: 'library',
        name: 'Libraries',
      },
      {
        counter: countEntitiesBy(ownedEntitiesList, 'Component', 'website'),
        className: 'website',
        name: 'Websites',
      },
      {
        counter: countEntitiesBy(ownedEntitiesList, 'Component', 'tool'),
        className: 'tool',
        name: 'Tools',
      },
    ] as Array<{ counter: number; className: EntitiesTypes; name: string }>;
  }, [catalogApi]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <InfoCard title="Ownership" variant={variant}>
      <Grid container>
        {componentsWithCounters?.map(c => (
          <Grid item xs={6} md={6} lg={4} key={c.name}>
            <EntityCountTile
              counter={c.counter}
              className={c.className}
              name={c.name}
            />
          </Grid>
        ))}
      </Grid>
    </InfoCard>
  );
};
