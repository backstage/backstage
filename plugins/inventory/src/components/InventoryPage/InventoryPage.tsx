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
import { Typography } from '@material-ui/core';
import { Content, InfoCard, Header, Page, pageTheme } from '@backstage/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// TODO(freben): Connect to backend
const STATIC_DATA = [
  { id: 'backstage-frontend', kind: 'website' },
  { id: 'backstage-backend', kind: 'service' },
  { id: 'backstage-microsite', kind: 'website' },
];

const InventoryPage: FC<{}> = () => {
  return (
    <Page theme={pageTheme.home}>
      <Header title="Inventory" subtitle="All your stuff" />
      <Content>
        <Typography variant="h3">All of it</Typography>
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
                {STATIC_DATA.map(d => (
                  <TableRow key={d.id}>
                    <TableCell>{d.id}</TableCell>
                    <TableCell>{d.kind}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </InfoCard>
      </Content>
    </Page>
  );
};

export default InventoryPage;
