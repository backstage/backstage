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
import React, { useEffect, useMemo, useState } from 'react';
import { useEntityList } from '../../hooks/useEntityListProvider';
import useAsync from 'react-use/lib/useAsync';
import { EntityFieldFilter } from '../../filters';
import { catalogApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';

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

function useEntityFieldFilter(opts: { filterValue: string }): {
  availableOptions: { [k: string]: number } | undefined;
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

  useEffect(() => {
    updateFilters({
      option: selectedOptions.length
        ? new EntityFieldFilter(selectedOptions, opts.filterValue)
        : undefined,
    });
  }, [selectedOptions, updateFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const catalogApi = useApi(catalogApiRef);
  const { value: availableOptions } = useAsync(async () => {
    const facet = opts.filterValue;
    const { facets } = await catalogApi.getEntityFacets({
      facets: [facet],
      filter: filters.kind?.getCatalogFilters(),
    });
    return Object.fromEntries(
      facets[facet].map(({ value, count }) => [value, count]),
    );
  }, [filters.kind]);

  return {
    availableOptions,
    selectedOptions,
    setSelectedOptions,
  };
}

/** @public */
export const EntityGenericPicker = (props: EntityGenericPickerProps) => {
  const { name, filterValue } = props;

  const { availableOptions, selectedOptions, setSelectedOptions } =
    useEntityFieldFilter({
      filterValue: filterValue,
    });

  if (!Object.keys(availableOptions ?? {}).length) return null;

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">{name}</Typography>
      <Autocomplete
        multiple
        options={Object.keys(availableOptions ?? {})}
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
