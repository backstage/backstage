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
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FilterListIcon from '@material-ui/icons/FilterList';
import { LogViewerSearch } from './useLogViewerSearch';

export interface LogViewerControlsProps extends LogViewerSearch {}

export function LogViewerControls(props: LogViewerControlsProps) {
  const { resultCount, setResultIndex, toggleShouldFilter } = props;
  const resultIndex = props.resultIndex ?? 0;

  const increment = () => {
    if (resultCount !== undefined) {
      const next = resultIndex + 1;
      setResultIndex(next >= resultCount ? 0 : next);
    }
  };

  const decrement = () => {
    if (resultCount !== undefined) {
      const next = resultIndex - 1;
      setResultIndex(next < 0 ? resultCount - 1 : next);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        toggleShouldFilter();
      } else if (event.shiftKey) {
        decrement();
      } else {
        increment();
      }
    }
  };

  return (
    <>
      {resultCount !== undefined && (
        <>
          <IconButton size="small" onClick={decrement}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography>
            {Math.min(resultIndex + 1, resultCount)}/{resultCount}
          </Typography>
          <IconButton size="small" onClick={increment}>
            <ChevronRightIcon />
          </IconButton>
        </>
      )}
      <TextField
        size="small"
        variant="standard"
        placeholder="Search"
        value={props.searchInput}
        onKeyPress={handleKeyPress}
        onChange={e => props.setSearchInput(e.target.value)}
      />
      <IconButton size="small" onClick={toggleShouldFilter}>
        {props.shouldFilter ? (
          <FilterListIcon color="primary" />
        ) : (
          <FilterListIcon color="disabled" />
        )}
      </IconButton>
    </>
  );
}
