import React, { FC } from 'react';
import { Content } from '@backstage/core';
import { Grid } from '@material-ui/core';
import { Builds } from './lib/Builds';
import { Layout } from '../../components/Layout';
import { PluginHeader } from '../../components/PluginHeader';

export const BuildsPage: FC<{}> = () => (
  <Layout>
    <Content>
      <PluginHeader title="All builds" />
      <Grid container spacing={3} direction="column">
        <Grid item>
          <Builds />
        </Grid>
      </Grid>
    </Content>
  </Layout>
);
