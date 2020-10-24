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
import { useParams } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import SearchBar from '../SearchBar';
import SearchResult from '../SearchResult';

const SearchPage = () => {
  const { query } = useParams();
  const [currentTarget, setCurrentTarget] = useState('');

  const handleSearchInput = (event: any) => {
    setCurrentTarget(event.target.value);
  };

  const handleSearch = async (event: Event) => {
    event.preventDefault();
  };

  const handleClearSearchBar = () => {
    setCurrentTarget('');
  };

  return (
    <Page themeId="home">
      <Header title="Search" />
      <Content>
        <Grid container direction="row">
          <Grid item sm={12}>
            <SearchBar
              handleSearch={handleSearch}
              handleSearchInput={handleSearchInput}
              handleClearSearchBar={handleClearSearchBar}
              currentTarget={currentTarget}
            />
          </Grid>
          <Grid item sm={12}>
            <SearchResult currentTarget={currentTarget.toLowerCase()} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default SearchPage;
