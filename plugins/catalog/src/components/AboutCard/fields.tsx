/*
 * Copyright 2022 The Backstage Authors
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
  getEntitySourceLocation,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  EntityRefLinks,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { JsonArray } from '@backstage/types';
import { Chip, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { AboutField } from './AboutField';
import { LinksGridList } from '../EntityLinksCard/LinksGridList';

const useStyles = makeStyles({
  description: {
    wordBreak: 'break-word',
  },
});

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

/**
 * The built-in fields to be used individually.
 *
 * @public
 */
export const AboutCardBuiltInFields = Object.freeze({
  Description() {
    const { entity } = useEntity();
    const classes = useStyles();
    return (
      <AboutField label="Description" gridSizes={{ xs: 12 }}>
        <Typography variant="body2" paragraph className={classes.description}>
          {entity?.metadata?.description || 'No description'}
        </Typography>
      </AboutField>
    );
  },
  Owner() {
    const { entity } = useEntity();
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
    return (
      <AboutField
        label="Owner"
        value="No Owner"
        gridSizes={{ xs: 12, sm: 6, lg: 4 }}
      >
        {ownedByRelations.length > 0 && (
          <EntityRefLinks entityRefs={ownedByRelations} defaultKind="group" />
        )}
      </AboutField>
    );
  },
  Domain() {
    const { entity } = useEntity();
    const isSystem = entity.kind.toLocaleLowerCase('en-US') === 'system';
    const partOfDomainRelations = getEntityRelations(entity, RELATION_PART_OF, {
      kind: 'domain',
    });
    return (
      <>
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
      </>
    );
  },
  System() {
    const { entity } = useEntity();
    const validEntities = ['api', 'component', 'resource'];
    const isValidEntity = validEntities.includes(
      entity.kind.toLocaleLowerCase('en-US'),
    );
    const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
      kind: 'system',
    });
    return (
      <>
        {(isValidEntity || partOfSystemRelations.length > 0) && (
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
      </>
    );
  },
  Parent() {
    const { entity } = useEntity();
    const isComponent = entity.kind.toLocaleLowerCase('en-US') === 'component';
    const partOfComponentRelations = getEntityRelations(
      entity,
      RELATION_PART_OF,
      {
        kind: 'component',
      },
    );
    return (
      <>
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
      </>
    );
  },
  Type() {
    const { entity } = useEntity();
    const validEntities = [
      'api',
      'component',
      'resource',
      'template',
      'group',
      'location',
    ];
    const isValidEntity = validEntities.includes(
      entity.kind.toLocaleLowerCase('en-US'),
    );
    return (
      <>
        {(isValidEntity || typeof entity?.spec?.type === 'string') && (
          <AboutField
            label="Type"
            value={entity?.spec?.type as string}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
        )}
      </>
    );
  },
  Lifecycle() {
    const { entity } = useEntity();
    const validEntities = ['api', 'component'];
    const isValidEntity = validEntities.includes(
      entity.kind.toLocaleLowerCase('en-US'),
    );
    return (
      <>
        {(isValidEntity || typeof entity?.spec?.lifecycle === 'string') && (
          <AboutField
            label="Lifecycle"
            value={entity?.spec?.lifecycle as string}
            gridSizes={{ xs: 12, sm: 6, lg: 4 }}
          />
        )}
      </>
    );
  },
  Tags() {
    const { entity } = useEntity();
    return (
      <AboutField
        label="Tags"
        value="No Tags"
        gridSizes={{ xs: 12, sm: 6, lg: 4 }}
      >
        {(entity?.metadata?.tags || []).map(t => (
          <Chip key={t} size="small" label={t} />
        ))}
      </AboutField>
    );
  },
  Targets() {
    const { entity } = useEntity();
    const isLocation = entity.kind.toLocaleLowerCase('en-US') === 'location';
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
      <>
        {isLocation && (entity?.spec?.targets || entity?.spec?.target) && (
          <AboutField label="Targets" gridSizes={{ xs: 12 }}>
            <LinksGridList
              cols={1}
              items={(
                (entity.spec.targets as JsonArray) || [entity.spec.target]
              )
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
      </>
    );
  },
});

/**
 * An array of default fields that is displayed in the EntityAboutCard.
 *
 * @public
 */
export const AboutCardDefaultFields = [
  <AboutCardBuiltInFields.Description key="Description" />,
  <AboutCardBuiltInFields.Owner key="Owner" />,
  <AboutCardBuiltInFields.Domain key="Domain" />,
  <AboutCardBuiltInFields.System key="System" />,
  <AboutCardBuiltInFields.Parent key="Parent" />,
  <AboutCardBuiltInFields.Type key="Type" />,
  <AboutCardBuiltInFields.Lifecycle key="Lifecycle" />,
  <AboutCardBuiltInFields.Tags key="Tags" />,
  <AboutCardBuiltInFields.Targets key="Targets" />,
];
