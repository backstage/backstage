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

import React, { useEffect, KeyboardEvent, useState } from 'react';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useDebounce } from 'react-use';
import { InputBase, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearButton from '@material-ui/icons/Clear';

import { useSearch } from '../SearchContext';

type PresenterProps = {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSubmit?: () => void;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  clearButton?: boolean;
};

export const SearchBarBase = ({
  autoFocus,
  value,
  onChange,
  onSubmit,
  className,
  placeholder: overridePlaceholder,
  clearButton = true,
}: PresenterProps) => {
  const configApi = useApi(configApiRef);

  const onKeyDown = React.useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (onSubmit && e.key === 'Enter') {
        onSubmit();
      }
    },
    [onSubmit],
  );

  const handleClear = React.useCallback(() => {
    onChange('');
  }, [onChange]);

  const placeholder =
    overridePlaceholder ??
    `Search in ${configApi.getOptionalString('app.title') || 'Backstage'}`;

  return (
    <InputBase
      // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      data-testid="search-bar-next"
      fullWidth
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      inputProps={{ 'aria-label': 'Search' }}
      startAdornment={
        <InputAdornment position="start">
          <IconButton aria-label="Query" disabled>
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      }
      endAdornment={
        clearButton && (
          <InputAdornment position="end">
            <IconButton aria-label="Clear" onClick={handleClear}>
              <ClearButton />
            </IconButton>
          </InputAdornment>
        )
      }
      {...(className && { className })}
      {...(onSubmit && { onKeyDown })}
    />
  );
};

type Props = {
  autoFocus?: boolean;
  className?: string;
  debounceTime?: number;
  placeholder?: string;
  clearButton?: boolean;
};

export const SearchBar = ({
  autoFocus,
  className,
  debounceTime = 0,
  placeholder,
  clearButton = true,
}: Props) => {
  const { term, setTerm } = useSearch();
  const [value, setValue] = useState<string>(term);

  useEffect(() => {
    setValue(prevValue => (prevValue !== term ? term : prevValue));
  }, [term]);

  useDebounce(() => setTerm(value), debounceTime, [value]);

  const handleQuery = (newValue: string) => {
    setValue(newValue);
  };

  const handleClear = () => setValue('');

  return (
    <SearchBarBase
      // decision up to adopter, read https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md#no-autofocus
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      className={className}
      value={value}
      onChange={handleQuery}
      onClear={handleClear}
      placeholder={placeholder}
      clearButton={clearButton}
    />
  );
};
