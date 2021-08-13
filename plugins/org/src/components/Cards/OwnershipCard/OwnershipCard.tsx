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
  InfoCard,
  InfoCardVariants,
  Link,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  catalogRouteRef,
  formatEntityRefTitle,
  isOwnerOf,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { BackstageTheme } from '@backstage/theme';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Typography,
  Link,
} from '@material-ui/core';
import qs from 'qs';
import React from 'react';
import { useAsync } from 'react-use';

type EntityTypeProps = {
  kind: string;
  type: string;
  count: number;
};

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
          {name}
        </Typography>
      </Box>
    </Link>
  );
};

const getQueryParams = (
  owner: Entity,
  selectedEntity: EntityTypeProps,
): string => {
  const ownerName = formatEntityRefTitle(owner, { defaultKind: 'group' });
  const { kind, type } = selectedEntity;
  const queryParams = qs.stringify({
    filters: {
      kind,
      type,
      owners: ownerName,
      user: 'all',
    },
  });

  return queryParams;
};

export const OwnershipCard = ({
  variant,
}: {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
  variant?: InfoCardVariants;
}) => {
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const catalogLink = useRouteRef(catalogRouteRef);

  const {
    loading,
    error,
    value: componentsWithCounters,
  } = useAsync(async () => {
    const kinds = ['Component', 'API'];
    const entitiesList = await catalogApi.getEntities({
      filter: {
        kind: kinds,
      },
      fields: [
        'kind',
        'metadata.name',
        'metadata.namespace',
        'spec.type',
        'relations',
      ],
    });

    const ownedEntitiesList = entitiesList.items.filter(component =>
      isOwnerOf(entity, component),
    );

    const counts = ownedEntitiesList.reduce(
      (acc: EntityTypeProps[], ownedEntity) => {
        if (typeof ownedEntity.spec?.type !== 'string') return acc;

        const match = acc.find(
          x => x.kind === ownedEntity.kind && x.type === ownedEntity.spec?.type,
        );
        if (match) {
          match.count += 1;
        } else {
          acc.push({
            kind: ownedEntity.kind,
            type: ownedEntity.spec?.type,
            count: 1,
          });
        }
        return acc;
      },
      [],
    );

    // Return top N (six) entities to be displayed in ownership boxes
    const topN = counts.sort((a, b) => b.count - a.count).slice(0, 6);

    return topN.map(topOwnedEntity => ({
      counter: topOwnedEntity.count,
      type: topOwnedEntity.type,
      name: topOwnedEntity.type.toLocaleUpperCase('en-US'),
      queryParams: getQueryParams(entity, topOwnedEntity),
    })) as Array<{
      counter: number;
      type: string;
      name: string;
      queryParams: string;
    }>;
  }, [catalogApi, entity]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <InfoCard title="Ownership" variant={variant}>
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
    </InfoCard>
  );
};
