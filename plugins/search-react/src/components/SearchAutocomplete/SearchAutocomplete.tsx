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

import React, { ChangeEvent, ReactNode, useCallback, useMemo } from 'react';

import {
  CircularProgress,
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
} from '@material-ui/core';
import {
  Value,
  Autocomplete,
  AutocompleteProps,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteRenderInputParams,
} from '@material-ui/lab';

import { SearchContextProvider, useSearch } from '../../context';
import { SearchBar, SearchBarProps } from '../SearchBar';

/**
 * Props for {@link SearchAutocomplete}.
 *
 * @public
 */
export type SearchAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> = Omit<
  AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  'renderInput'
> & {
  inputDebounceTime?: SearchBarProps['debounceTime'];
  renderInput?: (params: AutocompleteRenderInputParams) => JSX.Element;
};

const withContext = (
  Component: <
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
  >(
    props: SearchAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  ) => JSX.Element,
) => {
  return <
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
  >(
    props: SearchAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  ) => (
    <SearchContextProvider useParentContext>
      <Component {...props} />
    </SearchContextProvider>
  );
};

/**
 * Recommended search autocomplete when you use the Search Provider or Search Context.
 *
 * @public
 */
export const SearchAutocomplete = withContext(
  <
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
  >({
    loading,
    value,
    onChange = () => {},
    options = [],
    getOptionLabel = (option: T) => String(option),
    renderInput,
    inputDebounceTime,
    fullWidth = true,
    clearOnBlur = false,
    ...rest
  }: SearchAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) => {
    const { setTerm } = useSearch();

    const inputValue = useMemo(() => {
      return value ? getOptionLabel(value as T) : '';
    }, [value, getOptionLabel]);

    const handleChange = useCallback(
      (
        event: ChangeEvent<{}>,
        newValue: Value<T, Multiple, DisableClearable, FreeSolo>,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<T>,
      ) => {
        onChange(event, newValue, reason, details);
        setTerm(newValue ? getOptionLabel(newValue as T) : '');
      },
      [getOptionLabel, setTerm, onChange],
    );

    const defaultRenderInput = useCallback(
      ({
        InputProps: { ref, endAdornment },
        InputLabelProps,
        ...params
      }: AutocompleteRenderInputParams) => (
        <SearchBar
          {...params}
          ref={ref}
          clearButton={false}
          value={inputValue}
          debounceTime={inputDebounceTime}
          endAdornment={
            loading ? (
              <CircularProgress
                data-testid="search-autocomplete-progressbar"
                color="inherit"
                size={20}
              />
            ) : (
              endAdornment
            )
          }
        />
      ),
      [loading, inputValue, inputDebounceTime],
    );

    return (
      <Autocomplete
        data-testid="search-autocomplete"
        value={value}
        onChange={handleChange}
        options={options}
        getOptionLabel={getOptionLabel}
        renderInput={renderInput ?? defaultRenderInput}
        fullWidth={fullWidth}
        clearOnBlur={clearOnBlur}
        {...rest}
      />
    );
  },
);

/**
 * Props for {@link SearchAutocompleteDefaultOption}.
 *
 * @public
 */
export type SearchAutocompleteDefaultOptionProps = {
  icon?: ReactNode;
  primaryText: ListItemTextProps['primary'];
  primaryTextTypographyProps?: ListItemTextProps['primaryTypographyProps'];
  secondaryText?: ListItemTextProps['secondary'];
  secondaryTextTypographyProps?: ListItemTextProps['secondaryTypographyProps'];
  disableTextTypography?: ListItemTextProps['disableTypography'];
};

/**
 * A default search bar autocomplete component.
 *
 * @public
 */
export const SearchAutocompleteDefaultOption = ({
  icon,
  primaryText,
  primaryTextTypographyProps,
  secondaryText,
  secondaryTextTypographyProps,
  disableTextTypography,
}: SearchAutocompleteDefaultOptionProps) => (
  <>
    {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
    <ListItemText
      primary={primaryText}
      primaryTypographyProps={primaryTextTypographyProps}
      secondary={secondaryText}
      secondaryTypographyProps={secondaryTextTypographyProps}
      disableTypography={disableTextTypography}
    />
  </>
);
