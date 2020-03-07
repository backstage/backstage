import React, { FC } from 'react';
import { Typography, Grid } from '@material-ui/core';
import HomePageTimer from '../HomepageTimer';
import {
  Content,
  EntityLink,
  InfoCard,
  SortableTable,
  Header,
  Page,
  pageTheme,
} from '@spotify-backstage/core';
import SquadTechHealth from './SquadTechHealth';

const STATIC_DATA = [
  { id: 'backstage', kind: 'service' },
  { id: 'backstage-microsite', kind: 'website' },
];

const HomePage: FC<{}> = () => {
  const columns = [
    { id: 'entity', label: 'ID' },
    { id: 'kind', label: 'Kind' },
  ];

  const data = STATIC_DATA.map(({ id, kind }) => {
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
    <Page theme={pageTheme.home}>
      <Header
        title={profile ? `Hello, ${profile.givenName}` : 'Hello'}
        subtitle="Welcome to Backstage"
      >
        <HomePageTimer />
      </Header>
      <Content>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h3">
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
      </Content>
    </Page>
  );
};

export default HomePage;
