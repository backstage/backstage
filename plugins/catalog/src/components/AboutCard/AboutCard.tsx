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

import { RefreshCw, Pencil, FileText, PlusCircle } from 'lucide-react';

import {
  AppIcon,
  HeaderIconLinkRow,
  IconLinkVerticalProps,
  InfoCardVariants,
  Link,
  cn,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Separator,
  ShadcnButton as Button,
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
    icon: <FileText className="h-5 w-5" />,
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
  const Icon = app.getSystemIcon('scaffolder') ?? PlusCircle;
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

  const cardClass = cn(
    variant === 'gridItem' && 'flex flex-col h-[calc(100%-10px)] mb-2.5',
    variant === 'fullHeight' && 'flex flex-col h-full',
  );
  const cardContentClass = cn(
    (variant === 'gridItem' || variant === 'fullHeight') && 'flex-1',
  );

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          {t('aboutCard.title')}
        </CardTitle>
        <div className="flex items-center gap-1">
          {allowRefresh && canRefresh && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('aboutCard.refreshButtonAriaLabel')}
              title={t('aboutCard.refreshButtonTitle')}
              onClick={refreshEntity}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('aboutCard.editButtonAriaLabel')}
            title={t('aboutCard.editButtonTitle')}
            disabled={!entityMetadataEditUrl}
            asChild={!!entityMetadataEditUrl}
          >
            {entityMetadataEditUrl ? (
              <Link to={entityMetadataEditUrl}>
                <Pencil className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <Pencil className="h-4 w-4" />
              </span>
            )}
          </Button>
          {sourceTemplateRef && templateRoute && (
            <Button
              variant="ghost"
              size="icon"
              title={t('aboutCard.createSimilarButtonTitle')}
              asChild
            >
              <Link
                to={templateRoute({
                  namespace: sourceTemplateRef.namespace,
                  templateName: sourceTemplateRef.name,
                })}
              >
                <AppIcon id="scaffolder" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      {subheader !== undefined ? subheader : <DefaultAboutCardSubheader />}
      <Separator />
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
