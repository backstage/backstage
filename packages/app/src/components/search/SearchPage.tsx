/*
 * Copyright 2021 Spotify AB
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
import { Grid, List, Card, CardContent } from '@material-ui/core';
import {
  SearchBarNext,
  SearchResultNext,
  DefaultResultListItem,
  SearchFilterNext,
} from '@backstage/plugin-search';
import { CatalogResultListItem } from '@backstage/plugin-catalog';

export const searchPage = (
  <Page themeId="home">
    <Header title="Search" subtitle={<Lifecycle alpha />} />
    <Content>
      <Grid container direction="row">
        <Grid item xs={12}>
          <SearchBarNext debounceTime={100} />
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <SearchFilterNext.Select
                name="kind"
                values={['Component', 'Template']}
              />
            </CardContent>
            <CardContent>
              <SearchFilterNext.Checkbox
                name="lifecycle"
                values={['experimental', 'production']}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <SearchResultNext>
            {({ results }) => (
              <List>
                {results.map(result => {
                  switch (result.type) {
                    case 'software-catalog':
                      return (
                        <CatalogResultListItem
                          key={result.document.location}
                          result={result.document}
                        />
                      );
                    default:
                      return (
                        <DefaultResultListItem
                          key={result.document.location}
                          result={result.document}
                        />
                      );
                  }
                })}
              </List>
            )}
          </SearchResultNext>
        </Grid>
      </Grid>
    </Content>
  </Page>
);
