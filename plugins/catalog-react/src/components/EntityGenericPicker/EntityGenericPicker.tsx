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

import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  DefaultEntityFilters,
  useEntityList,
} from '../../hooks/useEntityListProvider';
import sortBy from 'lodash/sortBy';
import useAsync from 'react-use/lib/useAsync';
import { EntityFieldFilter } from '../../filters';
import { catalogApiRef } from '../../api';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

/** @public */
export type CatalogReactEntityGenericPickerClassKey = 'input';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/**
 * Props for {@link EntityGenericPicker}.
 *
 * @public
 */
export interface EntityGenericPickerProps {
  name: string;
  filterValue: string;
}

function useAvailableOptions(
  filterValue: string,
  filters: DefaultEntityFilters,
) {
  const catalogApi = useApi(catalogApiRef);

  const [availableOptions, setAvailableOptions] = useState<string[]>([]);

  const {
    error,
    loading,
    value: facets,
  } = useAsync(async () => {
    const facet = filterValue;
    const items = await catalogApi
      .getEntityFacets({
        facets: [facet],
        filter: filters.kind?.getCatalogFilters(),
      })
      .then(response => response.facets[facet] || []);

    return items;
  }, [catalogApi]);

  const facetsRef = useRef(facets);
  useEffect(() => {
    const oldFacets = facetsRef.current;
    facetsRef.current = facets;
    // Delay processing hook until facets load updates have settled to generate list of kinds;
    // This prevents resetting the kind filter due to saved kind value from query params not matching the
    // empty set of kind values while values are still being loaded; also only run this hook on changes
    // to facets
    if (loading || oldFacets === facets || !facets) {
      return;
    }

    const newOptions = [
      ...new Set(
        sortBy(facets, f => f.value).map(f =>
          f.value.toLocaleLowerCase('en-US'),
        ),
      ),
    ];

    setAvailableOptions(newOptions);
  }, [loading, facets, setAvailableOptions]);

  return { loading, error, availableOptions };
}

function useEntityFieldFilter(opts: { filterValue: string }): {
  loading: boolean;
  error?: Error;
  availableOptions: string[];
  selectedOptions: string[];
  setSelectedOptions: (option: string[]) => void;
} {
  const {
    filters,
    queryParameters: { option: optionParameter },
    updateFilters,
  } = useEntityList();

  const queryParamGenres = useMemo(() => {
    return [optionParameter].flat().filter(Boolean) as string[];
  }, [optionParameter]);

  const [selectedOptions, setSelectedOptions] = useState(
    queryParamGenres.length ? queryParamGenres : filters.option?.values ?? [],
  );

  // Set selected options on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamGenres.length) {
      setSelectedOptions(queryParamGenres);
    }
  }, [queryParamGenres]);

  // Set selected kind from filters; this happens when the kind filter is
  // updated from another component
  // useEffect(() => {
  //   if (filters.kind?.value) {
  //     setSelectedOption(filters.kind?.value);
  //   }
  // }, [filters.kind]);

  useEffect(() => {
    updateFilters({
      option: selectedOptions.length
        ? new EntityFieldFilter(selectedOptions, opts.filterValue)
        : undefined,
    });
  }, [selectedOptions, updateFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const { availableOptions, loading, error } = useAvailableOptions(
    opts.filterValue,
    filters,
  );

  return {
    loading,
    error,
    availableOptions,
    selectedOptions,
    setSelectedOptions,
  };
}

/** @public */
export const EntityGenericPicker = (props: EntityGenericPickerProps) => {
  const { name, filterValue } = props;

  const alertApi = useApi(alertApiRef);

  const { error, availableOptions, selectedOptions, setSelectedOptions } =
    useEntityFieldFilter({
      filterValue: filterValue,
    });

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load entity kinds`,
        severity: 'error',
      });
    }
  }, [error, alertApi]);

  if (availableOptions?.length === 0 || error) return null;

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">{name}</Typography>
      <Autocomplete
        multiple
        options={availableOptions}
        value={selectedOptions}
        onChange={(_: object, value: string[]) => setSelectedOptions(value)}
        renderOption={(option, { selected }) => (
          <FormControlLabel
            control={
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={selected}
              />
            }
            label={option}
          />
        )}
        size="small"
        popupIcon={<ExpandMoreIcon data-testid={`${name}-picker-expand`} />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
