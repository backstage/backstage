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
import {
  EmptyState,
  Link,
  Progress,
  Table,
  TableColumn,
  useApi,
} from '@backstage/core';
import {
  Divider,
  Grid,
  makeStyles,
  Typography,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ExportIcon from '@material-ui/icons/GetApp';

import React, { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { Result, SearchResults, searchApiRef } from '../../apis';

import { Filters, FiltersButton, FiltersState } from '../Filters';

const useStyles = makeStyles(theme => ({
  searchQuery: {
    color: theme.palette.text.primary,
    background: theme.palette.background.default,
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
  exportMenu: {
    position: 'absolute',
    top: '25px',
    right: '25px',
    zIndex: 1,
  },
  tableContainer: {
    position: 'relative',
  },
  exportIcon: {
    fontSize: '19px',
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

// TODO: move out column to make the search result component more generic
const columns: TableColumn[] = [
  {
    title: 'Name',
    field: 'name',
    highlight: true,
    render: (result: Partial<Result>) => (
      <Link to={result.url || ''}>{result.name}</Link>
    ),
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
            <span className={classes.searchQuery}>"{searchQuery}"</span>{' '}
          </Typography>
        ) : (
          <Typography variant="h6">{`${numberOfResults} results`}</Typography>
        )}
      </Grid>
    </div>
  );
};

export const SearchResult = ({ searchQuery }: SearchResultProps) => {
  const classes = useStyles();
  const searchApi = useApi(searchApiRef);

  const [showFilters, toggleFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FiltersState>({
    selected: '',
    checked: [],
  });

  const [filteredResults, setFilteredResults] = useState<SearchResults>([]);

  const toCSV = (objArray: any[]) => {
    const formatResults = (results: Array<Result>) =>
      results.map(result => ({
        name: result.name,
        description: result.description,
        owner: result.owner,
        kind: result.kind,
        lifecycle: result.lifecycle,
        url: result.url,
      }));
    objArray.splice(0, 0, {
      name: 'Name',
      description: 'Description',
      owner: 'Owner',
      kind: 'Kind',
      lifecycle: 'Lifecycle',
      url: 'URL',
    });
    const formattedArray = formatResults(objArray);
    const array =
      typeof formattedArray !== 'object'
        ? JSON.parse(formattedArray)
        : formattedArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const key in array[i]) {
        if (array[i].hasOwnProperty(key)) {
          if (line !== '') line += ',';
          line += array[i][key];
        }
      }
      str += `${line}\r\n`;
    }

    return str;
  };

  const convertor = (JSONData: any[]) => {
    if (!JSONData?.length) {
      return;
    }

    const values = toCSV(JSONData);
    const reportTitle = `csv_globalSearch_${new Date().getTime()}`;
    const fileName = reportTitle.replace(/ /g, '_');
    const uri = `data:text/csv;charset=utf-8,${escape(values)}`;
    const link = document.createElement('a');

    link.href = uri;
    link.style.visibility = 'hidden';
    link.download = `${fileName}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportClick = () => {
    convertor(filteredResults);
  };

  const { loading, error, value: results } = useAsync(() => {
    return searchApi.getSearchResult();
  }, []);

  useEffect(() => {
    if (results) {
      let withFilters = results;

      // apply filters

      // filter on selected
      if (selectedFilters.selected !== '') {
        withFilters = results.filter((result: Result) =>
          selectedFilters.selected.includes(result.kind),
        );
      }

      // filter on checked
      if (selectedFilters.checked.length > 0) {
        withFilters = withFilters.filter(
          (result: Result) =>
            result.lifecycle &&
            selectedFilters.checked.includes(result.lifecycle),
        );
      }

      // filter on searchQuery
      if (searchQuery) {
        withFilters = withFilters.filter(
          (result: Result) =>
            result.name?.toLocaleLowerCase('en-US').includes(searchQuery) ||
            result.name
              ?.toLocaleLowerCase('en-US')
              .includes(searchQuery.split(' ').join('-')) ||
            result.description
              ?.toLocaleLowerCase('en-US')
              .includes(searchQuery),
        );
      }

      setFilteredResults(withFilters);
    }
  }, [selectedFilters, searchQuery, results]);
  if (loading) {
    return <Progress />;
  }
  if (error) {
    return (
      <Alert severity="error">
        Error encountered while fetching search results. {error.toString()}
      </Alert>
    );
  }
  if (!results || results.length === 0) {
    return <EmptyState missing="data" title="Sorry, no results were found" />;
  }

  const resetFilters = () => {
    setSelectedFilters({
      selected: '',
      checked: [],
    });
  };

  const updateSelected = (filter: string) => {
    setSelectedFilters(prevState => ({
      ...prevState,
      selected: filter,
    }));
  };

  const updateChecked = (filter: string) => {
    if (selectedFilters.checked.includes(filter)) {
      setSelectedFilters(prevState => ({
        ...prevState,
        checked: prevState.checked.filter(item => item !== filter),
      }));
      return;
    }

    setSelectedFilters(prevState => ({
      ...prevState,
      checked: [...prevState.checked, filter],
    }));
  };

  const filterOptions = results.reduce(
    (acc, curr) => {
      if (curr.kind && acc.kind.indexOf(curr.kind) < 0) {
        acc.kind.push(curr.kind);
      }
      if (curr.lifecycle && acc.lifecycle.indexOf(curr.lifecycle) < 0) {
        acc.lifecycle.push(curr.lifecycle);
      }
      return acc;
    },
    {
      kind: [] as Array<string>,
      lifecycle: [] as Array<string>,
    },
  );

  return (
    <>
      <Grid container>
        {showFilters && (
          <Grid item xs={3}>
            <Filters
              filters={selectedFilters}
              filterOptions={filterOptions}
              resetFilters={resetFilters}
              updateSelected={updateSelected}
              updateChecked={updateChecked}
            />
          </Grid>
        )}
        <Grid item xs={showFilters ? 9 : 12} className={classes.tableContainer}>
          <div className={classes.exportMenu}>
            <Button
              aria-controls="fade-menu"
              aria-haspopup="true"
              onClick={() => handleExportClick()}
            >
              <ExportIcon className={classes.exportIcon} /> Export
            </Button>
          </div>
          <Table
            options={{ paging: true, pageSize: 20, search: false }}
            data={filteredResults}
            columns={columns}
            title={
              <TableHeader
                searchQuery={searchQuery}
                numberOfResults={filteredResults.length}
                numberOfSelectedFilters={
                  (selectedFilters.selected !== '' ? 1 : 0) +
                  selectedFilters.checked.length
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
