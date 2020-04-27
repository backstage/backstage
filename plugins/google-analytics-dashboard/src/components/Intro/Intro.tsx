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
import { Typography, makeStyles } from '@material-ui/core';
import { InfoCard, StatusWarning, StatusOK } from '@backstage/core';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { API_KEY, CLIENT_ID } from 'api/config';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

type Props = {
  isSignedIn: boolean;
};

const Intro: FC<Props> = ({ isSignedIn }) => {
  const classes = useStyles();

  const CODE = `api/config.ts:

  export const API_KEY = "your api key" 
  export const CLIENT_ID = "your client id" 
  `;
  return (
    <InfoCard title="Getting Started">
      {!isSignedIn && (
        <Typography variant="body1">
          Sign in to Google using the button in the top right corner
        </Typography>
      )}
      <Typography variant="body1">Configure the plugin</Typography>
      <SyntaxHighlighter language="javascript" style={docco}>
        {CODE}
      </SyntaxHighlighter>
      <Typography variant="body1">Current status</Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <pre>api/config.ts</pre>
              </TableCell>
              <TableCell align="right">status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                <pre>API_KEY</pre>
              </TableCell>
              <TableCell align="right">
                {API_KEY ? <StatusOK /> : <StatusWarning />}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <pre>CLIENT_ID</pre>
              </TableCell>
              <TableCell align="right">
                {CLIENT_ID ? <StatusOK /> : <StatusWarning />}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </InfoCard>
  );
};

export default Intro;
