import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { DashboardTable } from '../../../../../packages/app/src/components/custom';
import { LeftNavComponent } from '../LeftNavComponent';

export const DashboardComponent = () => (
  <Page themeId="tool">
    <Header title="DEV OPS Dashboard">
    </Header>
    <Content>
      <Grid container > 
    <Grid lg={2} direction="column">
      <LeftNavComponent />
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
