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

import React, { ChangeEvent, useEffect, useState } from 'react';
import { Chip, TextField } from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteGetTagProps,
  AutocompleteRenderInputParams,
} from '@material-ui/lab';
import { useSearch } from '../SearchContext';
import { useAsyncFilterValues } from './hooks';
import { SearchFilterComponentProps } from './SearchFilter';

/**
 * @public
 */
export type SearchAutocompleteFilterProps = SearchFilterComponentProps & {
  multiple?: boolean;
  limitTags?: number;
};

export const AutocompleteFilter = (props: SearchAutocompleteFilterProps) => {
  const {
    asyncValues,
    asyncDebounce,
    className,
    defaultValue,
    multiple,
    name,
    values: givenValues,
    label,
    limitTags,
  } = props;
  const [inputValue, setInputValue] = useState<string>('');
  const { value: values, loading } = useAsyncFilterValues(
    asyncValues,
    inputValue,
    givenValues,
    asyncDebounce,
  );
  const { filters, setFilters } = useSearch();
  const filterValue =
    (filters[name] as string | string[] | undefined) || (multiple ? [] : null);

  useEffect(() => {
    const defaultIsEmpty = !defaultValue;
    const defaultIsEmptyArray =
      Array.isArray(defaultValue) && defaultValue.length === 0;

    if (!defaultIsEmpty && !defaultIsEmptyArray) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: defaultValue,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      label={label || name}
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
      multiple={multiple}
      className={className}
      id={`${multiple ? 'multi-' : ''}select-filter-${name}--select`}
      options={values || []}
      loading={loading}
      limitTags={limitTags}
      value={filterValue}
      onChange={handleChange}
      onInputChange={(_, newValue) => setInputValue(newValue)}
      renderInput={renderInput}
      renderTags={renderTags}
    />
  );
};
