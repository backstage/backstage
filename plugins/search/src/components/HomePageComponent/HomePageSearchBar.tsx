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

import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  SearchBarBase,
  SearchBarBaseProps,
} from '@backstage/plugin-search-react';
import { useNavigateToQuery } from '../util';

const useStyles = makeStyles({
  root: {
    border: '1px solid #555',
    borderRadius: '6px',
    fontSize: '1.5em',
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
export const HomePageSearchBar = ({ ...props }: HomePageSearchBarProps) => {
  const classes = useStyles(props);
  const [query, setQuery] = useState('');
  const handleSearch = useNavigateToQuery();

  const handleSubmit = () => {
    handleSearch({ query });
  };

  const handleChange = useCallback(
    value => {
      setQuery(value);
    },
    [setQuery],
  );

  return (
    <SearchBarBase
      classes={{ root: classes.root }}
      value={query}
      onSubmit={handleSubmit}
      onChange={handleChange}
      {...props}
    />
  );
};
