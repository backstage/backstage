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

import Box from '@material-ui/core/Box';
import { TextFieldProps } from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { catalogApiRef } from '../../api';
import { EntityAutocompletePickerOption } from './EntityAutocompletePickerOption';
import {
  DefaultEntityFilters,
  useEntityList,
} from '../../hooks/useEntityListProvider';
import { EntityFilter } from '../../types';
import { reduceBackendCatalogFilters } from '../../utils/filters';
import { CatalogAutocomplete } from '../CatalogAutocomplete';

/** @public */
export type AllowedEntityFilters<T extends DefaultEntityFilters> = {
  [K in keyof T]-?: NonNullable<T[K]> extends EntityFilter & {
    values: string[];
  }
    ? K
    : never;
}[keyof T];

/** @public */
export type EntityAutocompletePickerProps<
  T extends DefaultEntityFilters = DefaultEntityFilters,
  Name extends AllowedEntityFilters<T> = AllowedEntityFilters<T>,
> = {
  label: string;
  name: Name;
  path: string;
  showCounts?: boolean;
  Filter: { new (values: string[]): NonNullable<T[Name]> };
  InputProps?: TextFieldProps;
  initialSelectedOptions?: string[];
  filtersForAvailableValues?: Array<keyof T>;
};

/** @public */
export type CatalogReactEntityAutocompletePickerClassKey = 'root' | 'label';

const useStyles = makeStyles(
  {
    root: {},
    label: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
  },
  { name: 'CatalogReactEntityAutocompletePicker' },
);

/** @public */
export function EntityAutocompletePicker<
  T extends DefaultEntityFilters = DefaultEntityFilters,
  Name extends AllowedEntityFilters<T> = AllowedEntityFilters<T>,
>(props: EntityAutocompletePickerProps<T, Name>) {
  const {
    label,
    name,
    path,
    showCounts,
    Filter,
    InputProps,
    initialSelectedOptions = [],
    filtersForAvailableValues = ['kind'],
  } = props;
  const classes = useStyles();

  const {
    updateFilters,
    filters,
    queryParameters: { [name]: queryParameter },
  } = useEntityList<T>();

  const catalogApi = useApi(catalogApiRef);
  const availableValuesFilters = filtersForAvailableValues.map(
    f => filters[f] as EntityFilter | undefined,
  );
  const { value: availableValues } = useAsync(async () => {
    const facet = path;
    const { facets } = await catalogApi.getEntityFacets({
      facets: [facet],
      filter: reduceBackendCatalogFilters(
        availableValuesFilters.filter(Boolean) as EntityFilter[],
      ),
    });

    return Object.fromEntries(
      facets[facet].map(({ value, count }) => [value, count]),
    );
  }, [...availableValuesFilters]);

  const queryParameters = useMemo(
    () => [queryParameter].flat().filter(Boolean) as string[],
    [queryParameter],
  );

  const [selectedOptions, setSelectedOptions] = useState(
    queryParameters.length
      ? queryParameters
      : (filters[name] as unknown as { values: string[] })?.values ??
          initialSelectedOptions,
  );

  // Set selected options on query parameter updates; this happens at initial page load and from
  // external updates to the page location
  useEffect(() => {
    if (queryParameters.length) {
      setSelectedOptions(queryParameters);
    }
  }, [queryParameters]);

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
    <Box className={classes.root} pb={1} pt={1}>
      <CatalogAutocomplete<string, true>
        multiple
        disableCloseOnSelect
        label={label}
        name={`${String(name)}-picker`}
        options={availableOptions}
        value={selectedOptions}
        TextFieldProps={InputProps}
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
      />
    </Box>
  );
}
