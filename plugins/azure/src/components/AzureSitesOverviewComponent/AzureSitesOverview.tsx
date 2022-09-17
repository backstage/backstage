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

import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { useSites } from '../../hooks/useSites';
import {
  AZURE_RESOURCE_NAME_ANNOTATION,
  useServiceEntityAnnotations,
} from '../../hooks/useServiceEntityAnnotations';
import {
  ErrorBoundary,
  MissingAnnotationEmptyState,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { AzureSitesOverviewTable } from '../AzureSitesOverviewTableComponent/AzureSitesOverviewTable';

/** @public */
export const isAzureResourceNameAvailable = (entity: Entity) =>
  entity?.metadata.annotations?.[AZURE_RESOURCE_NAME_ANNOTATION];

const AzureSitesOverview = ({ entity }: { entity: Entity }) => {
  const { resourceName } = useServiceEntityAnnotations(entity);

  const [sites] = useSites({
    name: resourceName,
  });

  if (sites.error) {
    return (
      <div>
        <ResponseErrorPanel error={sites.error} />
      </div>
    );
  }

  return (
    <AzureSitesOverviewTable
      data={sites.data?.items ?? []}
      loading={sites.loading}
    />
  );
};

/** @public */
export const AzureSitesOverviewWidget = () => {
  const { entity } = useEntity();

  if (!isAzureResourceNameAvailable(entity)) {
    return (
      <MissingAnnotationEmptyState
        annotation={AZURE_RESOURCE_NAME_ANNOTATION}
      />
    );
  }

  return (
    <ErrorBoundary>
      <AzureSitesOverview entity={entity} />
    </ErrorBoundary>
  );
};
