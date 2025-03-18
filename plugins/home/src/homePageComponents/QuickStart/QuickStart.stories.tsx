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

import { QuickStartCard } from '../../plugin';
import React, { ComponentType, PropsWithChildren } from 'react';
import { wrapInTestApp } from '@backstage/test-utils';
import Grid from '@material-ui/core/Grid';
import ContentImage from './static/backstageSystemModel.png';

export default {
  title: 'Plugins/Home/Components/QuickStartCard',
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) => wrapInTestApp(<Story />),
  ],
};

export const Default = () => {
  return (
    <Grid item xs={12} md={6}>
      <QuickStartCard
        image={
          <img
            src={ContentImage}
            alt="quick start"
            width="100%"
            height="100%"
          />
        }
      />
    </Grid>
  );
};

export const Customized = () => {
  return (
    <Grid item xs={12} md={6}>
      <QuickStartCard
        title="Onboarding to the Catalog"
        modalTitle="Onboarding Quick Start"
        docsLinkTitle="Learn more with getting started docs"
        docsLink="https://backstage.io/docs/getting-started"
        image={
          <img
            src={ContentImage}
            alt="quick start"
            width="100%"
            height="100%"
          />
        }
        cardDescription="Backstage system model will help you create new entities"
      />
    </Grid>
  );
};
