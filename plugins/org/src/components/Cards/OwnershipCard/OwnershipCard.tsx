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
import React from 'react';
import { InfoCard, useApi, Progress } from '@backstage/core';
import {
  ComponentEntity,
  Entity,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog';
import { useAsync } from 'react-use';
import Alert from '@material-ui/lab/Alert';
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { pageTheme } from '@backstage/theme';

type ComponentKinds = 'service' | 'website' | 'library' | 'documentation';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      borderRadius: '4px',
      padding: theme.spacing(2),
      backgroundSize: 'contain',
    },
    bold: {
      fontWeight: theme.typography.fontWeightBold,
    },
    Services: {
      background: pageTheme.service.backgroundImage,
    },
    Libraries: {
      background: pageTheme.library.backgroundImage,
    },
    Websites: {
      background: pageTheme.website.backgroundImage,
    },
    Documentations: {
      background: pageTheme.documentation.backgroundImage,
    },
  }),
);

const countComponentsByType = (
  components: Array<ComponentEntity>,
  kind: ComponentKinds,
) => components.filter(c => c.spec.type === kind).length;

const ComponentCard = ({
  counter,
  name,
}: {
  counter: number;
  name: string;
}) => {
  const classes = useStyles();
  return (
    <Box
      className={`${classes.card} ${classes[name]}`}
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

export const OwnershipCard = ({ entity }: { entity: Entity }) => {
  const {
    metadata: { name: groupName },
  } = entity;
  const catalogApi = useApi(catalogApiRef);
  const {
    loading,
    error,
    value: componentsWithCounters,
  } = useAsync(async () => {
    const componentsList = await catalogApi.getEntities({
      filter: {
        kind: 'Component',
      },
    });
    const ownedComponentsList = componentsList.items.filter(component =>
      component?.relations?.some(
        r => r.type === RELATION_OWNED_BY && r.target.name === groupName,
      ),
    ) as Array<ComponentEntity>;
    return [
      {
        counter: countComponentsByType(ownedComponentsList, 'service'),
        name: 'Services',
      },
      {
        counter: countComponentsByType(ownedComponentsList, 'documentation'),
        name: 'Documentations',
      },
      {
        counter: countComponentsByType(ownedComponentsList, 'library'),
        name: 'Libraries',
      },
      {
        counter: countComponentsByType(ownedComponentsList, 'website'),
        name: 'Websites',
      },
    ] as Array<{ counter: number; name: string }>;
  }, [catalogApi]);

  if (loading) return <Progress />;
  else if (error) return <Alert severity="error">{error.message}</Alert>;

  return componentsWithCounters ? (
    <InfoCard title="Ownership">
      <Grid container>
        {componentsWithCounters.map(c => (
          <Grid item xs={12} md={6} key={c.name}>
            <ComponentCard counter={c.counter} name={c.name} />
          </Grid>
        ))}
      </Grid>
    </InfoCard>
  ) : null;
};
