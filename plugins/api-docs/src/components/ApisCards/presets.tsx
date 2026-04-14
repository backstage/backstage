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

import { ApiEntity } from '@backstage/catalog-model';
import { TableColumn } from '@backstage/core-components';
import { EntityTable } from '@backstage/plugin-catalog-react';
import {
  EntityColumnConfig,
  entityDataTableColumns,
} from '@backstage/plugin-catalog-react/alpha';
import { ButtonIcon, Cell } from '@backstage/ui';
import { RiPuzzleLine } from '@remixicon/react';
import { useState } from 'react';
import { ApiTypeTitle } from '../ApiDefinitionCard';
import { ApiDefinitionDialog } from '../ApiDefinitionDialog';
import {
  TranslationFunction,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';
import { apiDocsTranslationRef } from '../../translation';

/** @deprecated Use `getApiEntityColumnConfig` instead. */
export function createSpecApiTypeColumn(
  t: TranslationFunction<typeof apiDocsTranslationRef.T>,
): TableColumn<ApiEntity> {
  return {
    title: t('apiEntityColumns.typeTitle'),
    field: 'spec.type',
    render: entity => <ApiTypeTitle apiEntity={entity} />,
  };
}

const ApiDefinitionButton = ({ apiEntity }: { apiEntity: ApiEntity }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslationRef(apiDocsTranslationRef);
  return (
    <>
      <ButtonIcon
        aria-label={t('apiDefinitionDialog.toggleButtonAriaLabel')}
        onPress={() => setDialogOpen(!dialogOpen)}
        variant="tertiary"
        size="small"
        icon={<RiPuzzleLine />}
      />
      <ApiDefinitionDialog
        entity={apiEntity}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

function createApiDefinitionColumn(
  t: TranslationFunction<typeof apiDocsTranslationRef.T>,
): TableColumn<ApiEntity> {
  return {
    title: t('apiEntityColumns.apiDefinitionTitle'),
    render: entity => <ApiDefinitionButton apiEntity={entity} />,
  };
}

/** @deprecated Use `getApiEntityColumnConfig` instead. */
export const getApiEntityColumns = (
  t: TranslationFunction<typeof apiDocsTranslationRef.T>,
): TableColumn<ApiEntity>[] => {
  return [
    EntityTable.columns.createEntityRefColumn({ defaultKind: 'API' }),
    EntityTable.columns.createSystemColumn(),
    EntityTable.columns.createOwnerColumn(),
    createSpecApiTypeColumn(t),
    EntityTable.columns.createSpecLifecycleColumn(),
    EntityTable.columns.createMetadataDescriptionColumn(),
    createApiDefinitionColumn(t),
  ];
};

// Column config presets

function createSpecApiTypeColumnConfig(
  t: TranslationFunction<typeof apiDocsTranslationRef.T>,
): EntityColumnConfig {
  return {
    id: 'apiType',
    label: t('apiEntityColumns.typeTitle'),
    isSortable: true,
    cell: entity => (
      <Cell>
        <ApiTypeTitle apiEntity={entity as unknown as ApiEntity} />
      </Cell>
    ),
    sortValue: entity =>
      (entity.spec as Record<string, string> | undefined)?.type ?? '',
  };
}

function createApiDefinitionColumnConfig(
  t: TranslationFunction<typeof apiDocsTranslationRef.T>,
): EntityColumnConfig {
  return {
    id: 'apiDefinition',
    label: t('apiEntityColumns.apiDefinitionTitle'),
    cell: entity => (
      <Cell>
        <ApiDefinitionButton apiEntity={entity as unknown as ApiEntity} />
      </Cell>
    ),
  };
}

export function getApiEntityColumnConfig(
  t: TranslationFunction<typeof apiDocsTranslationRef.T>,
): EntityColumnConfig[] {
  return [
    entityDataTableColumns.createEntityRefColumn({ defaultKind: 'API' }),
    entityDataTableColumns.createSystemColumn(),
    entityDataTableColumns.createOwnerColumn(),
    createSpecApiTypeColumnConfig(t),
    entityDataTableColumns.createSpecLifecycleColumn(),
    entityDataTableColumns.createMetadataDescriptionColumn(),
    createApiDefinitionColumnConfig(t),
  ];
}

export function getHasApisColumnConfig(
  t: TranslationFunction<typeof apiDocsTranslationRef.T>,
): EntityColumnConfig[] {
  return [
    entityDataTableColumns.createEntityRefColumn({ defaultKind: 'API' }),
    entityDataTableColumns.createOwnerColumn(),
    createSpecApiTypeColumnConfig(t),
    entityDataTableColumns.createSpecLifecycleColumn(),
    entityDataTableColumns.createMetadataDescriptionColumn(),
  ];
}
