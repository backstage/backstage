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

import { TemplateBackstageLogo } from './TemplateBackstageLogo';
import { TemplateBackstageLogoIcon } from './TemplateBackstageLogoIcon';
import {
  HomePageToolkit,
  HomePageCompanyLogo,
  HomePageStarredEntities,
} from '../plugin';
import { wrapInTestApp, TestApiProvider, MockStorageApi} from '@backstage/test-utils';
import { Content, Page, InfoCard } from '@backstage/core-components';
import {
  starredEntitiesApiRef,
  entityRouteRef,
  DefaultStarredEntitiesApi
} from '@backstage/plugin-catalog-react';
import {
  HomePageSearchBar,
  SearchContextProvider,
  searchApiRef,
  searchPlugin,
} from '@backstage/plugin-search';
import { Grid, makeStyles } from '@material-ui/core';
import React, { ComponentType } from 'react';

const mockStorageApi = MockStorageApi.create();
mockStorageApi
  .forBucket('starredEntities')
  .set('entityRefs', [
    'component:default/example-starred-entity',
    'component:default/example-starred-entity-2',
    'component:default/example-starred-entity-3',
    'component:default/example-starred-entity-4'
  ]);

export default {
  title: 'Plugins/Home/Templates',
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <>
          <TestApiProvider
            apis={[
              [
                starredEntitiesApiRef,
                new DefaultStarredEntitiesApi({
                  storageApi: mockStorageApi,
                }),
              ],
              [searchApiRef, { query: () => Promise.resolve({ results: [] }) }],
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
  searchBar: {
    display: 'flex',
    maxWidth: '60vw',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: '8px 0',
    borderRadius: '50px',
    margin: 'auto',
  },
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
            <Grid container item xs={12} alignItems="center" direction="row">
              <HomePageSearchBar
                classes={{ root: classes.searchBar }}
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
                  <div style={{ height: 210 }} />
                </InfoCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{ height: 210 }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};

