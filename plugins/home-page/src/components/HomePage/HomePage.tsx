import React, { FC } from 'react';
import { Typography, Grid } from '@material-ui/core';
import HomePageTimer from '../HomepageTimer';
import {
  Content,
  EntityLink,
  InfoCard,
  Header,
  Page,
  pageTheme,
} from '@spotify-backstage/core';
import SquadTechHealth from './SquadTechHealth';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const STATIC_DATA = [
  { id: 'backstage', kind: 'service' },
  { id: 'backstage-microsite', kind: 'website' },
];

const HomePage: FC<{}> = () => {
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
            <Typography variant="h3">Things you own</Typography>
            <InfoCard maxWidth>
              <TableContainer>
                <Table size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Kind</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map(d => (
                      <TableRow key={d.id}>
                        <TableCell>{d.entity}</TableCell>
                        <TableCell>{d.kind}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
