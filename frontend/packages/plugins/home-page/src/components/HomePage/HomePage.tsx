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
import { inventoryV1 } from '@backstage/protobuf-definitions';

const useStyles = makeStyles<Theme>(theme => ({
  mainContentArea: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  pageBody: {
    padding: theme.spacing(3),
  },
  avatarButton: {
    padding: theme.spacing(2),
  },
}));

const HomePage: FC<{}> = () => {
  const classes = useStyles();
  const columns = [
    { id: 'entity', label: 'ID' },
    { id: 'kind', label: 'Kind' },
  ];

  const data = [
    { id: 'backstage', kind: 'service' },
    { id: 'backstage-microsite', kind: 'website' },
  ].map(({ id, kind }) => {
    return {
      id,
      entity: (
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
          <Grid container direction="row" spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h3" style={{ padding: '8px 0 16px 0' }}>
                Things you own
              </Typography>
              <InfoCard maxWidth>
                <SortableTable data={data} columns={columns} orderBy="id" />
              </InfoCard>
            </Grid>
            <Grid item xs={6}>
              <SquadTechHealth />
            </Grid>
          </Grid>
        </div>
      </div>
    </Page>
  );
};

export default HomePage;
