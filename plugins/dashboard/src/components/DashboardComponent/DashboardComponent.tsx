import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { Header, Page, Content } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import { DashboardTable } from '../../../../../packages/app/src/components/custom';
import { LeftNavComponent } from '../LeftNavComponent';
import { useDashboard } from '../../hooks/useDashboard';

const useStyles = makeStyles({
  gridPadding: {
    padding: '10px',
  },
});

export const DashboardComponent = () => {
  const classes = useStyles();
  const [table, setTable] = useState('home');
  let data: any = {};
  data = useDashboard();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!data.loading && dashboardData === null) {
      setDashboardData(data.value.data);
    }
  });

  return (
    <Page themeId="tool">
      <Header title="DevOps Dashboard"></Header>
      <Content>
        <Grid container>
          <Grid
            container
            lg={2}
            item={true}
            direction="column"
            className={classes.gridPadding}
          >
            <LeftNavComponent tableProp={{ table, setTable }} />
          </Grid>
          <Grid
            container
            lg={10}
            item={true}
            direction="column"
            className={classes.gridPadding}
          >
            <Grid item>
              <DashboardTable data={dashboardData} />
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
