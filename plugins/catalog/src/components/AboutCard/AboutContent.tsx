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

import {
  Entity,
  getEntitySourceLocation,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { JsonArray } from '@backstage/types';
import { Chip, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { AboutField } from './AboutField';
import { LinksGridList } from '../EntityLinksCard/LinksGridList';

const useStyles = makeStyles({
  description: {
    wordBreak: 'break-word',
  },
});

/**
 * Props for {@link AboutContent}.
 *
 * @public
 */
export interface AboutContentProps {
  entity: Entity;
}

function getLocationTargetHref(
  target: string,
  type: string,
  entitySourceLocation: {
    type: string;
    target: string;
  },
): string {
  if (type === 'url' || target.includes('://')) {
    return target;
  }

  const srcLocationUrl =
    entitySourceLocation.type === 'file'
      ? `file://${entitySourceLocation.target}`
      : entitySourceLocation.target;

  if (type === 'file' || entitySourceLocation.type === 'file') {
    return new URL(target, srcLocationUrl).href;
  }

  return srcLocationUrl;
}

/** @public */
export function AboutContent(props: AboutContentProps) {
  const { entity } = props;
  const classes = useStyles();
  const isSystem = entity.kind.toLocaleLowerCase('en-US') === 'system';
  const isResource = entity.kind.toLocaleLowerCase('en-US') === 'resource';
  const isComponent = entity.kind.toLocaleLowerCase('en-US') === 'component';
  const isAPI = entity.kind.toLocaleLowerCase('en-US') === 'api';
  const isTemplate = entity.kind.toLocaleLowerCase('en-US') === 'template';
  const isLocation = entity.kind.toLocaleLowerCase('en-US') === 'location';
  const isGroup = entity.kind.toLocaleLowerCase('en-US') === 'group';

  const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'system',
  });
  const partOfComponentRelations = getEntityRelations(
    entity,
    RELATION_PART_OF,
    {
      kind: 'component',
    },
  );
  const partOfDomainRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'domain',
  });
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

  let entitySourceLocation:
    | {
        type: string;
        target: string;
      }
    | undefined;
  try {
    entitySourceLocation = getEntitySourceLocation(entity);
  } catch (e) {
    entitySourceLocation = undefined;
  }

  return (
    <Grid container>
      <AboutField label="Description" gridSizes={{ xs: 12 }}>
        <Typography variant="body2" paragraph className={classes.description}>
          {entity?.metadata?.description || 'No description'}
        </Typography>
      </AboutField>
      <AboutField
        label="Owner"
        value="No Owner"
        gridSizes={{ xs: 12, sm: 6, lg: 4 }}
      >
        {ownedByRelations.length > 0 && (
          <EntityRefLinks entityRefs={ownedByRelations} defaultKind="group" />
        )}
      </AboutField>
      {(isSystem || partOfDomainRelations.length > 0) && (
        <AboutField
          label="Domain"
          value="No Domain"
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          {partOfDomainRelations.length > 0 && (
            <EntityRefLinks
              entityRefs={partOfDomainRelations}
              defaultKind="domain"
            />
          )}
        </AboutField>
      )}
      {(isAPI ||
        isComponent ||
        isResource ||
        partOfSystemRelations.length > 0) && (
        <AboutField
          label="System"
          value="No System"
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          {partOfSystemRelations.length > 0 && (
            <EntityRefLinks
              entityRefs={partOfSystemRelations}
              defaultKind="system"
            />
          )}
        </AboutField>
      )}
      {isComponent && partOfComponentRelations.length > 0 && (
        <AboutField
          label="Parent Component"
          value="No Parent Component"
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        >
          <EntityRefLinks
            entityRefs={partOfComponentRelations}
            defaultKind="component"
          />
        </AboutField>
      )}
      {(isAPI ||
        isComponent ||
        isResource ||
        isTemplate ||
        isGroup ||
        isLocation ||
        typeof entity?.spec?.type === 'string') && (
        <AboutField
          label="Type"
          value={entity?.spec?.type as string}
          gridSizes={{ xs: 12, sm: 6, lg: 4 }}
        />
      )}
      {(isAPI ||
        isComponent ||
        typeof entity?.spec?.lifecycle === 'string') && (
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
      {isLocation && (entity?.spec?.targets || entity?.spec?.target) && (
        <AboutField label="Targets" gridSizes={{ xs: 12 }}>
          <LinksGridList
            cols={1}
            items={((entity.spec.targets as JsonArray) || [entity.spec.target])
              .map(target => target as string)
              .map(target => ({
                text: target,
                href: getLocationTargetHref(
                  target,
                  (entity?.spec?.type || 'unknown') as string,
                  entitySourceLocation!,
                ),
              }))}
          />
        </AboutField>
      )}
    </Grid>
  );
}
