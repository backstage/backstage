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

import { Link } from '@backstage/core';
import {
  Button,
  ButtonGroup,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { BuildStatusIndicator } from '../BuildStatusIndicator';
import { useApi } from '@backstage/core-api';
import { githubActionsApiRef } from '../../api';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    maxWidth: 720,
    margin: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1, 0, 2, 0),
  },
  table: {
    padding: theme.spacing(1),
  },
}));

export const BuildDetailsPage = () => {
  const api = useApi(githubActionsApiRef);
  const classes = useStyles();
  const { buildUri } = useParams();
  const status = useAsync(() => api.getBuild(buildUri), [buildUri]);

  if (status.loading) {
    return <LinearProgress />;
  } else if (status.error) {
    return (
      <Typography variant="h6" color="error">
        Failed to load build, {status.error.message}
      </Typography>
    );
  }

  const details = status.value;

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h3">
        <Link to="/builds">
          <Typography component="span" variant="h3" color="primary">
            &lt;
          </Typography>
        </Link>
        Build Details
      </Typography>
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography noWrap>Branch</Typography>
              </TableCell>
              <TableCell>{details?.build.branch}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Message</Typography>
              </TableCell>
              <TableCell>{details?.build.message}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Commit ID</Typography>
              </TableCell>
              <TableCell>{details?.build.commitId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Status</Typography>
              </TableCell>
              <TableCell>
                <BuildStatusIndicator status={details?.build.status} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Author</Typography>
              </TableCell>
              <TableCell>{details?.author}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Links</Typography>
              </TableCell>
              <TableCell>
                <ButtonGroup
                  variant="text"
                  color="primary"
                  aria-label="text primary button group"
                >
                  {details?.overviewUrl && (
                    <Button>
                      <Link to={details.overviewUrl}>GitHub</Link>
                    </Button>
                  )}
                  {details?.logUrl && (
                    <Button>
                      <Link to={details.logUrl}>Logs</Link>
                    </Button>
                  )}
                </ButtonGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
