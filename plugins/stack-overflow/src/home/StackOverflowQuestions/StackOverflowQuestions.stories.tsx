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

import { HomePageStackOverflowQuestions } from '../../plugin';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { ConfigReader } from '@backstage/config';
import { Grid } from '@material-ui/core';
import React, { ComponentType } from 'react';
import { StackOverflowIcon } from '../../icons';

export default {
  title: 'Plugins/Home/Components/StackOverflow',
  component: HomePageStackOverflowQuestions,
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <>
          <TestApiProvider
            apis={[
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
      ),
  ],
};

export const Default = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageStackOverflowQuestions
        requestParams={{
          tagged: 'backstage',
          site: 'stackoverflow',
          pagesize: 5,
        }}
      />
    </Grid>
  );
};

export const WithIcon = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageStackOverflowQuestions
        requestParams={{
          tagged: 'backstage',
          site: 'stackoverflow',
          pagesize: 5,
        }}
        icon={<StackOverflowIcon />}
      />
    </Grid>
  );
};
