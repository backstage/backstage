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
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  makeStyles,
} from '@material-ui/core';
import { InfoCard, StatusWarning, StatusOK } from '@backstage/core';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { API_KEY, CLIENT_ID } from 'api/config';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Intro: FC<{}> = () => {
  const classes = useStyles();

  const CODE = `api/config.ts:

  export const API_KEY = "<your api key>" 
  export const CLIENT_ID = "<your client id>" 
  `;

  return (
    <InfoCard title="Getting Started">
      <Typography variant="body1">Configure the plugin</Typography>
      <SyntaxHighlighter language="javascript" style={docco}>
        {CODE}
      </SyntaxHighlighter>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
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
