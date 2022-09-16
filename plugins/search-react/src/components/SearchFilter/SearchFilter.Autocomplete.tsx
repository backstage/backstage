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

import React, { ChangeEvent, useState } from 'react';
import { Chip, TextField } from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteGetTagProps,
  AutocompleteRenderInputParams,
} from '@material-ui/lab';

import { useSearch } from '../../context';
import { useAsyncFilterValues, useDefaultFilterValue } from './hooks';
import { SearchFilterComponentProps } from './SearchFilter';

/**
 * @public
 */
export type SearchAutocompleteFilterProps = SearchFilterComponentProps & {
  filterSelectedOptions?: boolean;
  limitTags?: number;
  multiple?: boolean;
};

/**
 * @public
 */
export const AutocompleteFilter = (props: SearchAutocompleteFilterProps) => {
  const {
    className,
    defaultValue,
    name,
    values: givenValues,
    valuesDebounceMs,
    label,
    filterSelectedOptions,
    limitTags,
    multiple,
  } = props;
  const [inputValue, setInputValue] = useState<string>('');
  useDefaultFilterValue(name, defaultValue);
  const asyncValues =
    typeof givenValues === 'function' ? givenValues : undefined;
  const defaultValues =
    typeof givenValues === 'function' ? undefined : givenValues;
  const { value: values, loading } = useAsyncFilterValues(
    asyncValues,
    inputValue,
    defaultValues,
    valuesDebounceMs,
  );
  const { filters, setFilters } = useSearch();
  const filterValue =
    (filters[name] as string | string[] | undefined) || (multiple ? [] : null);

  // Set new filter values on input change.
  const handleChange = (
    _: ChangeEvent<{}>,
    newValue: string | string[] | null,
  ) => {
    setFilters(prevState => {
      const { [name]: filter, ...others } = prevState;

      if (newValue) {
        return { ...others, [name]: newValue };
      }
      return { ...others };
    });
  };

  // Provide the input field.
  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      name="search"
      variant="outlined"
      label={label}
      fullWidth
    />
  );

  // Render tags as primary-colored chips.
  const renderTags = (
    tagValue: string[],
    getTagProps: AutocompleteGetTagProps,
  ) =>
    tagValue.map((option: string, index: number) => (
      <Chip label={option} color="primary" {...getTagProps({ index })} />
    ));

  return (
    <Autocomplete
      filterSelectedOptions={filterSelectedOptions}
      limitTags={limitTags}
      multiple={multiple}
      className={className}
      id={`${multiple ? 'multi-' : ''}select-filter-${name}--select`}
      options={values || []}
      loading={loading}
      value={filterValue}
      onChange={handleChange}
      onInputChange={(_, newValue) => setInputValue(newValue)}
      renderInput={renderInput}
      renderTags={renderTags}
    />
  );
};
