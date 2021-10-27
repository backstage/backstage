import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { DashboardTable } from '../../../../../packages/app/src/components/custom';

export const DashboardComponent = () => (
  <Page themeId="tool">
    <Header title="DEV OPS Dashboard">
    </Header>
    <Content>
      <Grid container > 
    <Grid lg={2} direction="column">
      <Typography>This is where Left nav goes</Typography>
    </Grid>
      <Grid lg={10} direction="column">
        <Grid item>
            <DashboardTable />
        </Grid>
      </Grid>
      </Grid>
    </Content>
  </Page>
);
