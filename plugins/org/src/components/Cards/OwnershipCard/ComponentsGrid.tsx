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
import {
  Link,
  OverflowTooltip,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import pluralize from 'pluralize';
import { catalogIndexRouteRef } from '../../../routes';
import { useGetEntities } from './useGetEntities';
import { EntityRelationAggregation } from '../types';

const useStyles = makeStyles(theme =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      borderRadius: '4px',
      padding: theme.spacing(2),
      transition: `${theme.transitions.duration.standard}ms`,
      '&:hover': {
        boxShadow: theme.shadows[4],
      },
      height: '100%',
    },
    bold: {
      fontWeight: theme.typography.fontWeightBold,
    },
    smallFont: {
      fontSize: theme.typography.body2.fontSize,
    },
    entityTypeBox: {
      background: (props: { type: string }) =>
        theme.getPageTheme({ themeId: props.type }).backgroundImage,
      color: (props: { type: string }) =>
        theme.getPageTheme({ themeId: props.type }).fontColor,
    },
  }),
);

const EntityCountTile = ({
  counter,
  type,
  kind,
  url,
}: {
  counter: number;
  type?: string;
  kind: string;
  url?: string;
}) => {
  const classes = useStyles({ type: type ?? kind });

  const rawTitle = type ?? kind;
  const isLongText = rawTitle.length > 10;

  const tile = (
    <Box
      className={`${classes.card} ${classes.entityTypeBox}`}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography className={classes.bold} variant="h6">
        {counter}
      </Typography>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography
          className={`${classes.bold} ${isLongText && classes.smallFont}`}
          variant="h6"
        >
          <OverflowTooltip
            text={pluralize(rawTitle.toLocaleUpperCase('en-US'), counter)}
          />
        </Typography>
      </Box>
      {type && <Typography variant="subtitle1">{kind}</Typography>}
    </Box>
  );

  if (url) {
    return (
      <Link to={url} variant="body2">
        {tile}
      </Link>
    );
  }
  return tile;
};

export const ComponentsGrid = ({
  className,
  entity,
  relationsType,
  relationAggregation,
  entityFilterKind,
  entityLimit = 6,
}: {
  className?: string;
  entity: Entity;
  /** @deprecated Please use relationAggregation instead */
  relationsType?: EntityRelationAggregation;
  relationAggregation?: EntityRelationAggregation;
  entityFilterKind?: string[];
  entityLimit?: number;
}) => {
  const catalogLink = useRouteRef(catalogIndexRouteRef);
  if (!relationsType && !relationAggregation) {
    throw new Error(
      'The relationAggregation property must be set as an EntityRelationAggregation type.',
    );
  }
  const { componentsWithCounters, loading, error } = useGetEntities(
    entity,
    (relationAggregation ?? relationsType)!, // we can safely use the non-null assertion here because of the run-time check above
    entityFilterKind,
    entityLimit,
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <Grid container className={className}>
      {componentsWithCounters?.map(c => (
        <Grid item xs={6} md={6} lg={4} key={c.type ?? c.kind}>
          <EntityCountTile
            counter={c.counter}
            kind={c.kind}
            type={c.type}
            url={catalogLink && `${catalogLink()}/?${c.queryParams}`}
          />
        </Grid>
      ))}
    </Grid>
  );
};
