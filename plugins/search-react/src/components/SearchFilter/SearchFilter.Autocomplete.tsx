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

import { ChangeEvent, useState, useRef } from 'react';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  AutocompleteGetTagProps,
  AutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';

import { useSearch } from '../../context';
import { useAsyncFilterValues, useDefaultFilterValue } from './hooks';
import { SearchFilterComponentProps } from './SearchFilter';
import { ensureFilterValueWithLabel, FilterValueWithLabel } from './types';

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

  // Stabilize filterValue to prevent referential changes on every render.
  // ensureFilterValueWithLabel creates new objects each time, which would
  // cause MUI Autocomplete to reset the input (via onInputChange 'reset').
  const filterValueRef = useRef<
    FilterValueWithLabel | FilterValueWithLabel[] | null
  >(multiple ? [] : null);
  const rawFilterValue = filters[name] as string | string[] | undefined;
  const serializedRaw = JSON.stringify(rawFilterValue);
  const prevSerializedRef = useRef<string | undefined>(undefined);
  if (prevSerializedRef.current !== serializedRaw) {
    prevSerializedRef.current = serializedRaw;
    const withLabel = ensureFilterValueWithLabel(rawFilterValue);
    filterValueRef.current = withLabel || (multiple ? [] : null);
  }
  const filterValue = filterValueRef.current;

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
          [name]: Array.isArray(newValue)
            ? newValue.map(v => v.value)
            : newValue.value,
        };
      }
      return { ...others };
    });

    // Since we ignore 'reset' reason in onInputChange (to prevent the input
    // from being cleared on every re-render), we must explicitly clear or
    // update the input after a selection.
    if (multiple) {
      setInputValue('');
    } else {
      setInputValue(newValue && !Array.isArray(newValue) ? newValue.label : '');
    }
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
      onInputChange={(_, newValue, reason) => {
        // In multiple mode, ignore 'reset' to prevent MUI from clearing the
        // input when the value prop reference changes on re-render.
        // In single mode, 'reset' is needed to display the selected label.
        if (reason !== 'reset' || !multiple) {
          setInputValue(newValue);
        }
      }}
      getOptionLabel={option => option.label}
      getOptionSelected={(option, value) => !!value && option.value === value.value}
      renderInput={renderInput}
      renderTags={renderTags}
    />
  );
};
