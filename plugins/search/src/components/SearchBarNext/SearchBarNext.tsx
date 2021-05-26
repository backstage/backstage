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

import React, { ChangeEvent, useState } from 'react';
import { useDebounce } from 'react-use';
import {
  Theme,
  Paper,
  InputBase,
  InputAdornment,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearButton from '@material-ui/icons/Clear';

import { useSearch } from '../SearchContext';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 0, 0, 1.5),
  },
  input: {
    flex: 1,
  },
}));

type Props = {
  debounceTime?: number;
};

export const SearchBarNext = ({ debounceTime = 0 }: Props) => {
  const classes = useStyles();
  const { term, setTerm } = useSearch();
  const [value, setValue] = useState<string>(term);

  useDebounce(() => setTerm(value), debounceTime, [value]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => setValue('');

  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search in Backstage"
        value={value}
        onChange={handleSearch}
        inputProps={{ 'aria-label': 'Search term' }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
      <IconButton aria-label="Clear term" onClick={handleClear}>
        <ClearButton />
      </IconButton>
    </Paper>
  );
};
