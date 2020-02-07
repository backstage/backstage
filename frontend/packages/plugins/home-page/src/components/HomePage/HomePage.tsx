import React, { FC } from 'react';
import { Typography, makeStyles, Theme, Grid } from '@material-ui/core';
import HomePageTimer from '../HomepageTimer';
import {
  EntityLink,
  InfoCard,
  SortableTable,
  Header,
  Page,
  theme,
} from '@backstage/core';
import SquadTechHealth from './SquadTechHealth';

const useStyles = makeStyles<Theme>(theme => ({
  mainContentArea: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  pageBody: {
    padding: theme.spacing(2),
  },
  avatarButton: {
    padding: theme.spacing(2),
  },
}));

const HomePage: FC<{}> = () => {
  const classes = useStyles();
  const data = [
    { id: 'service-1', system: 'system' },
    { id: 'service-2', system: 'system' },
  ];

  /*
  const columns = [
    { id: 'idLink', label: 'ID', sortValue: row => row.id },
    { id: 'systemLink', label: 'SYSTEM', sortValue: row => row.system },
  ];

  */
  const columns = [
    { id: 'idLink', label: 'ID' },
    { id: 'systemLink', label: 'SYSTEM' },
  ];

  return (
    <Page theme={theme.home}>
      <div className={classes.mainContentArea}>
        <Header title="This is Backstage!">
          <HomePageTimer />
        </Header>
        <div className={classes.pageBody}>
          <Grid container direction="column" spacing={6}>
            <Grid item>
              <SquadTechHealth />
            </Grid>
            <Grid item>
              <InfoCard title="Stuff you own">
                <SortableTable data={data} columns={columns} orderBy="id" />
                <Typography variant="body1">Welcome to Backstage!</Typography>
                <div>
                  <EntityLink kind="service" id="backstage-backend">
                    Backstage Backend
                  </EntityLink>
                  <EntityLink uri="entity:service:backstage-lb" subPath="ci-cd">
                    Backstage LB CI/CD
                  </EntityLink>
                </div>
              </InfoCard>
            </Grid>
          </Grid>
        </div>
      </div>
    </Page>
  );
};

export default HomePage;
