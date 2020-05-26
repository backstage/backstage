/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC } from 'react';
import { Typography, Link, Grid } from '@material-ui/core';
import {
  Content,
  InfoCard,
  Header,
  HomepageTimer,
  Page,
  pageTheme,
} from '@backstage/core';
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
        <Link href={`entity/${kind}/${id}`}>
          <Typography color="primary">{id}</Typography>
        </Link>
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
        <HomepageTimer />
      </Header>
      <Content>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={6}>
            <Typography variant="h3">Things you own</Typography>
            <InfoCard>
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
