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

import { FeaturedDocsCard } from '../../plugin';
import { ComponentType, PropsWithChildren } from 'react';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import Grid from '@material-ui/core/Grid';

const docsEntities = [
  {
    apiVersion: '1',
    kind: 'Location',
    metadata: {
      name: 'getting-started-with-backstage',
      title: 'Getting Started Docs',
      description:
        'An awesome doc you want to feature to help out your customers. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium magna ut molestie lacinia. Nullam eget bibendum est, vitae finibus neque.',
    },
    spec: {
      type: 'documentation',
    },
  },
];

export default {
  title: 'Plugins/Home/Components/FeaturedDocsCard',
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <TestApiProvider
          apis={[[catalogApiRef, catalogApiMock({ entities: docsEntities })]]}
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
      <FeaturedDocsCard
        filter={{
          'spec.type': 'documentation',
          'metadata.name': 'getting-started-with-backstage',
        }}
      />
    </Grid>
  );
};
