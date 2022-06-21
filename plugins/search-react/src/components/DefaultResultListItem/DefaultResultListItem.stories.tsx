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

import { Button } from '@backstage/core-components';
import { lightTheme } from '@backstage/theme';
import { Grid } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import GroupIcon from '@material-ui/icons/Group';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { DefaultResultListItem } from './DefaultResultListItem';

export default {
  title: 'Plugins/Search/DefaultResultListItem',
  component: DefaultResultListItem,
  decorators: [
    (Story: () => JSX.Element) => (
      <MemoryRouter>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Story />
          </Grid>
        </Grid>
      </MemoryRouter>
    ),
  ],
};

const mockSearchResult = {
  location: 'search/search-result',
  title: 'Search Result 1',
  text: 'some text from the search result',
  owner: 'some-example-owner',
};

export const Default = () => {
  return <DefaultResultListItem result={mockSearchResult} />;
};

export const WithIcon = () => {
  return (
    <DefaultResultListItem
      result={mockSearchResult}
      icon={<FindInPageIcon color="primary" />}
    />
  );
};

export const WithSecondaryAction = () => {
  return (
    <DefaultResultListItem
      result={mockSearchResult}
      secondaryAction={
        <Button
          to="#"
          size="small"
          aria-label="owner"
          variant="text"
          startIcon={<GroupIcon />}
          style={{ textTransform: 'lowercase' }}
        >
          {mockSearchResult.owner}
        </Button>
      }
    />
  );
};
export const WithHighlightedResults = () => {
  return (
    <DefaultResultListItem
      result={mockSearchResult}
      highlight={{
        preTag: '<tag>',
        postTag: '</tag>',
        fields: { text: 'some <tag>text</tag> from the search result' },
      }}
    />
  );
};

export const WithCustomHighlightedResults = () => {
  const customTheme = {
    ...lightTheme,
    overrides: {
      ...lightTheme.overrides,
      BackstageHighlightedSearchResultText: {
        highlight: {
          color: 'inherit',
          backgroundColor: 'inherit',
          fontWeight: 'bold',
          textDecoration: 'underline',
        },
      },
    },
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline>
        <DefaultResultListItem
          result={mockSearchResult}
          highlight={{
            preTag: '<tag>',
            postTag: '</tag>',
            fields: { text: 'some <tag>text</tag> from the search result' },
          }}
        />
      </CssBaseline>
    </ThemeProvider>
  );
};
