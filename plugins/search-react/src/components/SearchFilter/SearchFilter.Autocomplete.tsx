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

import { ChangeEvent, useState, useMemo } from 'react';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  AutocompleteGetTagProps,
  AutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';

import { useSearch } from '../../context';
import { useAsyncFilterValues, useDefaultFilterValue } from './hooks';
import { SearchFilterComponentProps } from './SearchFilter';
import {
  ensureFilterValueWithLabel,
  FilterValue,
  FilterValueWithLabel,
} from './types';

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
    typeof givenValues === 'function'
      ? undefined
      : givenValues?.map(v => ensureFilterValueWithLabel(v));
  const { value: values, loading } = useAsyncFilterValues(
    asyncValues,
    inputValue,
    defaultValues,
    valuesDebounceMs,
  );
  const { filters, setFilters } = useSearch();
  const filterValueWithLabel = ensureFilterValueWithLabel(
    filters[name] as FilterValue | FilterValue[] | undefined,
  );
  const filterValue = useMemo(
    () => filterValueWithLabel || (multiple ? [] : null),
    [filterValueWithLabel, multiple],
  );

  // Set new filter values on input change.
  const handleChange = (
    _: ChangeEvent<{}>,
    newValue: FilterValueWithLabel | FilterValueWithLabel[] | null,
  ) => {
    setFilters(prevState => {
      const { [name]: filter, ...others } = prevState;

      if (newValue) {
        return {
          ...others,
          [name]: newValue,
        };
      }
      return { ...others };
    });
    setInputValue('');
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
    tagValue: FilterValueWithLabel[],
    getTagProps: AutocompleteGetTagProps,
  ) =>
    tagValue.map((option, index: number) => (
      <Chip label={option.label} color="primary" {...getTagProps({ index })} />
    ));

  const handleInputChange = (
    _: ChangeEvent<{}>,
    newValue: string,
    reason: string,
  ) => {
    if (reason === 'input' || !multiple) {
      setInputValue(newValue);
    }
  };

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
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={option => option.label}
      renderOption={option => option.label}
      renderInput={renderInput}
      renderTags={renderTags}
    />
  );
};
