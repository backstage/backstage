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
import React from 'react';
import { useAsync } from 'react-use';

import { Typography, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableColumn } from '@backstage/core';
import Filters from '../Filters';
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
  currentTarget?: String;
};

const TableHeader = ({ searchTerm, numberOfResults }) => {
  const classes = useStyles();

  const handleToggleFilters = () => {
    console.log('toggle');
  };

  return (
    <div className={classes.tableHeader}>
      <Filters handleToggleFilters={handleToggleFilters} />
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
  const searchApi = new SearchApi();

  const { loading, error, value: results } = useAsync(() => {
    return searchApi.getSearchData();
  }, []);

  if (loading || error || !results) return null;

  const filteredResults = results.filter(
    (result: any) =>
      result.name?.toLowerCase().includes(currentTarget) ||
      result.description?.toLowerCase().includes(currentTarget),
  );

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
      <Table
        options={{ paging: true, search: false }}
        data={filteredResults}
        columns={columns}
        title={
          <TableHeader
            searchTerm={currentTarget}
            numberOfResults={filteredResults.length}
          />
        }
      />
    </>
  );
};

export default SearchResult;
