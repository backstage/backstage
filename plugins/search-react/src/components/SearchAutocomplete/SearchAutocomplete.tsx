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

import { ChangeEvent, useCallback, useMemo } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete, {
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';
import {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from '@material-ui/lab/useAutocomplete';

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
        InputProps: { ref, className, endAdornment },
        InputLabelProps,
        ...params
      }: AutocompleteRenderInputParams) => (
        <SearchBar
          {...params}
          ref={ref}
          clearButton={false}
          value={inputValue}
          placeholder={inputPlaceholder}
          debounceTime={inputDebounceTime}
          endAdornment={
            loading ? <SearchAutocompleteLoadingAdornment /> : endAdornment
          }
          InputProps={{ className }}
        />
      ),
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
