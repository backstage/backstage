/*
 * Copyright 2021 The Backstage Authors
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
  HomePageToolkit,
  HomePageCompanyLogo,
  HomePageStarredEntities,
  TemplateBackstageLogo,
  TemplateBackstageLogoIcon,
} from '@backstage/plugin-home';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Content, Page, InfoCard } from '@backstage/core-components';
import {
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
  entityRouteRef,
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/config';
import { HomePageSearchBar, searchPlugin } from '@backstage/plugin-search';
import {
  searchApiRef,
  SearchContextProvider,
} from '@backstage/plugin-search-react';
import { Grid, makeStyles } from '@material-ui/core';
import React, { ComponentType, PropsWithChildren } from 'react';

const entities = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock-starred-entity',
      title: 'Mock Starred Entity!',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock-starred-entity-2',
      title: 'Mock Starred Entity 2!',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock-starred-entity-3',
      title: 'Mock Starred Entity 3!',
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'mock-starred-entity-4',
      title: 'Mock Starred Entity 4!',
    },
  },
];

const catalogApi = catalogApiMock({ entities });

const starredEntitiesApi = new MockStarredEntitiesApi();
starredEntitiesApi.toggleStarred('component:default/example-starred-entity');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-2');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-3');
starredEntitiesApi.toggleStarred('component:default/example-starred-entity-4');

export default {
  title: 'Plugins/Home/Templates',
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <>
          <TestApiProvider
            apis={[
              [catalogApiRef, catalogApi],
              [starredEntitiesApiRef, starredEntitiesApi],
              [searchApiRef, { query: () => Promise.resolve({ results: [] }) }],
              [
                configApiRef,
                new ConfigReader({
                  stackoverflow: {
                    baseUrl: 'https://api.stackexchange.com/2.2',
                  },
                }),
              ],
            ]}
          >
            <Story />
          </TestApiProvider>
        </>,
        {
          mountedRoutes: {
            '/hello-company': searchPlugin.routes.root,
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      ),
  ],
};

const useStyles = makeStyles(theme => ({
  searchBarInput: {
    maxWidth: '60vw',
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50px',
    boxShadow: theme.shadows[1],
  },
  searchBarOutline: {
    borderStyle: 'none'
  }
}));

const useLogoStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(5, 0),
  },
  svg: {
    width: 'auto',
    height: 100,
  },
  path: {
    fill: '#7df3e1',
  },
}));

export const DefaultTemplate = () => {
  const classes = useStyles();
  const { svg, path, container } = useLogoStyles();

  return (
    <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo
              className={container}
              logo={<TemplateBackstageLogo classes={{ svg, path }} />}
            />
            <Grid container item xs={12} justifyContent='center'>
              <HomePageSearchBar
                InputProps={{ classes: { root: classes.searchBarInput, notchedOutline: classes.searchBarOutline }}}
                placeholder="Search"
              />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit
                  tools={Array(8).fill({
                    url: '#',
                    label: 'link',
                    icon: <TemplateBackstageLogoIcon />,
                  })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{ height: 370 }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
