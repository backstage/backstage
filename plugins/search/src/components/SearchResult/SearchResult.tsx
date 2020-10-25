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
import { Table, TableColumn } from '@backstage/core';
import { FilterButton, Filters } from '../Filters';

import SearchApi from '../../apis';

const useStyles = makeStyles(() => ({
  searchTerm: {
    background: '#eee',
    padding: '0.2%',
    borderRadius: '10%',
  },
  tableHeader: {
    marginTop: '10px',
    display: 'flex',
  },
  divider: {
    width: '1px',
    margin: '0 20px',
    padding: '15px 0',
  },
}));

type SearchResultProps = {
  currentTarget?: string;
};

type TableHeaderProps = {
  searchTerm?: string;
  numberOfSelectedFilters: number;
  numberOfResults: number;
  handleToggleFilters: () => any;
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
  searchTerm,
  numberOfSelectedFilters,
  numberOfResults,
  handleToggleFilters,
}: TableHeaderProps) => {
  const classes = useStyles();

  return (
    <div className={classes.tableHeader}>
      <FilterButton
        numberOfSelectedFilters={numberOfSelectedFilters}
        handleToggleFilters={handleToggleFilters}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <Grid item sm={12}>
        {searchTerm ? (
          <Typography variant="h6">
            {`${numberOfResults} `}
            {numberOfResults > 1 ? `results for ` : `result for `}
            <span className={classes.searchTerm}>"{searchTerm}"</span>{' '}
          </Typography>
        ) : (
          <Typography variant="h6">{`${numberOfResults} results`}</Typography>
        )}
      </Grid>
    </div>
  );
};

const SearchResult = ({ currentTarget }: SearchResultProps) => {
  const [showFilters, toggleFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    selected: 'All',
    checked: [],
  });

  const [filteredResults, setFilteredResults] = useState<Array<object>>([]);

  const searchApi = new SearchApi();

  const { loading, error, value: results } = useAsync(() => {
    return searchApi.getSearchData();
  }, []);

  useEffect(() => {
    if (results) {
      let withFilters = results;

      // apply filters

      // filter on selected
      if (filters.selected !== 'All') {
        withFilters = results.filter((result: any) =>
          filters.selected.includes(result.kind),
        );
      }

      // filter on checked
      if (filters.checked.length > 0) {
        withFilters = withFilters.filter((result: any) =>
          filters.checked.includes(result.lifecycle),
        );
      }

      // filter on searchTerm
      if (currentTarget) {
        withFilters = withFilters.filter(
          (result: any) =>
            result.name?.toLowerCase().includes(currentTarget) ||
            result.description?.toLowerCase().includes(currentTarget),
        );
      }

      setFilteredResults(withFilters);
    }
  }, [filters, currentTarget, results]);

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
      const index = filters.checked.indexOf(filter);
      filters.checked.splice(index);

      setFilters(prevState => ({
        ...prevState,
        checked: filters.checked,
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
          <Grid item sm={3}>
            <Filters
              filters={filters}
              resetFilters={resetFilters}
              updateSelected={updateSelected}
              updateChecked={updateChecked}
            />
          </Grid>
        )}
        <Grid item sm={showFilters ? 9 : 12}>
          <Table
            options={{ paging: true, search: false }}
            data={filteredResults}
            columns={columns}
            title={
              <TableHeader
                searchTerm={currentTarget}
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

export default SearchResult;
