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
import { useFunctions } from '../../hooks/useFunctions';
import {
  AZURE_FUNCTIONS_ANNOTATION,
  useServiceEntityAnnotations,
} from '../../hooks/useServiceEntityAnnotations';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import ErrorBoundary from '../ErrorBoundary';
import { useEntity } from '@backstage/plugin-catalog-react';
import { OverviewTable } from '../OverviewTableComponent/OverviewTable';

export const isAzureFunctionsAvailable = (entity: Entity) =>
  entity?.metadata.annotations?.[AZURE_FUNCTIONS_ANNOTATION];

const AzureFunctionsOverview = ({ entity }: { entity: Entity }) => {
  const { functionsName } = useServiceEntityAnnotations(entity);

  const [functionsData] = useFunctions({
    functionsName,
  });

  return (
    <>
      <OverviewTable
        data={functionsData.data ?? []}
        loading={functionsData.loading}
      />
    </>
  );
};

export const AzureFunctionsOverviewWidget = () => {
  const { entity } = useEntity();

  if (!isAzureFunctionsAvailable(entity)) {
    return (
      <MissingAnnotationEmptyState annotation={AZURE_FUNCTIONS_ANNOTATION} />
    );
  }

  return (
    <ErrorBoundary>
      <AzureFunctionsOverview entity={entity} />
    </ErrorBoundary>
  );
};
