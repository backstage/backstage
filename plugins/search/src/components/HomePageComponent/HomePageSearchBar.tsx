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

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { SearchBarBase } from '../SearchBar';
import { useNavigateToQuery } from '../util';

const useStyles = makeStyles({
  searchBar: {
    border: '1px solid #555',
    borderRadius: '6px',
    fontSize: '1.5em',
  },
});

type Props = {
  placeholder?: string;
};

export const HomePageSearchBar = ({ placeholder }: Props) => {
  const [query, setQuery] = React.useState('');
  const handleSearch = useNavigateToQuery();
  const classes = useStyles();

  const handleSubmit = () => {
    handleSearch({ query });
  };

  const handleChange = React.useCallback(
    value => {
      setQuery(value);
    },
    [setQuery],
  );

  return (
    <SearchBarBase
      onSubmit={handleSubmit}
      onChange={handleChange}
      value={query}
      className={classes.searchBar}
      placeholder={placeholder}
    />
  );
};
