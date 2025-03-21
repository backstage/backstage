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

import React, { ReactElement, ChangeEvent, useRef } from 'react';
import { capitalize } from 'lodash';
import { v4 as uuid } from 'uuid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import { Select, SelectedItems } from '@backstage/core-components';

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
  checkboxWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  textWrapper: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
          classes={{
            root: classes.checkboxWrapper,
            label: classes.textWrapper,
          }}
          label={value}
          control={
            <Checkbox
              color="primary"
              inputProps={{ 'aria-labelledby': value }}
              value={value}
              name={value}
              onChange={handleChange}
              checked={((filters[name] as string[]) ?? []).includes(value)}
            />
          }
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
  const allOptionValue = useRef(uuid());
  const allOption = { value: allOptionValue.current, label: 'All' };
  const { filters, setFilters } = useSearch();

  const handleChange = (value: SelectedItems) => {
    setFilters(prevFilters => {
      const { [name]: filter, ...others } = prevFilters;
      return value !== allOptionValue.current
        ? { ...others, [name]: value as string }
        : others;
    });
  };

  const items = [allOption, ...values.map(value => ({ value, label: value }))];

  return (
    <FormControl
      disabled={loading}
      className={className}
      variant="filled"
      fullWidth
      data-testid="search-selectfilter-next"
    >
      <Select
        label={label ?? capitalize(name)}
        selected={(filters[name] || allOptionValue.current) as string}
        onChange={handleChange}
        items={items}
      />
    </FormControl>
  );
};

/**
 * @public
 */
const SearchFilter = (props: SearchFilterWrapperProps) => {
  const { component: Element, ...elementProps } = props;
  return <Element {...elementProps} />;
};

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
