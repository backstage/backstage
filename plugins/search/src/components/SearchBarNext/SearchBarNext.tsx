/*
 * Copyright 2021 Spotify AB
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

import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import { Paper, InputBase, IconButton, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearButton from '@material-ui/icons/Clear';
import { useSearch } from '../SearchContext';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
}));

type Props = {
  debounceTime?: number;
};

export const SearchBarNext = ({ debounceTime = 200 }: Props) => {
  const classes = useStyles();
  const { term, setTerm, setPageCursor } = useSearch();
  const [value, setValue] = useState<string>(term);

  useDebounce(
    () => {
      setTerm(value);
    },
    debounceTime,
    [value],
  );

  const handleSearch = (event: React.ChangeEvent | React.FormEvent) => {
    event.preventDefault();
    setValue((event.target as HTMLInputElement).value as string);
  };

  const handleClearSearchBar = () => {
    setTerm('');
    setPageCursor('');
  };

  return (
    <Paper component="form" onSubmit={handleSearch} className={classes.root}>
      <IconButton disabled type="submit" aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Search in Backstage"
        value={value}
        onChange={handleSearch}
        inputProps={{ 'aria-label': 'search backstage' }}
      />
      <IconButton aria-label="search" onClick={handleClearSearchBar}>
        <ClearButton />
      </IconButton>
    </Paper>
  );
};
