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

import { ReactElement, useRef } from 'react';
import { capitalize } from 'lodash';
import { v4 as uuid } from 'uuid';
import {
  Checkbox,
  cn,
  Select,
  SelectedItems,
} from '@backstage/core-components';

import { useSearch } from '../../context';
import {
  AutocompleteFilter,
  SearchAutocompleteFilterProps,
} from './SearchFilter.Autocomplete';
import { useAsyncFilterValues, useDefaultFilterValue } from './hooks';
import { ensureFilterValueWithLabel, FilterValue } from './types';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { searchReactTranslationRef } from '../../translation';

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
  values?: FilterValue[] | ((partial: string) => Promise<FilterValue[]>);
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
    label: formLabel,
    name,
    values: givenValues = [],
    valuesDebounceMs,
  } = props;
  const { filters, setFilters } = useSearch();
  useDefaultFilterValue(name, defaultValue);
  const asyncValues =
    typeof givenValues === 'function' ? givenValues : undefined;
  const defaultValues =
    typeof givenValues === 'function'
      ? undefined
      : givenValues.map(v => ensureFilterValueWithLabel(v));
  const { value: values = [], loading } = useAsyncFilterValues(
    asyncValues,
    '',
    defaultValues,
    valuesDebounceMs,
  );

  const handleChange = (value: string, checked: boolean) => {
    setFilters(prevFilters => {
      const { [name]: filter, ...others } = prevFilters;
      const rest = ((filter as string[]) || []).filter(i => i !== value);
      const items = checked ? [...rest, value] : rest;
      return items.length ? { ...others, [name]: items } : others;
    });
  };

  return (
    <fieldset
      className={cn(
        'w-full space-y-1',
        loading && 'opacity-50 pointer-events-none',
        className,
      )}
      disabled={loading}
      data-testid="search-checkboxfilter-next"
    >
      {!!formLabel && (
        <legend className="text-sm font-medium capitalize">{formLabel}</legend>
      )}
      {values.map(({ value, label }) => (
        <label
          key={value}
          className="flex w-full items-center gap-2 cursor-pointer"
        >
          <Checkbox
            checked={((filters[name] as string[]) ?? []).includes(value)}
            onCheckedChange={checked => handleChange(value, !!checked)}
            aria-label={label}
          />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
            {label}
          </span>
        </label>
      ))}
    </fieldset>
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
  const { t } = useTranslationRef(searchReactTranslationRef);
  useDefaultFilterValue(name, defaultValue);
  const asyncValues =
    typeof givenValues === 'function' ? givenValues : undefined;
  const defaultValues =
    typeof givenValues === 'function'
      ? undefined
      : givenValues?.map(v => ensureFilterValueWithLabel(v));
  const { value: values = [], loading } = useAsyncFilterValues(
    asyncValues,
    '',
    defaultValues,
    valuesDebounceMs,
  );
  const allOptionValue = useRef(uuid());
  const allOption = {
    value: allOptionValue.current,
    label: t('searchFilter.allOptionTitle'),
  };
  const { filters, setFilters } = useSearch();

  const handleChange = (value: SelectedItems) => {
    setFilters(prevFilters => {
      const { [name]: filter, ...others } = prevFilters;
      return value !== allOptionValue.current
        ? { ...others, [name]: value as string }
        : others;
    });
  };

  const items = [allOption, ...values];

  return (
    <div
      className={cn(
        'w-full',
        loading && 'opacity-50 pointer-events-none',
        className,
      )}
      data-testid="search-selectfilter-next"
    >
      <Select
        label={label ?? capitalize(name)}
        selected={(filters[name] || allOptionValue.current) as string}
        onChange={handleChange}
        items={items}
      />
    </div>
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
