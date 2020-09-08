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
import React, { FC } from 'react';
import { Content } from '@backstage/core';
import { Grid } from '@material-ui/core';
import { Builds as BuildsComp } from './lib/Builds';
import { Layout } from '../../components/Layout';
import { PluginHeader } from '../../components/PluginHeader';
import { AppStateProvider } from '../../state/AppState';
import { Settings } from '../../components/Settings';

const BuildsPage: FC<{}> = () => (
  <AppStateProvider>
    <Layout>
      <Content>
        <Builds />
        <Settings />
      </Content>
    </Layout>
  </AppStateProvider>
);

const Builds = () => (
  <>
    <PluginHeader title="All builds" />
    <Grid container spacing={3} direction="column">
      <Grid item>
        <BuildsComp />
      </Grid>
    </Grid>
  </>
);

export default BuildsPage;
export { Builds };
