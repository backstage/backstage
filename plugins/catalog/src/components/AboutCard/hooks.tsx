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
import React from 'react';
import {
  CompoundEntityRef,
  DEFAULT_NAMESPACE,
  Entity,
  parseEntityRef,
} from '@backstage/catalog-model';
import { useApi, useApp, useRouteRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/lib/useAsync';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { createFromTemplateRouteRef, viewTechDocRouteRef } from '../../routes';
import {
  ScmIntegrationIcon,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { getEntitySourceLocation } from '@backstage/plugin-catalog-react';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import DocsIcon from '@material-ui/icons/Description';
import { IconLinkVerticalProps } from '@backstage/core-components';
import { catalogTranslationRef } from '../../alpha';
import { usePermission } from '@backstage/plugin-permission-react';
import { taskCreatePermission } from '@backstage/plugin-scaffolder-common/alpha';
import { isTemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

const TECHDOCS_ANNOTATION = 'backstage.io/techdocs-ref';
const TECHDOCS_EXTERNAL_ANNOTATION = 'backstage.io/techdocs-entity';

// todo: should this be a constant in a scaffolder package?
const SOURCE_TEMPLATE_ANNOTATION = 'backstage.io/source-template';

/**
 * Returns the compound entity ref of the source template that was used to
 * create this entity (assuming that it still exists and the user has access
 * to it).
 */
export const useSourceTemplateCompoundEntityRef = (entity: Entity) => {
  const catalogApi = useApi(catalogApiRef);
  const { value: sourceTemplateRef } = useAsync(async () => {
    const refCandidate =
      entity.metadata.annotations?.[SOURCE_TEMPLATE_ANNOTATION];
    let compoundRefCandidate: CompoundEntityRef | undefined;

    if (!refCandidate) {
      return undefined;
    }

    try {
      // Check for access and that this template still exists.
      const template = await catalogApi.getEntityByRef(refCandidate);
      compoundRefCandidate = parseEntityRef(refCandidate);

      return template !== undefined ? compoundRefCandidate : undefined;
    } catch {
      return undefined;
    }
  }, [catalogApi, entity]);

  return sourceTemplateRef;
};

/**
 * Returns the default set of icons links displayed in the about card sub header
 */
export const useDefaultIconLinks = (
  entity: Entity,
  iconLinks?: IconLinkVerticalProps[],
): IconLinkVerticalProps[] => {
  const app = useApp();
  const { t } = useTranslationRef(catalogTranslationRef);
  const scmIntegrationsApi = useApi(scmIntegrationsApiRef);
  const templateRoute = useRouteRef(createFromTemplateRouteRef);
  const viewTechdocLink = useRouteRef(viewTechDocRouteRef);
  const { allowed: canCreateTemplateTask } = usePermission({
    permission: taskCreatePermission,
  });

  if (iconLinks) {
    return iconLinks;
  }

  const entitySourceLocation = getEntitySourceLocation(
    entity,
    scmIntegrationsApi,
  );

  const viewInSource: IconLinkVerticalProps = {
    label: t('aboutCard.viewSource'),
    disabled: !entitySourceLocation,
    icon: <ScmIntegrationIcon type={entitySourceLocation?.integrationType} />,
    href: entitySourceLocation?.locationTargetUrl,
  };

  let techdocsRef: CompoundEntityRef | undefined;

  if (entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]) {
    try {
      techdocsRef = parseEntityRef(
        entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION],
      );
      // not a fan of this but we don't care if the parseEntityRef fails
    } catch {
      techdocsRef = undefined;
    }
  }
  const viewInTechDocs: IconLinkVerticalProps = {
    label: t('aboutCard.viewTechdocs'),
    disabled:
      !(
        entity.metadata.annotations?.[TECHDOCS_ANNOTATION] ||
        entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]
      ) || !viewTechdocLink,
    icon: <DocsIcon />,
    href:
      viewTechdocLink &&
      (techdocsRef
        ? viewTechdocLink({
            namespace: techdocsRef.namespace || DEFAULT_NAMESPACE,
            kind: techdocsRef.kind,
            name: techdocsRef.name,
          })
        : viewTechdocLink({
            namespace: entity.metadata.namespace || DEFAULT_NAMESPACE,
            kind: entity.kind,
            name: entity.metadata.name,
          })),
  };

  const subHeaderLinks = [viewInSource, viewInTechDocs];

  if (isTemplateEntityV1beta3(entity)) {
    const Icon = app.getSystemIcon('scaffolder') ?? CreateComponentIcon;

    const launchTemplate: IconLinkVerticalProps = {
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

    subHeaderLinks.push(launchTemplate);
  }

  return subHeaderLinks;
};
