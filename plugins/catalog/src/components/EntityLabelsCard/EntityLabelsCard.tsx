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

import { useEntity, EntityInfoCard } from '@backstage/plugin-catalog-react';
import { EntityLabelsEmptyState } from './EntityLabelsEmptyState';
import {
  Table,
  CellText,
  type ColumnConfig,
  type TableItem,
} from '@backstage/ui';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface EntityLabelsCardProps {
  title?: string;
}

interface LabelItem extends TableItem {
  id: string;
  key: string;
  value: string;
}

const columnConfig: ColumnConfig<LabelItem>[] = [
  {
    id: 'key',
    label: 'Label',
    isRowHeader: true,
    cell: item => <CellText title={item.key} />,
  },
  {
    id: 'value',
    label: 'Value',
    cell: item => <CellText title={item.value} />,
  },
];

export const EntityLabelsCard = (props: EntityLabelsCardProps) => {
  const { title } = props;
  const { entity } = useEntity();
  const { t } = useTranslationRef(catalogTranslationRef);

  const labels = entity?.metadata?.labels;

  return (
    <EntityInfoCard title={title || t('entityLabelsCard.title')}>
      {!labels || Object.keys(labels).length === 0 ? (
        <EntityLabelsEmptyState />
      ) : (
        <Table
          columnConfig={columnConfig}
          data={Object.keys(labels).map(labelKey => ({
            id: labelKey,
            key: labelKey,
            value: labels[labelKey],
          }))}
          pagination={{ type: 'none' }}
        />
      )}
    </EntityInfoCard>
  );
};
