/*
 * Copyright 2022 The Backstage Authors
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

import React, { useCallback, useEffect, useState } from 'react';

import { useAsync } from 'react-use';
import { useApi, useApp } from '@backstage/core-plugin-api';
import {
  InteractiveLink,
  useDrawer,
} from '@backstage/plugin-interactive-drawers';
import { SearchBar } from '@backstage/plugin-search';
import {
  SearchDocument,
  SearchResultSet,
} from '@backstage/plugin-search-common';
import { searchApiRef } from '@backstage/plugin-search-react';
import { Theme, makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  searchRoot: {
    padding: '2px 4px',
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  searchBox: {
    margin: 8,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export function SearchPopOut() {
  const { searchBox } = useStyles();

  const { Progress } = useApp().getComponents();
  const searchApi = useApi(searchApiRef);

  const [searchTerm, setSearchTerm] = useState('');

  const { setTitle } = useDrawer();
  useEffect(() => {
    setTitle('Search');
  }, [setTitle]);

  const searchResult = useAsync(async () => {
    return !searchTerm.trim()
      ? ({ results: [] as any[] } as SearchResultSet)
      : searchApi.query({ term: searchTerm });
  }, [searchTerm, searchApi]);

  const cleanResults = searchResult.value?.results ?? [];

  const onChange2 = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  const renderContent = () => {
    if (searchResult.loading) {
      return <Progress />;
    }
    if (searchResult.error) {
      return <div>Error: {searchResult.error.message}</div>;
    }
    return cleanResults.map(({ type, document }) => (
      <InteractiveLink
        tooltip={document.title}
        key={document.location}
        to={document.location}
        title={makeTitle(type, document as any)}
      />
    ));
  };

  return (
    <div>
      <div className={searchBox}>
        <Paper>
          <SearchBar onChange={onChange2} />
        </Paper>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
}

function makeTitle(type: string, doc: SearchDocument & Record<string, string>) {
  if (type === 'software-catalog') {
    return `${doc.kind}: ${doc.title}`;
  } else if (type === 'techdocs') {
    return `Documentation: ${doc.componentType} ${doc.name}: ${doc.title}`;
  }
  return doc.title;
}
