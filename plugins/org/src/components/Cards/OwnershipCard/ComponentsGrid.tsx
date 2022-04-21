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

import { Entity } from '@backstage/catalog-model';
import { Link, Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import pluralize from 'pluralize';
import { catalogIndexRouteRef } from '../../../routes';
import { useGetEntities } from './useGetEntities';

const useStyles = makeStyles((theme: BackstageTheme) =>
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
    entityTypeBox: {
      background: (props: { type: string }) =>
        theme.getPageTheme({ themeId: props.type }).backgroundImage,
    },
  }),
);

const EntityCountTile = ({
  counter,
  type,
  name,
  url,
}: {
  counter: number;
  type: string;
  name: string;
  url: string;
}) => {
  const classes = useStyles({ type });

  return (
    <Link to={url} variant="body2">
      <Box
        className={`${classes.card} ${classes.entityTypeBox}`}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography className={classes.bold} variant="h6">
          {counter}
        </Typography>
        <Typography className={classes.bold} variant="h6">
          {pluralize(name, counter)}
        </Typography>
      </Box>
    </Link>
  );
};

export const ComponentsGrid = ({
  entity,
  relationsType,
  isGroup,
  entityFilterKind,
}: {
  entity: Entity;
  relationsType: string;
  isGroup: boolean;
  entityFilterKind?: string[];
}) => {
  const catalogLink = useRouteRef(catalogIndexRouteRef);
  const { componentsWithCounters, loading, error } = useGetEntities(
    entity,
    relationsType,
    isGroup,
    entityFilterKind,
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Grid container>
      {componentsWithCounters?.map(c => (
        <Grid item xs={6} md={6} lg={4} key={c.name}>
          <EntityCountTile
            counter={c.counter}
            type={c.type}
            name={c.name}
            url={`${catalogLink()}/?${c.queryParams}`}
          />
        </Grid>
      ))}
    </Grid>
  );
};
