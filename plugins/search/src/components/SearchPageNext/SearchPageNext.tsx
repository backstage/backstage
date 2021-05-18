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
import { Content, Header, Lifecycle, Page } from '@backstage/core';
import { Grid } from '@material-ui/core';
import { SearchBarNext } from '../SearchBarNext';
import { SearchResultNext } from '../SearchResultNext';
import { SearchContextProvider } from '../SearchContext';

export const SearchPageNext = () => {
  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Header title="Search" subtitle={<Lifecycle alpha />} />
        <Content>
          <Grid container direction="row">
            <Grid item xs={12}>
              <SearchBarNext />
            </Grid>
            <Grid item xs={3}>
              {/* filter component should be rendered here */}
              <p>filter</p>
            </Grid>
            <Grid item xs={9}>
              <SearchResultNext />
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
