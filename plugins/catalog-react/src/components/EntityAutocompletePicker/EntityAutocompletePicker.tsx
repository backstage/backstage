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

import { Box, TextFieldProps, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../../api';
import { EntityAutocompletePickerOption } from './EntityAutocompletePickerOption';
import { EntityAutocompletePickerInput } from './EntityAutocompletePickerInput';
import {
  DefaultEntityFilters,
  useEntityList,
} from '../../hooks/useEntityListProvider';
import { EntityFilter } from '../../types';
import _ from 'lodash';

type KeysMatchingCondition<T, V, K> = T extends V ? K : never;
type KeysMatching<T, V> = {
  [K in keyof T]-?: KeysMatchingCondition<T[K], V, K>;
}[keyof T];

type AllowedEntityFilters<T extends DefaultEntityFilters> = KeysMatching<
  T,
  EntityFilter & { values: string[] }
>;

interface ConstructableFilter<T> {
  new (values: string[]): T;
}

/** @public */
export type EntityAutocompletePickerProps<
  T extends DefaultEntityFilters = DefaultEntityFilters,
  Name extends AllowedEntityFilters<T> = AllowedEntityFilters<T>,
> = {
  label: string;
  name: Name;
  path: string;
  showCounts?: boolean;
  Filter: ConstructableFilter<NonNullable<T[Name]>>;
  InputProps?: TextFieldProps;
};

/** @public */
export function EntityAutocompletePicker<
  T extends DefaultEntityFilters = DefaultEntityFilters,
  Name extends AllowedEntityFilters<T> = AllowedEntityFilters<T>,
>(props: EntityAutocompletePickerProps<T, Name>) {
  const { label, name, path, showCounts, Filter, InputProps } = props;

  const {
    updateFilters,
    filters,
    queryParameters: { [name]: queryParameter },
  } = useEntityList<T>();

  const catalogApi = useApi(catalogApiRef);
  const { value: availableValues } = useAsync(async () => {
    const facet = path;
    const { facets } = await catalogApi.getEntityFacets({
      facets: [facet],
      filter: filters.kind?.getCatalogFilters(),
    });

    return Object.fromEntries(
      facets[facet].map(({ value, count }) => [value, count]),
    );
  }, [filters.kind]);

  const queryParameters = useMemo(
    () => [queryParameter].flat().filter(Boolean) as string[],
    [queryParameter],
  );

  const [selectedOptions, setSelectedOptions] = useState(
    queryParameters.length
      ? queryParameters
      : (filters[name] as unknown as { values: string[] })?.values ?? [],
  );

  // Set selected options on query parameter updates; this happens at initial page load and from
  // external updates to the page location
  useEffect(() => {
    if (
      queryParameters.length &&
      !_.isEqual(selectedOptions, queryParameters)
    ) {
      setSelectedOptions(queryParameters);
    }
  }, [selectedOptions, queryParameters]);

  const availableOptions = Object.keys(availableValues ?? {});
  const shouldAddFilter = selectedOptions.length && availableOptions.length;

  useEffect(() => {
    updateFilters({
      [name]: shouldAddFilter ? new Filter(selectedOptions) : undefined,
    } as Partial<T>);
  }, [name, shouldAddFilter, selectedOptions, Filter, updateFilters]);

  const filter = filters[name];
  if (
    (filter && typeof filter === 'object' && !('values' in filter)) ||
    !availableOptions.length
  ) {
    return null;
  }

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button" component="label">
        {label}
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={availableOptions}
          value={selectedOptions}
          onChange={(_event: object, options: string[]) =>
            setSelectedOptions(options)
          }
          renderOption={(option, { selected }) => (
            <EntityAutocompletePickerOption
              selected={selected}
              value={option}
              availableOptions={availableValues}
              showCounts={!!showCounts}
            />
          )}
          size="small"
          popupIcon={
            <ExpandMoreIcon data-testid={`${String(name)}-picker-expand`} />
          }
          renderInput={params => (
            <EntityAutocompletePickerInput {...params} {...InputProps} />
          )}
        />
      </Typography>
    </Box>
  );
}
