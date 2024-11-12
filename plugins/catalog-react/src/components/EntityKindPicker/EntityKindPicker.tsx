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

import { Select } from '@backstage/core-components';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import Box from '@material-ui/core/Box';
import React, { useEffect } from 'react';
import { useEntityKindFilter } from '../../hooks';
import { filterKinds } from './kindFilterUtils';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Props for {@link EntityKindPicker}.
 *
 * @public
 */
export interface EntityKindPickerProps {
  /**
   * Entity kinds to show in the dropdown; by default all kinds are fetched from the catalog and
   * displayed.
   */
  allowedKinds?: string[];
  initialFilter?: string;
  hidden?: boolean;
}

/** @public */
export const EntityKindPicker = (props: EntityKindPickerProps) => {
  const { allowedKinds, hidden, initialFilter = 'component' } = props;
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const alertApi = useApi(alertApiRef);

  const { error, allKinds, selectedKind, setSelectedKind } =
    useEntityKindFilter({
      initialFilter: initialFilter,
    });

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: t('entityKindPicker.errorMessage'),
        severity: 'error',
      });
    }
  }, [error, alertApi, t]);

  if (error) return null;

  const options = filterKinds(allKinds, allowedKinds, selectedKind);

  const items = Object.keys(options).map(key => ({
    value: key,
    label: options[key],
  }));

  return hidden ? null : (
    <Box pb={1} pt={1}>
      <Select
        label={t('entityKindPicker.title')}
        items={items}
        selected={selectedKind.toLocaleLowerCase('en-US')}
        onChange={value => setSelectedKind(String(value))}
      />
    </Box>
  );
};
