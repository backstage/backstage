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

import React, { ReactElement, ChangeEvent } from 'react';
import {
  makeStyles,
  FormControl,
  FormControlLabel,
  InputLabel,
  Checkbox,
  Select,
  MenuItem,
  FormLabel,
} from '@material-ui/core';

import { useSearch } from '../../context';
import {
  AutocompleteFilter,
  SearchAutocompleteFilterProps,
} from './SearchFilter.Autocomplete';
import { useAsyncFilterValues, useDefaultFilterValue } from './hooks';

const useStyles = makeStyles({
  label: {
    textTransform: 'capitalize',
  },
});

/**
 * @public
 */
export type SearchFilterComponentProps = {
  className?: string;
  name: string;
  label?: string;
  /**
   * Either an array of values directly, or an async function to return a list
   * of values to be used in the filter. In the autocomplete filter, the last
   * input value is provided as an input to allow values to be filtered. This
   * function is debounced and values cached.
   */
  values?: string[] | ((partial: string) => Promise<string[]>);
  defaultValue?: string[] | string | null;
  /**
   * Debounce time in milliseconds, used when values is an async callback.
   * Defaults to 250ms.
   */
  valuesDebounceMs?: number;
};

/**
 * @public
 */
export type SearchFilterWrapperProps = SearchFilterComponentProps & {
  component: (props: SearchFilterComponentProps) => ReactElement;
  debug?: boolean;
};

/**
 * @public
 */
export const CheckboxFilter = (props: SearchFilterComponentProps) => {
  const {
    className,
    defaultValue,
    label,
    name,
    values: givenValues = [],
    valuesDebounceMs,
  } = props;
  const classes = useStyles();
  const { filters, setFilters } = useSearch();
  useDefaultFilterValue(name, defaultValue);
  const asyncValues =
    typeof givenValues === 'function' ? givenValues : undefined;
  const defaultValues =
    typeof givenValues === 'function' ? undefined : givenValues;
  const { value: values = [], loading } = useAsyncFilterValues(
    asyncValues,
    '',
    defaultValues,
    valuesDebounceMs,
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, checked },
    } = e;

    setFilters(prevFilters => {
      const { [name]: filter, ...others } = prevFilters;
      const rest = ((filter as string[]) || []).filter(i => i !== value);
      const items = checked ? [...rest, value] : rest;
      return items.length ? { ...others, [name]: items } : others;
    });
  };

  return (
    <FormControl
      className={className}
      disabled={loading}
      fullWidth
      data-testid="search-checkboxfilter-next"
    >
      {label ? <FormLabel className={classes.label}>{label}</FormLabel> : null}
      {values.map((value: string) => (
        <FormControlLabel
          key={value}
          control={
            <Checkbox
              color="primary"
              tabIndex={-1}
              inputProps={{ 'aria-labelledby': value }}
              value={value}
              name={value}
              onChange={handleChange}
              checked={((filters[name] as string[]) ?? []).includes(value)}
            />
          }
          label={value}
        />
      ))}
    </FormControl>
  );
};

/**
 * @public
 */
export const SelectFilter = (props: SearchFilterComponentProps) => {
  const {
    className,
    defaultValue,
    label,
    name,
    values: givenValues,
    valuesDebounceMs,
  } = props;
  const classes = useStyles();
  useDefaultFilterValue(name, defaultValue);
  const asyncValues =
    typeof givenValues === 'function' ? givenValues : undefined;
  const defaultValues =
    typeof givenValues === 'function' ? undefined : givenValues;
  const { value: values = [], loading } = useAsyncFilterValues(
    asyncValues,
    '',
    defaultValues,
    valuesDebounceMs,
  );
  const { filters, setFilters } = useSearch();

  const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
    const {
      target: { value },
    } = e;

    setFilters(prevFilters => {
      const { [name]: filter, ...others } = prevFilters;
      return value ? { ...others, [name]: value as string } : others;
    });
  };

  return (
    <FormControl
      disabled={loading}
      className={className}
      variant="filled"
      fullWidth
      data-testid="search-selectfilter-next"
    >
      {label ? (
        <InputLabel className={classes.label} margin="dense">
          {label}
        </InputLabel>
      ) : null}
      <Select
        variant="outlined"
        value={filters[name] || ''}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {values.map((value: string) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

/**
 * @public
 */
const SearchFilter = ({
  component: Element,
  ...props
}: SearchFilterWrapperProps) => <Element {...props} />;

SearchFilter.Checkbox = (
  props: Omit<SearchFilterWrapperProps, 'component'> &
    SearchFilterComponentProps,
) => <SearchFilter {...props} component={CheckboxFilter} />;

SearchFilter.Select = (
  props: Omit<SearchFilterWrapperProps, 'component'> &
    SearchFilterComponentProps,
) => <SearchFilter {...props} component={SelectFilter} />;

/**
 * A control surface for a given filter field name, rendered as an autocomplete
 * textfield. A hard-coded list of values may be provided, or an async function
 * which returns values may be provided instead.
 *
 * @public
 */
SearchFilter.Autocomplete = (props: SearchAutocompleteFilterProps) => (
  <SearchFilter {...props} component={AutocompleteFilter} />
);

export { SearchFilter };
