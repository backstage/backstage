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

import {
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { Chip, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { EntityRefLink } from '../EntityRefLink';
import { getEntityRelations } from '../getEntityRelations';
import { AboutField } from './AboutField';

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
  const isSystem = entity.kind.toLowerCase() === 'system';
  const isDomain = entity.kind.toLowerCase() === 'domain';
  const isResource = entity.kind.toLowerCase() === 'resource';
  const isComponent = entity.kind.toLowerCase() === 'component';
  const [partOfSystemRelation] = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'system',
  });
  const [partOfComponentRelation] = getEntityRelations(
    entity,
    RELATION_PART_OF,
    {
      kind: 'component',
    },
  );
  const [partOfDomainRelation] = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'domain',
  });
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

  return (
    <Grid container>
      <AboutField label="Description" gridSizes={{ xs: 12 }}>
        <Typography variant="body2" paragraph className={classes.description}>
          {entity?.metadata?.description || 'No description'}
        </Typography>
      </AboutField>
      <AboutField label="Owner" gridSizes={{ xs: 12, sm: 6, lg: 4 }}>
        {ownedByRelations.map((t, i) => (
          <React.Fragment key={i}>
            {i > 0 && ', '}
            <EntityRefLink entityRef={t} defaultKind="group" />
          </React.Fragment>
        ))}
      </AboutField>
      {isSystem && (
        <AboutField
          label="Domain"
          value="No Domain"
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          {partOfDomainRelation && (
            <EntityRefLink
              entityRef={partOfDomainRelation}
              defaultKind="domain"
            />
          )}
        </AboutField>
      )}
      {!isSystem && !isDomain && (
        <AboutField
          label="System"
          value="No System"
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          {partOfSystemRelation && (
            <EntityRefLink
              entityRef={partOfSystemRelation}
              defaultKind="system"
            />
          )}
        </AboutField>
      )}
      {isComponent && partOfComponentRelation && (
        <AboutField
          label="Parent Component"
          value="No Parent Component"
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          <EntityRefLink
            entityRef={partOfComponentRelation}
            defaultKind="component"
          />
        </AboutField>
      )}
      {!isSystem && !isDomain && (
        <AboutField
          label="Type"
          value={entity?.spec?.type as string}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        />
      )}
      {!isSystem && !isDomain && !isResource && (
        <AboutField
          label="Lifecycle"
          value={entity?.spec?.lifecycle as string}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        />
      )}
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
