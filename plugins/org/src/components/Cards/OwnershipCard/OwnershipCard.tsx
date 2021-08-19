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
  catalogApiRef,
  isOwnerOf,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { BackstageTheme, genPageTheme } from '@backstage/theme';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Typography,
  Link,
} from '@material-ui/core';
import React from 'react';
import { useAsync } from 'react-use';
import { generatePath } from 'react-router';
import qs from 'qs';
import {
  InfoCard,
  InfoCardVariants,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

type BoxTypes = 'box1' | 'box2' | 'box3' | 'box4' | 'box5' | 'box6';

type EntityTypeProps = {
  name: string;
  kind: string;
  type: string;
  count: number;
};

const createPageTheme = (
  theme: BackstageTheme,
  shapeKey: string,
  colorsKey: string,
) => {
  const { colors } = theme.getPageTheme({ themeId: colorsKey });
  const { shape } = theme.getPageTheme({ themeId: shapeKey });
  return genPageTheme(colors, shape).backgroundImage;
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
    box1: {
      background: createPageTheme(theme, 'home', 'service'),
    },
    box2: {
      background: createPageTheme(theme, 'home', 'website'),
    },
    box3: {
      background: createPageTheme(theme, 'home', 'library'),
    },
    box4: {
      background: createPageTheme(theme, 'home', 'documentation'),
    },
    box5: {
      background: createPageTheme(theme, 'home', 'home'),
    },
    box6: {
      background: createPageTheme(theme, 'home', 'tool'),
    },
  }),
);

const EntityCountTile = ({
  counter,
  className,
  name,
  url,
}: {
  counter: number;
  className: BoxTypes;
  name: string;
  url: string;
}) => {
  const classes = useStyles();

  return (
    <Link href={url} target="_blank" rel="noreferrer noopenner" variant="body2">
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
    </Link>
  );
};

const getFilteredUrl = (
  owner: Entity,
  selectedEntity: EntityTypeProps,
): string => {
  const ownerName = owner.metadata.name;
  const kind = selectedEntity.kind;
  const type = selectedEntity.type;
  const queryParams = qs.stringify({
    filters: {
      kind,
      type,
      owners: ownerName,
      user: 'all',
    },
  });
  const filteredUrl = generatePath(`/catalog/?${queryParams}`);

  return filteredUrl;
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
        const name = ownedEntity.metadata.name;
        if (match) {
          match.count += 1;
        } else {
          acc.push({
            name,
            kind: ownedEntity.kind,
            type: ownedEntity.spec?.type?.toString(),
            count: 1,
          });
        }
        return acc;
      },
      [],
    );

    // Return top N (six) entities to be displayed in ownership boxes
    const topN = counts.sort((a, b) => b.count - a.count).slice(0, 6);

    return topN.map((topEntity, index) => ({
      counter: topEntity.count,
      className: `box${index + 1}`,
      name: topEntity.type.toLocaleUpperCase('en-US'),
      url: getFilteredUrl(entity, topEntity),
    })) as Array<{
      counter: number;
      className: BoxTypes;
      name: string;
      url: string;
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
              className={c.className}
              name={c.name}
              url={c.url}
            />
          </Grid>
        ))}
      </Grid>
    </InfoCard>
  );
};
