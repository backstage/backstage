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
  Progress,
} from '@spotify-backstage/core';
import SquadTechHealth from './SquadTechHealth';
import { useAsync } from 'react-use';

import { inventoryV1 } from '@backstage/protobuf-definitions';

const client = new inventoryV1.Client('http://localhost:8080');

const entityUriRegex = /entity:service:(.*)/;

async function fetchServices() {
  const req = new inventoryV1.ListEntitiesRequest();
  req.setUriprefix('entity:service:');
  const res = await client.listEntities(req);

  return res
    .getEntitiesList()
    .map(entity => {
      const match = entity.getUri()?.match(entityUriRegex);
      console.log('DEBUG: match =', match);
      if (!match) {
        return undefined;
      }
      return { id: match[1], kind: 'service' };
    })
    .filter(Boolean)
    .map(x => x!);
}

const STATIC_DATA = [
  { id: 'backstage', kind: 'service' },
  { id: 'backstage-microsite', kind: 'website' },
];

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
  const status = useAsync(fetchServices);
  const columns = [
    { id: 'entity', label: 'ID' },
    { id: 'kind', label: 'Kind' },
  ];

  if (status.loading) {
    return <Progress />;
  }

  const data = STATIC_DATA.concat(status?.value ?? []).map(({ id, kind }) => {
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

  const profile = { givenName: 'Suzy' };

  return (
    <Page theme={theme.home}>
      <div className={classes.mainContentArea}>
        <Header
          title={profile ? `Hello, ${profile.givenName}` : 'Hello'}
          subtitle="Welcome to Backstage"
        >
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
