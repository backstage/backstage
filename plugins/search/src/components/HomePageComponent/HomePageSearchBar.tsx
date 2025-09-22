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

import { useCallback, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  SearchBarBase,
  SearchBarBaseProps,
} from '@backstage/plugin-search-react';
import { useNavigateToQuery } from '../util';

const useStyles = makeStyles({
  searchBarRoot: {
    fontSize: '1.5em',
  },
  searchBarOutline: {
    border: '1px solid #555',
    borderRadius: '6px',
  },
});

/**
 * Props for {@link HomePageSearchBar}.
 *
 * @public
 */
export type HomePageSearchBarProps = Partial<
  Omit<SearchBarBaseProps, 'onChange' | 'onSubmit'>
>;

/**
 * The search bar created specifically for the composable home page.
 */
export const HomePageSearchBar = (props: HomePageSearchBarProps) => {
  const classes = useStyles(props);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLInputElement | null>(null);

  const handleSearch = useNavigateToQuery();

  // This handler is called when "enter" is pressed
  const handleSubmit = useCallback(() => {
    // Using ref to get the current field value without waiting for a query debounce
    handleSearch({ query: ref.current?.value ?? '' });
  }, [handleSearch]);

  return (
    <SearchBarBase
      value={query}
      onSubmit={handleSubmit}
      onChange={setQuery}
      inputProps={{ ref }}
      InputProps={{
        ...props.InputProps,
        classes: {
          root: classes.searchBarRoot,
          notchedOutline: classes.searchBarOutline,
          ...props.InputProps?.classes,
        },
      }}
      {...props}
    />
  );
};
