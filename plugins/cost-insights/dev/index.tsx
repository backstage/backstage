/*
 * Copyright 2020 The Backstage Authors
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
import { createDevApp } from '@backstage/dev-utils';
import { ExampleCostInsightsClient } from '../src/example';
import { costInsightsApiRef } from '../src/api';
import {
  costInsightsPlugin,
  CostInsightsPage,
  CostInsightsProjectGrowthInstructionsPage,
  CostInsightsLabelDataflowInstructionsPage,
  EntityCostInsightsContent,
} from '../src/plugin';
import { Content, Header, Page } from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

const mockEntity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'backstage',
    description: 'backstage.io',
  },
  spec: {
    lifecycle: 'production',
    type: 'service',
    owner: 'user:guest',
  },
};

createDevApp()
  .registerPlugin(costInsightsPlugin)
  .registerApi({
    api: costInsightsApiRef,
    deps: {},
    factory: () => new ExampleCostInsightsClient(),
  })
  .addPage({
    title: 'Cost Insights',
    element: <CostInsightsPage />,
  })
  .addPage({
    title: 'Growth',
    element: <CostInsightsProjectGrowthInstructionsPage />,
  })
  .addPage({
    title: 'Labelling',
    element: <CostInsightsLabelDataflowInstructionsPage />,
  })
  .addPage({
    title: 'Entity',
    element: (
      <Page themeId="home">
        <Header title="Entity" />

        <Content>
          <Grid container>
            <Grid item md={12}>
              <EntityProvider entity={mockEntity}>
                <EntityCostInsightsContent />
              </EntityProvider>
            </Grid>
          </Grid>
        </Content>
      </Page>
    ),
  })
  .render();
