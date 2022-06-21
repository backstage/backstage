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

import React, {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useEffect,
  useCallback,
} from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import {
  InputBase,
  InputBaseProps,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearButton from '@material-ui/icons/Clear';

import {
  AnalyticsContext,
  configApiRef,
  useApi,
} from '@backstage/core-plugin-api';

import {
  SearchContextProvider,
  useSearch,
  useSearchContextCheck,
} from '../../context';
import { TrackSearch } from '../SearchTracker';

/**
 * Props for {@link SearchBarBase}.
 *
 * @public
 */
export type SearchBarBaseProps = Omit<InputBaseProps, 'onChange'> & {
  debounceTime?: number;
  clearButton?: boolean;
  onClear?: () => void;
  onSubmit?: () => void;
  onChange: (value: string) => void;
};

/**
 * All search boxes exported by the search plugin are based on the <SearchBarBase />,
 * and this one is based on the <InputBase /> component from Material UI.
 * Recommended if you don't use Search Provider or Search Context.
 *
 * @public
 */
export const SearchBarBase = ({
  onChange,
  onKeyDown,
  onSubmit,
  debounceTime = 200,
  clearButton = true,
  fullWidth = true,
  value: defaultValue,
  inputProps: defaultInputProps = {},
  endAdornment: defaultEndAdornment,
  ...props
}: SearchBarBaseProps) => {
  const configApi = useApi(configApiRef);
  const [value, setValue] = useState<string>(defaultValue as string);
  const hasSearchContext = useSearchContextCheck();

  useEffect(() => {
    setValue(prevValue =>
      prevValue !== defaultValue ? (defaultValue as string) : prevValue,
    );
  }, [defaultValue]);

  useDebounce(() => onChange(value), debounceTime, [value]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) onKeyDown(e);
      if (onSubmit && e.key === 'Enter') {
        onSubmit();
      }
    },
    [onKeyDown, onSubmit],
  );

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const placeholder = `Search in ${
    configApi.getOptionalString('app.title') || 'Backstage'
  }`;

  const startAdornment = (
    <InputAdornment position="start">
      <IconButton aria-label="Query" disabled>
        <SearchIcon />
      </IconButton>
    </InputAdornment>
  );

  const endAdornment = (
    <InputAdornment position="end">
      <IconButton aria-label="Clear" onClick={handleClear}>
        <ClearButton />
      </IconButton>
    </InputAdornment>
  );

  const searchBar = (
    <TrackSearch>
      <InputBase
        data-testid="search-bar-next"
        value={value}
        placeholder={placeholder}
        startAdornment={startAdornment}
        endAdornment={clearButton ? endAdornment : defaultEndAdornment}
        inputProps={{ 'aria-label': 'Search', ...defaultInputProps }}
        fullWidth={fullWidth}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </TrackSearch>
  );

  return hasSearchContext ? (
    searchBar
  ) : (
    <SearchContextProvider>{searchBar}</SearchContextProvider>
  );
};

/**
 * Props for {@link SearchBar}.
 *
 * @public
 */
export type SearchBarProps = Partial<SearchBarBaseProps>;

/**
 * Recommended search bar when you use the Search Provider or Search Context.
 *
 * @public
 */
export const SearchBar = ({ onChange, ...props }: SearchBarProps) => {
  const { term, setTerm } = useSearch();

  const handleChange = useCallback(
    (newValue: string) => {
      if (onChange) {
        onChange(newValue);
      } else {
        setTerm(newValue);
      }
    },
    [onChange, setTerm],
  );

  return (
    <AnalyticsContext
      attributes={{ pluginId: 'search', extension: 'SearchBar' }}
    >
      <SearchBarBase value={term} onChange={handleChange} {...props} />
    </AnalyticsContext>
  );
};
