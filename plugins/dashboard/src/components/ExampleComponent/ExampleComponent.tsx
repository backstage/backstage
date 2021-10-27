import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  HeaderLabel,
} from '@backstage/core-components';
import { DashboardTable } from '../../../../../packages/app/src/components/custom';

export const ExampleComponent = () => (
  <Page themeId="tool">
    <Header title="DEV OPS DASHBOARD">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <Grid container spacing={3} direction="column">
        <Grid item>
            <DashboardTable />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
