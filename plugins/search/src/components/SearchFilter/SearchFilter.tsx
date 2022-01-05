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

import {
  AutocompleteFilter,
  SearchAutocompleteFilterProps,
} from './SearchFilter.Autocomplete';
import { useSearch } from '../SearchContext';
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
  values?: string[];
  asyncValues?: (partial: string) => Promise<string[]>;
  asyncDebounce?: number;
  defaultValue?: string[] | string | null;
};

/**
 * @public
 */
export type SearchFilterWrapperProps = SearchFilterComponentProps & {
  component: (props: SearchFilterComponentProps) => ReactElement;
  debug?: boolean;
};

const CheckboxFilter = (props: SearchFilterComponentProps) => {
  const { className, defaultValue, label, name, values = [] } = props;
  const classes = useStyles();
  const { filters, setFilters } = useSearch();
  useDefaultFilterValue(name, defaultValue);

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
      fullWidth
      data-testid="search-checkboxfilter-next"
    >
      <FormLabel className={classes.label}>{label || name}</FormLabel>
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

const SelectFilter = (props: SearchFilterComponentProps) => {
  const {
    asyncValues,
    asyncDebounce,
    className,
    defaultValue,
    label,
    name,
    values: givenValues,
  } = props;
  const classes = useStyles();
  useDefaultFilterValue(name, defaultValue);
  const { value: values = [], loading } = useAsyncFilterValues(
    asyncValues,
    '',
    givenValues,
    asyncDebounce,
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
      <InputLabel className={classes.label} margin="dense">
        {label || name}
      </InputLabel>
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
 * @public
 */
SearchFilter.Autocomplete = (props: SearchAutocompleteFilterProps) => (
  <SearchFilter {...props} component={AutocompleteFilter} />
);

/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchFilter /> component instead. This component will be removed in an
 * upcoming release.
 */
const SearchFilterNext = SearchFilter;

export { SearchFilter, SearchFilterNext };
