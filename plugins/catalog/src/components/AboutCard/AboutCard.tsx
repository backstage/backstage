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

import { useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from '@material-ui/icons/Cached';
import EditIcon from '@material-ui/icons/Edit';
import DocsIcon from '@material-ui/icons/Description';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';

import {
  AppIcon,
  HeaderIconLinkRow,
  IconLinkVerticalProps,
  InfoCardVariants,
  Link,
} from '@backstage/core-components';
import {
  alertApiRef,
  errorApiRef,
  useApp,
  useApi,
  useRouteRef,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import {
  ScmIntegrationIcon,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';

import {
  DEFAULT_NAMESPACE,
  ANNOTATION_EDIT_URL,
  ANNOTATION_LOCATION,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  getEntitySourceLocation,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { useEntityPermission } from '@backstage/plugin-catalog-react/alpha';
import { catalogEntityRefreshPermission } from '@backstage/plugin-catalog-common/alpha';

import {
  TECHDOCS_ANNOTATION,
  TECHDOCS_EXTERNAL_ANNOTATION,
} from '@backstage/plugin-techdocs-common';
import { buildTechDocsURL } from '@backstage/plugin-techdocs-react';

import { isTemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { taskCreatePermission } from '@backstage/plugin-scaffolder-common/alpha';

import { usePermission } from '@backstage/plugin-permission-react';

import { createFromTemplateRouteRef, viewTechDocRouteRef } from '../../routes';
import { catalogTranslationRef } from '../../alpha/translation';
import { useSourceTemplateCompoundEntityRef } from './hooks';
import { AboutContent } from './AboutContent';

export function useCatalogSourceIconLinkProps() {
  const { entity } = useEntity();
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const { t } = useTranslationRef(catalogTranslationRef);
  const entitySourceLocation = getEntitySourceLocation(
    entity,
    scmIntegrationsApi,
  );
  return {
    label: t('aboutCard.viewSource'),
    disabled: !entitySourceLocation,
    icon: <ScmIntegrationIcon type={entitySourceLocation?.integrationType} />,
    href: entitySourceLocation?.locationTargetUrl,
  };
}

// TODO: This hook is duplicated from the TechDocs plugin for backwards compatibility
// Remove it when the the legacy frontend system support is dropped.
function useTechdocsReaderIconLinkProps(): IconLinkVerticalProps {
  const { entity } = useEntity();
  const viewTechdocLink = useRouteRef(viewTechDocRouteRef);
  const { t } = useTranslationRef(catalogTranslationRef);

  return {
    label: t('aboutCard.viewTechdocs'),
    disabled:
      !(
        entity.metadata.annotations?.[TECHDOCS_ANNOTATION] ||
        entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]
      ) || !viewTechdocLink,
    icon: <DocsIcon />,
    href: buildTechDocsURL(entity, viewTechdocLink),
  };
}

// TODO: This hook is duplicated from the Scaffolder plugin for backwards compatibility
// Remove it when the the legacy frontend system support is dropped.
function useScaffolderTemplateIconLinkProps(): IconLinkVerticalProps {
  const app = useApp();
  const { entity } = useEntity();
  const templateRoute = useRouteRef(createFromTemplateRouteRef);
  const { t } = useTranslationRef(catalogTranslationRef);
  const Icon = app.getSystemIcon('scaffolder') ?? CreateComponentIcon;
  const { allowed: canCreateTemplateTask } = usePermission({
    permission: taskCreatePermission,
  });

  return {
    label: t('aboutCard.launchTemplate'),
    icon: <Icon />,
    disabled: !templateRoute || !canCreateTemplateTask,
    href:
      templateRoute &&
      templateRoute({
        templateName: entity.metadata.name,
        namespace: entity.metadata.namespace || DEFAULT_NAMESPACE,
      }),
  };
}

function DefaultAboutCardSubheader() {
  const { entity } = useEntity();
  const catalogSourceIconLink = useCatalogSourceIconLinkProps();
  const techdocsreaderIconLink = useTechdocsReaderIconLinkProps();
  const scaffolderTemplateIconLink = useScaffolderTemplateIconLinkProps();

  const links = [catalogSourceIconLink, techdocsreaderIconLink];
  if (isTemplateEntityV1beta3(entity)) {
    links.push(scaffolderTemplateIconLink);
  }

  return <HeaderIconLinkRow links={links} />;
}

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

/**
 * Props for {@link EntityAboutCard}.
 *
 * @public
 */
export type AboutCardProps = {
  variant?: InfoCardVariants;
};

export interface InternalAboutCardProps extends AboutCardProps {
  subheader?: JSX.Element;
}

export function InternalAboutCard(props: InternalAboutCardProps) {
  const { variant, subheader } = props;
  const classes = useStyles();
  const { entity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const errorApi = useApi(errorApiRef);
  const templateRoute = useRouteRef(createFromTemplateRouteRef);
  const sourceTemplateRef = useSourceTemplateCompoundEntityRef(entity);
  const { allowed: canRefresh } = useEntityPermission(
    catalogEntityRefreshPermission,
  );
  const { t } = useTranslationRef(catalogTranslationRef);

  const entityMetadataEditUrl =
    entity.metadata.annotations?.[ANNOTATION_EDIT_URL];

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

  const entityLocation = entity.metadata.annotations?.[ANNOTATION_LOCATION];
  // Limiting the ability to manually refresh to the less expensive locations
  const allowRefresh =
    entityLocation?.startsWith('url:') || entityLocation?.startsWith('file:');
  const refreshEntity = useCallback(async () => {
    try {
      await catalogApi.refreshEntity(stringifyEntityRef(entity));
      alertApi.post({
        message: t('aboutCard.refreshScheduledMessage'),
        severity: 'info',
        display: 'transient',
      });
    } catch (e) {
      errorApi.post(e);
    }
  }, [catalogApi, entity, alertApi, t, errorApi]);

  return (
    <Card className={cardClass}>
      <CardHeader
        title={t('aboutCard.title')}
        action={
          <>
            {allowRefresh && canRefresh && (
              <IconButton
                aria-label={t('aboutCard.refreshButtonAriaLabel')}
                title={t('aboutCard.refreshButtonTitle')}
                onClick={refreshEntity}
              >
                <CachedIcon />
              </IconButton>
            )}
            <IconButton
              component={Link}
              aria-label={t('aboutCard.editButtonAriaLabel')}
              disabled={!entityMetadataEditUrl}
              title={t('aboutCard.editButtonTitle')}
              to={entityMetadataEditUrl ?? '#'}
            >
              <EditIcon />
            </IconButton>
            {sourceTemplateRef && templateRoute && (
              <IconButton
                component={Link}
                title={t('aboutCard.createSimilarButtonTitle')}
                to={templateRoute({
                  namespace: sourceTemplateRef.namespace,
                  templateName: sourceTemplateRef.name,
                })}
              >
                <AppIcon id="scaffolder" />
              </IconButton>
            )}
          </>
        }
        subheader={subheader ?? <DefaultAboutCardSubheader />}
      />
      <Divider />
      <CardContent className={cardContentClass}>
        <AboutContent entity={entity} />
      </CardContent>
    </Card>
  );
}

/**
 * Exported publicly via the EntityAboutCard
 *
 * NOTE: We generally do not accept pull requests to extend this class with more
 * props and customizability. If you need to tweak it, consider making a bespoke
 * card in your own repository instead, that is perfect for your own needs.
 */
export function AboutCard(props: AboutCardProps) {
  return <InternalAboutCard {...props} />;
}
