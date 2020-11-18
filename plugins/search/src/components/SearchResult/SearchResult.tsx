/*
 * Copyright 2020 Spotify AB
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
import React, { useState, useEffect } from 'react';
import { useAsync } from 'react-use';

import { makeStyles, Typography, Grid, Divider } from '@material-ui/core';
import { Table, TableColumn, useApi } from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog';

import { FiltersButton, Filters, FiltersState } from '../Filters';
import SearchApi, { Result, SearchResults } from '../../apis';

const useStyles = makeStyles(theme => ({
  searchTerm: {
    background: '#eee',
    borderRadius: '10%',
  },
  tableHeader: {
    margin: theme.spacing(1, 0, 0, 0),
    display: 'flex',
  },
  divider: {
    width: '1px',
    margin: theme.spacing(0, 2),
    padding: theme.spacing(2, 0),
  },
}));

type SearchResultProps = {
  searchQuery?: string;
};

type TableHeaderProps = {
  searchQuery?: string;
  numberOfSelectedFilters: number;
  numberOfResults: number;
  handleToggleFilters: () => void;
};

type Filters = {
  selected: string;
  checked: Array<string | null>;
};

// TODO: move out column to make the search result component more generic
const columns: TableColumn[] = [
  {
    title: 'Component Id',
    field: 'name',
    highlight: true,
  },
  {
    title: 'Description',
    field: 'description',
  },
  {
    title: 'Owner',
    field: 'owner',
  },
  {
    title: 'Kind',
    field: 'kind',
  },
  {
    title: 'LifeCycle',
    field: 'lifecycle',
  },
];

const TableHeader = ({
  searchQuery,
  numberOfSelectedFilters,
  numberOfResults,
  handleToggleFilters,
}: TableHeaderProps) => {
  const classes = useStyles();

  return (
    <div className={classes.tableHeader}>
      <FiltersButton
        numberOfSelectedFilters={numberOfSelectedFilters}
        handleToggleFilters={handleToggleFilters}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <Grid item xs={12}>
        {searchQuery ? (
          <Typography variant="h6">
            {`${numberOfResults} `}
            {numberOfResults > 1 ? `results for ` : `result for `}
            <span className={classes.searchTerm}>"{searchQuery}"</span>{' '}
          </Typography>
        ) : (
          <Typography variant="h6">{`${numberOfResults} results`}</Typography>
        )}
      </Grid>
    </div>
  );
};

export const SearchResult = ({ searchQuery }: SearchResultProps) => {
  const catalogApi = useApi(catalogApiRef);

  const [showFilters, toggleFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    selected: 'All',
    checked: [],
  });

  const [filteredResults, setFilteredResults] = useState<SearchResults>([]);

  const searchApi = new SearchApi(catalogApi);

  const { loading, error, value: results } = useAsync(() => {
    return searchApi.getSearchResult();
  }, []);

  useEffect(() => {
    if (results) {
      let withFilters = results;

      // apply filters

      // filter on selected
      if (filters.selected !== 'All') {
        withFilters = results.filter((result: Result) =>
          filters.selected.includes(result.kind),
        );
      }

      // filter on checked
      if (filters.checked.length > 0) {
        withFilters = withFilters.filter((result: Result) =>
          filters.checked.includes(result.lifecycle),
        );
      }

      // filter on searchQuery
      if (searchQuery) {
        withFilters = withFilters.filter(
          (result: Result) =>
            result.name?.toLowerCase().includes(searchQuery) ||
            result.description?.toLowerCase().includes(searchQuery),
        );
      }

      setFilteredResults(withFilters);
    }
  }, [filters, searchQuery, results]);

  if (loading || error || !results) return null;

  const resetFilters = () => {
    setFilters({
      selected: 'All',
      checked: [],
    });
  };

  const updateSelected = (filter: string) => {
    setFilters(prevState => ({
      ...prevState,
      selected: filter,
    }));
  };

  const updateChecked = (filter: string) => {
    if (filters.checked.includes(filter)) {
      setFilters(prevState => ({
        ...prevState,
        checked: prevState.checked.filter(item => item !== filter),
      }));
      return;
    }

    setFilters(prevState => ({
      ...prevState,
      checked: [...prevState.checked, filter],
    }));
  };

  return (
    <>
      <Grid container>
        {showFilters && (
          <Grid item xs={3}>
            <Filters
              filters={filters}
              resetFilters={resetFilters}
              updateSelected={updateSelected}
              updateChecked={updateChecked}
            />
          </Grid>
        )}
        <Grid item xs={showFilters ? 9 : 12}>
          <Table
            options={{ paging: true, search: false }}
            data={filteredResults}
            columns={columns}
            title={
              <TableHeader
                searchQuery={searchQuery}
                numberOfResults={filteredResults.length}
                numberOfSelectedFilters={
                  (filters.selected !== 'All' ? 1 : 0) + filters.checked.length
                }
                handleToggleFilters={() => toggleFilters(!showFilters)}
              />
            }
          />
        </Grid>
      </Grid>
    </>
  );
};
