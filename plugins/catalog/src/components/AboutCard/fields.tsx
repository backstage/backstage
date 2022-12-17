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
  Entity,
  getEntitySourceLocation,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  useEntity,
  AboutField,
  getEntityRelations,
  EntityRefLinks,
  LinksGridList,
} from '@backstage/plugin-catalog-react';
import { JsonArray } from '@backstage/types';
import { Chip, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

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

function getKind(entity: Entity) {
  return entity.kind.toLocaleLowerCase('en-US');
}

function isKind(entity: Entity, kind: string) {
  return getKind(entity) === kind;
}

export interface AboutFieldProps {
  label?: string;
  value?: string;
  gridSizes?: Record<string, number>;
}

function propsWithDefaults(
  props: AboutFieldProps,
  defaults: {
    label: string;
    value?: string;
    gridSizes?: Record<string, number>;
  },
) {
  return {
    label: props.label ?? defaults.label,
    value: props.value ?? defaults.value,
    gridSizes: props.gridSizes ?? defaults.gridSizes,
  };
}

export const DescriptionAboutField = (props: AboutFieldProps) => {
  const _props = propsWithDefaults(props, {
    label: 'Description',
    value: 'No description',
    gridSizes: { xs: 12 },
  });

  const { entity } = useEntity();
  const classes = useStyles();

  return (
    <AboutField label={_props.label} gridSizes={_props.gridSizes}>
      <Typography variant="body2" paragraph className={classes.description}>
        {entity?.metadata?.description || _props.value}
      </Typography>
    </AboutField>
  );
};

export const OwnerAboutField = (props: AboutFieldProps) => {
  const _props = propsWithDefaults(props, {
    label: 'Owner',
    value: 'No owner',
    gridSizes: { xs: 12, sm: 6, lg: 4 },
  });

  const { entity } = useEntity();
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

  return (
    <AboutField {..._props}>
      {ownedByRelations.length > 0 && (
        <EntityRefLinks entityRefs={ownedByRelations} defaultKind="group" />
      )}
    </AboutField>
  );
};

export const DomainAboutField = (props: AboutFieldProps) => {
  const _props = propsWithDefaults(props, {
    label: 'Domain',
    value: 'No Domain',
    gridSizes: { xs: 12, sm: 6, lg: 4 },
  });

  const { entity } = useEntity();
  const partOfDomainRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'domain',
  });

  if (isKind(entity, 'system') || partOfDomainRelations.length > 0) {
    return (
      <AboutField {..._props}>
        {partOfDomainRelations.length > 0 && (
          <EntityRefLinks
            entityRefs={partOfDomainRelations}
            defaultKind="domain"
          />
        )}
      </AboutField>
    );
  }

  return <></>;
};

export const SystemAboutField = (props: AboutFieldProps) => {
  const _props = propsWithDefaults(props, {
    label: 'No System',
    value: 'No Domain',
    gridSizes: { xs: 12, sm: 6, lg: 4 },
  });

  const { entity } = useEntity();
  const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'system',
  });

  if (
    ['api', 'component', 'resource'].includes(getKind(entity)) ||
    partOfSystemRelations.length > 0
  ) {
    return (
      <AboutField {..._props}>
        {partOfSystemRelations.length > 0 && (
          <EntityRefLinks
            entityRefs={partOfSystemRelations}
            defaultKind="system"
          />
        )}
      </AboutField>
    );
  }

  return <></>;
};

export const ParentComponentAboutField = (props: AboutFieldProps) => {
  const _props = propsWithDefaults(props, {
    label: 'Parent Component',
    value: 'No Parent Component',
    gridSizes: { xs: 12, sm: 6, lg: 4 },
  });

  const { entity } = useEntity();
  const partOfComponentRelations = getEntityRelations(
    entity,
    RELATION_PART_OF,
    {
      kind: 'component',
    },
  );

  if (isKind(entity, 'component') && partOfComponentRelations.length > 0) {
    return (
      <AboutField {..._props}>
        <EntityRefLinks
          entityRefs={partOfComponentRelations}
          defaultKind="component"
        />
      </AboutField>
    );
  }

  return <></>;
};

export const TypeAboutField = (props: AboutFieldProps) => {
  const _props = propsWithDefaults(props, {
    label: 'Type',
    gridSizes: { xs: 12, sm: 6, lg: 4 },
  });

  const { entity } = useEntity();

  if (
    ['api', 'component', 'group', 'location', 'resource', 'template'].includes(
      getKind(entity),
    ) ||
    typeof entity?.spec?.type === 'string'
  ) {
    return (
      <AboutField
        label={_props.label}
        value={entity?.spec?.type as string}
        gridSizes={_props.gridSizes}
      />
    );
  }

  return <></>;
};

export const LifecycleAboutField = (props: AboutFieldProps) => {
  const _props = propsWithDefaults(props, {
    label: 'Lifecycle',
    gridSizes: { xs: 12, sm: 6, lg: 4 },
  });

  const { entity } = useEntity();

  if (
    ['api', 'component'].includes(getKind(entity)) ||
    typeof entity?.spec?.lifecycle === 'string'
  ) {
    <AboutField
      label={_props.label}
      value={entity?.spec?.lifecycle as string}
      gridSizes={_props.gridSizes}
    />;
  }

  return <></>;
};

export const TagsAboutField = (props: AboutFieldProps) => {
  const _props = propsWithDefaults(props, {
    label: 'Tags',
    value: 'No Tags',
    gridSizes: { xs: 12, sm: 6, lg: 4 },
  });

  const { entity } = useEntity();

  return (
    <AboutField {..._props}>
      {(entity?.metadata?.tags || []).map(t => (
        <Chip key={t} size="small" label={t} />
      ))}
    </AboutField>
  );
};

export const LocationTargetsAboutField = (props: AboutFieldProps) => {
  const _props = propsWithDefaults(props, {
    label: 'Targets',
    gridSizes: { xs: 12 },
  });

  const { entity } = useEntity();

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

  if (
    isKind(entity, 'location') &&
    (entity?.spec?.targets || entity?.spec?.target)
  ) {
    return (
      <AboutField {..._props}>
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
    );
  }

  return <></>;
};
