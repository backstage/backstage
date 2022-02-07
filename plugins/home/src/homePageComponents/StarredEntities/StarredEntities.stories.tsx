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

import { HomePageStarredEntities } from '../../plugin';
import {
  wrapInTestApp,
  TestApiProvider,
  MockStorageApi,
} from '@backstage/test-utils';
import {
  starredEntitiesApiRef,
  entityRouteRef,
  DefaultStarredEntitiesApi,
} from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import React, { ComponentType } from 'react';

const mockStorageApi = MockStorageApi.create();
mockStorageApi
  .forBucket('starredEntities')
  .set('entityRefs', [
    'component:default/example-starred-entity',
    'component:default/example-starred-entity-2',
    'component:default/example-starred-entity-3',
    'component:default/example-starred-entity-4',
  ]);

export default {
  title: 'Plugins/Home/Components/StarredEntities',
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <TestApiProvider
          apis={[
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockStorageApi,
              }),
            ],
          ]}
        >
          <Story />
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      ),
  ],
};

export const Default = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageStarredEntities />
    </Grid>
  );
};
