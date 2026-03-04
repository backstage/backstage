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

import React, { ChangeEvent, useCallback, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import AutocompleteRenderInputParams from '@material-ui/lab/AutocompleteRenderInputParams';
import AutocompleteChangeDetails from '@material-ui/lab/AutocompleteChangeDetails';
import AutocompleteChangeReason from '@material-ui/lab/AutocompleteChangeReason';

import { SearchContextProvider, useSearch } from '../../context';
import { SearchBar, SearchBarProps } from '../SearchBar';

const useStyles = makeStyles(theme => ({
  loading: {
    right: theme.spacing(1),
    position: 'absolute',
  },
}));

/**
 * Props for {@link SearchAutocomplete}.
 *
 * @public
 */
export type SearchAutocompleteProps<Option> = Omit<
  AutocompleteProps<Option, undefined, undefined, boolean>,
  'renderInput' | 'disableClearable' | 'multiple'
> & {
  'data-testid'?: string;
  inputPlaceholder?: SearchBarProps['placeholder'];
  inputDebounceTime?: SearchBarProps['debounceTime'];
};

/**
 * Type for {@link SearchAutocomplete}.
 *
 * @public
 */
export type SearchAutocompleteComponent = <Option>(
  props: SearchAutocompleteProps<Option>,
) => JSX.Element;

const withContext = (
  Component: SearchAutocompleteComponent,
): SearchAutocompleteComponent => {
  return props => (
    <SearchContextProvider inheritParentContextIfAvailable>
      <Component {...props} />
    </SearchContextProvider>
  );
};

const SearchAutocompleteLoadingAdornment = () => {
  const classes = useStyles();
  return (
    <CircularProgress
      className={classes.loading}
      data-testid="search-autocomplete-progressbar"
      color="inherit"
      size={20}
    />
  );
};

/**
 * Recommended search autocomplete when you use the Search Provider or Search Context.
 *
 * @public
 */
export const SearchAutocomplete = withContext(
  function SearchAutocompleteComponent<Option>(
    props: SearchAutocompleteProps<Option>,
  ) {
    const {
      loading,
      value,
      onChange = () => {},
      options = [],
      getOptionLabel = (option: Option) => String(option),
      inputPlaceholder,
      inputDebounceTime,
      freeSolo = true,
      fullWidth = true,
      clearOnBlur = false,
      'data-testid': dataTestId = 'search-autocomplete',
      ...rest
    } = props;

    const { setTerm } = useSearch();

    const getInputValue = useCallback(
      (option?: null | string | Option) => {
        if (!option) return '';
        if (typeof option === 'string') return option;
        return getOptionLabel(option);
      },
      [getOptionLabel],
    );

    const inputValue = useMemo(
      () => getInputValue(value),
      [value, getInputValue],
    );

    const handleChange = useCallback(
      (
        event: ChangeEvent<{}>,
        option: null | string | Option,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<Option>,
      ) => {
        setTerm(getInputValue(option));
        onChange(event, option, reason, details);
      },
      [getInputValue, setTerm, onChange],
    );

    const renderInput = useCallback(
      ({
        InputProps: { ref: anchorRef, className, endAdornment },
        InputLabelProps,
        inputProps: {
          ref: inputRef,
          onChange: _acOnChange,
          value: _acValue,
          ...safeInputAttrs
        },
        ...params
      }: AutocompleteRenderInputParams) => {
        // Merge anchorRef (InputProps.ref — needed by Autocomplete for popup
        // positioning via setAnchorEl) with inputRef (inputProps.ref — needed
        // by useAutocomplete for focus management) so both point to the
        // native <input>.
        const mergedRef = (node: HTMLInputElement | null) => {
          if (typeof anchorRef === 'function') anchorRef(node);
          else if (anchorRef)
            (
              anchorRef as React.MutableRefObject<HTMLInputElement | null>
            ).current = node;
          if (typeof inputRef === 'function') inputRef(node);
          else if (inputRef)
            (
              inputRef as React.MutableRefObject<HTMLInputElement | null>
            ).current = node;
        };
        return (
          <SearchBar
            {...params}
            {...(safeInputAttrs as React.InputHTMLAttributes<HTMLInputElement>)}
            ref={mergedRef}
            clearButton={false}
            value={inputValue}
            placeholder={inputPlaceholder}
            debounceTime={inputDebounceTime}
            endAdornment={
              loading ? <SearchAutocompleteLoadingAdornment /> : endAdornment
            }
            className={className}
          />
        );
      },
      [loading, inputValue, inputPlaceholder, inputDebounceTime],
    );

    return (
      <Autocomplete
        {...rest}
        data-testid={dataTestId}
        value={value}
        onChange={handleChange}
        options={options}
        getOptionLabel={getOptionLabel}
        renderInput={renderInput}
        freeSolo={freeSolo}
        fullWidth={fullWidth}
        clearOnBlur={clearOnBlur}
      />
    );
  },
);
