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
  ENTITY_DEFAULT_NAMESPACE,
  RELATION_CONSUMES_API,
  RELATION_PROVIDES_API,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  HeaderIconLinkRow,
  IconLinkVerticalProps,
  InfoCardVariants,
  Link,
} from '@backstage/core-components';
import { alertApiRef, useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  ScmIntegrationIcon,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import {
  catalogApiRef,
  getEntityMetadataEditUrl,
  getEntityRelations,
  getEntitySourceLocation,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import DocsIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import ExtensionIcon from '@material-ui/icons/Extension';
import React, { useCallback } from 'react';
import { viewTechDocRouteRef } from '../../routes';
import { AboutContent } from './AboutContent';

const useStyles = makeStyles({
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 10px)', // for pages without content header
    marginBottom: '10px',
  },
  fullHeightCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  gridItemCardContent: {
    flex: 1,
  },
  fullHeightCardContent: {
    flex: 1,
  },
});

type AboutCardProps = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
  variant?: InfoCardVariants;
};

export function AboutCard({ variant }: AboutCardProps) {
  const classes = useStyles();
  const { entity } = useEntity();
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const viewTechdocLink = useRouteRef(viewTechDocRouteRef);

  const entitySourceLocation = getEntitySourceLocation(
    entity,
    scmIntegrationsApi,
  );
  const entityMetadataEditUrl = getEntityMetadataEditUrl(entity);
  const providesApiRelations = getEntityRelations(
    entity,
    RELATION_PROVIDES_API,
  );
  const consumesApiRelations = getEntityRelations(
    entity,
    RELATION_CONSUMES_API,
  );
  const hasApis =
    providesApiRelations.length > 0 || consumesApiRelations.length > 0;

  const viewInSource: IconLinkVerticalProps = {
    label: 'View Source',
    disabled: !entitySourceLocation,
    icon: <ScmIntegrationIcon type={entitySourceLocation?.integrationType} />,
    href: entitySourceLocation?.locationTargetUrl,
  };
  const viewInTechDocs: IconLinkVerticalProps = {
    label: 'View TechDocs',
    disabled:
      !entity.metadata.annotations?.['backstage.io/techdocs-ref'] ||
      !viewTechdocLink,
    icon: <DocsIcon />,
    href:
      viewTechdocLink &&
      viewTechdocLink({
        namespace: entity.metadata.namespace || ENTITY_DEFAULT_NAMESPACE,
        kind: entity.kind,
        name: entity.metadata.name,
      }),
  };
  const viewApi: IconLinkVerticalProps = {
    title: hasApis ? '' : 'No APIs available',
    label: 'View API',
    disabled: !hasApis,
    icon: <ExtensionIcon />,
    href: 'api',
  };

  let cardClass = '';
  if (variant === 'gridItem') {
    cardClass = classes.gridItemCard;
  } else if (variant === 'fullHeight') {
    cardClass = classes.fullHeightCard;
  }

  let cardContentClass = '';
  if (variant === 'gridItem') {
    cardContentClass = classes.gridItemCardContent;
  } else if (variant === 'fullHeight') {
    cardContentClass = classes.fullHeightCardContent;
  }

  const refreshEntity = useCallback(async () => {
    await catalogApi.refreshEntity(stringifyEntityRef(entity));
    alertApi.post({ message: 'Refresh scheduled', severity: 'info' });
  }, [catalogApi, alertApi, entity]);

  return (
    <Card className={cardClass}>
      <CardHeader
        title="About"
        action={
          <>
            <IconButton
              aria-label="Refresh"
              title="Schedule entity refresh"
              onClick={refreshEntity}
            >
              <CachedIcon />
            </IconButton>
            <IconButton
              component={Link}
              aria-label="Edit"
              disabled={!entityMetadataEditUrl}
              title="Edit Metadata"
              to={entityMetadataEditUrl ?? '#'}
            >
              <EditIcon />
            </IconButton>
          </>
        }
        subheader={
          <HeaderIconLinkRow links={[viewInSource, viewInTechDocs, viewApi]} />
        }
      />
      <Divider />
      <CardContent className={cardContentClass}>
        <AboutContent entity={entity} />
      </CardContent>
    </Card>
  );
}
