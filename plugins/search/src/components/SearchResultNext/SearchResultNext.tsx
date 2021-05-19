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
import { EmptyState, Link, Progress } from '@backstage/core';
import { Divider, List, ListItem, ListItemText } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';

import { useSearch } from '../SearchContext';

const DefaultResultListItem = ({ result }: any) => {
  return (
    <Link to={result.location}>
      <ListItem alignItems="flex-start">
        <ListItemText
          primaryTypographyProps={{ variant: 'h6' }}
          primary={result.title}
          secondary={result.text}
        />
      </ListItem>
      <Divider component="li" />
    </Link>
  );
};

export const SearchResultNext = () => {
  const {
    result: { loading, error, value },
  } = useSearch();

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

  if (!value) {
    return <EmptyState missing="data" title="Sorry, no results were found" />;
  }

  return (
    <List>
      {value.results.map(result => (
        <DefaultResultListItem
          key={result.document.location}
          result={result.document}
        />
      ))}
    </List>
  );
};
