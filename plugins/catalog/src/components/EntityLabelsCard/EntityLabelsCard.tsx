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
import { Table, TableColumn } from '@backstage/core-components';
import { EntityLabelsEmptyState } from './EntityLabelsEmptyState';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface EntityLabelsCardProps {
  // Accepted for API compatibility but not applied.
  // The new entity page layout handles card sizing.
  // TODO: Discuss removal in code review.
  variant?: string;
  title?: string;
}

const useStyles = makeStyles(_ => ({
  key: {
    fontWeight: 'bold',
  },
}));

export const EntityLabelsCard = (props: EntityLabelsCardProps) => {
  const { variant: _variant, title } = props;
  const { entity } = useEntity();
  const classes = useStyles();
  const { t } = useTranslationRef(catalogTranslationRef);

  const columns: TableColumn<{ key: string; value: string }>[] = [
    {
      render: row => {
        return (
          <Typography className={classes.key} variant="body2">
            {row.key}
          </Typography>
        );
      },
    },
    {
      field: 'value',
    },
  ];

  const labels = entity?.metadata?.labels;

  return (
    <EntityInfoCard title={title || t('entityLabelsCard.title')}>
      {!labels || Object.keys(labels).length === 0 ? (
        <EntityLabelsEmptyState />
      ) : (
        <Table
          columns={columns}
          data={Object.keys(labels).map(labelKey => ({
            key: labelKey,
            value: labels[labelKey],
          }))}
          options={{
            search: false,
            showTitle: true,
            loadingType: 'linear',
            header: false,
            padding: 'dense',
            pageSize: 5,
            toolbar: false,
            paging: Object.keys(labels).length > 5,
          }}
        />
      )}
    </EntityInfoCard>
  );
};
