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

import React, { useCallback } from 'react';

import { InputBaseProps } from '@material-ui/core';

import {
  SearchBarBase as RealSearchBarBase,
  useSearch,
} from '@backstage/plugin-search-react';

/**
 * Props for {@link SearchBarBase}.
 *
 * @public
 * @deprecated Import from `@backstage/plugin-search-react` instead.
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
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
export const SearchBarBase = RealSearchBarBase;

/**
 * Props for {@link SearchBar}.
 *
 * @public
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
export type SearchBarProps = Partial<SearchBarBaseProps>;

/**
 * Recommended search bar when you use the Search Provider or Search Context.
 *
 * @public
 * @deprecated Import from `@backstage/plugin-search-react` instead.
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

  return <SearchBarBase value={term} onChange={handleChange} {...props} />;
};
