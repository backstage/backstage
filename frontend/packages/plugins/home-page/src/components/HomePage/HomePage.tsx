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
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'kind', label: 'Kind' },
  ];

  const data = [
    { id: 'backstage', kind: 'service' },
    { id: 'backstage-microsite', kind: 'website' },
  ].map(({ id, kind }) => {
    return {
      id: (
        <EntityLink kind={kind} id={id}>
          <Typography color="primary">{id}</Typography>
        </EntityLink>
      ),
      kind: <Typography>{kind}</Typography>,
    };
  });

  return (
    <Page theme={theme.home}>
      <div className={classes.mainContentArea}>
        <Header title="This is Backstage!">
          <HomePageTimer />
        </Header>
        <div className={classes.pageBody}>
          <Grid container direction="column" spacing={6}>
            <Grid item xs={12}>
              <SquadTechHealth />
            </Grid>
            <Grid item xs={4}>
              <InfoCard title="Stuff you own" maxWidth>
                <SortableTable data={data} columns={columns} orderBy="id" />
              </InfoCard>
            </Grid>
          </Grid>
        </div>
      </div>
    </Page>
  );
};

export default HomePage;
