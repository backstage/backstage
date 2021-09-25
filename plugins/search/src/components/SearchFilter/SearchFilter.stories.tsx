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

import { Grid, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import { MemoryRouter } from 'react-router';
import { SearchContext, SearchFilter } from '../index';

export default {
  title: 'Plugins/Search/SearchFilter',
  component: SearchFilter,
};

export const CheckBoxFilter = () => {
  const [filters, setFilters] = useState({});
  const defaultValue = {
    filters,
    setFilters,
  };

  return (
    <MemoryRouter>
      {/* @ts-ignore (defaultValue requires more than what is used here) */}
      <SearchContext.Provider value={defaultValue}>
        <Grid container direction="row">
          <Grid item xs={4}>
            <Paper style={{ padding: 10 }}>
              <SearchFilter.Checkbox
                name="Search Checkbox Filter"
                values={['value1', 'value2']}
              />
            </Paper>
          </Grid>
        </Grid>
      </SearchContext.Provider>
    </MemoryRouter>
  );
};

export const SelectFilter = () => {
  const [filters, setFilters] = useState({});
  const defaultValue = {
    filters,
    setFilters,
  };

  return (
    <MemoryRouter>
      {/* @ts-ignore (defaultValue requires more than what is used here) */}
      <SearchContext.Provider value={defaultValue}>
        <Grid container direction="row">
          <Grid item xs={4}>
            <Paper style={{ padding: 10 }}>
              <SearchFilter.Select
                name="Search Select Filter"
                values={['value1', 'value2']}
              />
            </Paper>
          </Grid>
        </Grid>
      </SearchContext.Provider>
    </MemoryRouter>
  );
};

export const SelectMultipleFilter = () => {
  const [filters, setFilters] = useState({});
  const defaultValue = {
    filters,
    setFilters,
  };

  return (
    <MemoryRouter>
      {/* @ts-ignore (defaultValue requires more than what is used here) */}
      <SearchContext.Provider value={defaultValue}>
        <Grid container direction="row">
          <Grid item xs={4}>
            <Paper style={{ padding: 10 }}>
              <SearchFilter.SelectMultiple
                name="Search Select Filter"
                values={['value1', 'value2']}
              />
            </Paper>
          </Grid>
        </Grid>
      </SearchContext.Provider>
    </MemoryRouter>
  );
};
