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
  const [filters, setFilters] = useState<Array<string>>([]);
  const [filteredResults, setFilteredResults] = useState<Array<object>>([]);

  const searchApi = new SearchApi();

  const { loading, error, value: results } = useAsync(() => {
    return searchApi.getSearchData();
  }, []);

  useEffect(() => {
    if (results) {
      setFilteredResults(
        results
          .filter((result: any) =>
            filters.length > 0
              ? filters.includes(result.kind) ||
                filters.includes(result.lifecycle)
              : results,
          )
          .filter(
            (result: any) =>
              result.name?.toLowerCase().includes(currentTarget) ||
              result.description?.toLowerCase().includes(currentTarget),
          ),
      );
    }
  }, [filters, currentTarget, results]);

  if (loading || error || !results) return null;

  const updateSelectedFilters = (filter: string | Array<null>) => {
    if (filter instanceof Array || filter === 'All') {
      return setFilters([]);
    }

    return setFilters(prevFilters => [...prevFilters, filter]);
  };

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

  return (
    <>
      <Grid container>
        {showFilters && (
          <Grid item sm={3}>
            <Filters
              filters={filters}
              updateSelectedFilters={updateSelectedFilters}
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
                numberOfSelectedFilters={filters.length}
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
