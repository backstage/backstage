/*
 * Copyright 2021 The Backstage Authors
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

import React, { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { useEntityTypeFilter } from '../../hooks/useEntityTypeFilter';

import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { Select } from '@backstage/core-components';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Props for {@link EntityTypePicker}.
 *
 * @public
 */
export interface EntityTypePickerProps {
  initialFilter?: string;
  hidden?: boolean;
}

/** @public */
export const EntityTypePicker = (props: EntityTypePickerProps) => {
  const { hidden, initialFilter } = props;
  const alertApi = useApi(alertApiRef);
  const { error, availableTypes, selectedTypes, setSelectedTypes } =
    useEntityTypeFilter();
  const { t } = useTranslationRef(catalogReactTranslationRef);

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: t('entityTypePicker.errorMessage'),
        severity: 'error',
      });
    }
    if (initialFilter) {
      setSelectedTypes([initialFilter]);
    }
  }, [error, alertApi, initialFilter, setSelectedTypes, t]);

  if (availableTypes.length === 0 || error) return null;

  availableTypes.sort((a, b) =>
    a.toLocaleLowerCase('en-US').localeCompare(b.toLocaleLowerCase('en-US')),
  );

  const items = [
    { value: 'all', label: t('entityTypePicker.optionAllTitle') },
    ...availableTypes.map((type: string) => ({
      value: type,
      label: type,
    })),
  ];

  return hidden ? null : (
    <Box pb={1} pt={1}>
      <Select
        label={t('entityTypePicker.title')}
        items={items}
        selected={(items.length > 1 ? selectedTypes[0] : undefined) ?? 'all'}
        onChange={value =>
          setSelectedTypes(value === 'all' ? [] : [String(value)])
        }
      />
    </Box>
  );
};
