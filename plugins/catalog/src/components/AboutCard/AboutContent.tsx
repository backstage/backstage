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
import { Grid, Typography, Chip, makeStyles } from '@material-ui/core';
import { AboutField } from './AboutField';
import {
  Entity,
  ENTITY_DEFAULT_NAMESPACE,
  RELATION_OWNED_BY,
  serializeEntityRef,
} from '@backstage/catalog-model';

const useStyles = makeStyles({
  description: {
    wordBreak: 'break-word',
  },
});

type Props = {
  entity: Entity;
};

export const AboutContent = ({ entity }: Props) => {
  const classes = useStyles();
  return (
    <Grid container>
      <AboutField label="Description" gridSizes={{ xs: 12 }}>
        <Typography variant="body2" paragraph className={classes.description}>
          {entity?.metadata?.description || 'No description'}
        </Typography>
      </AboutField>
      <AboutField
        label="Owner"
        value={entity?.relations
          ?.filter(r => r.type === RELATION_OWNED_BY)
          .map(({ target: { kind, name, namespace } }) =>
            // TODO(Rugvip): we want to provide some utils for this
            serializeEntityRef({
              kind,
              name,
              namespace:
                namespace === ENTITY_DEFAULT_NAMESPACE ? undefined : namespace,
            }),
          )
          .join(', ')}
        gridSizes={{ xs: 12, sm: 6, lg: 4 }}
      />
      <AboutField
        label="Type"
        value={entity?.spec?.type as string}
        gridSizes={{ xs: 12, sm: 6, lg: 4 }}
      />
      <AboutField
        label="Lifecycle"
        value={entity?.spec?.lifecycle as string}
        gridSizes={{ xs: 12, sm: 6, lg: 4 }}
      />
      <AboutField
        label="Tags"
        value="No Tags"
        gridSizes={{ xs: 12, sm: 6, lg: 4 }}
      >
        {(entity?.metadata?.tags || []).map(t => (
          <Chip key={t} size="small" label={t} />
        ))}
      </AboutField>
    </Grid>
  );
};
