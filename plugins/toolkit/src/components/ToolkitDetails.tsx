/*
 * Copyright 2023 The Backstage Authors
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
import { Grid } from '@material-ui/core';
import { InfoCard, Page, Content, Header } from '@backstage/core-components';
import { Provider } from 'react-redux';

import { ToolkitList } from './ToolkitList/ToolkitList';
import Toolkit from './Toolkit/Toolkit';
import { store } from '../redux/store';

export const ToolkitDetails = () => (
  <Provider store={store}>
    <Page themeId="tool">
      <Header title="Welcome to toolkit!" />
      <Content>
        <Grid container item xs={12}>
          <Grid item xs={12} md={7}>
            <InfoCard title="Your Toolkit's">
              <ToolkitList checkable={false} />
            </InfoCard>
          </Grid>
          <Grid item xs={12} md={5}>
            <Toolkit mode="write" />
          </Grid>
        </Grid>
      </Content>
    </Page>
  </Provider>
);
