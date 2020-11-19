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
import React, { useState } from 'react';

import { Header, Content, Page } from '@backstage/core';
import { Grid } from '@material-ui/core';

import { SearchBar } from '../SearchBar';
import { SearchResult } from '../SearchResult';

export const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
  };

  const handleClearSearchBar = () => {
    setSearchQuery('');
  };

  return (
    <Page themeId="home">
      <Header title="Search" />
      <Content>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchBar
              handleSearch={handleSearch}
              handleClearSearchBar={handleClearSearchBar}
              searchQuery={searchQuery}
            />
          </Grid>
          <Grid item xs={12}>
            <SearchResult searchQuery={searchQuery.toLowerCase()} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
