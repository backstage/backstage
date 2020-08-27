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
import { useLocation } from 'react-router-dom';
import { useAsync } from 'react-use';
import { Link, useApi, googleAuthApiRef } from '@backstage/core';
import { GCPApiRef } from '../../api';

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

export const ProjectDetailsPage = () => {
  const api = useApi(GCPApiRef);
  const googleApi = useApi(googleAuthApiRef);
  const token = googleApi.getAccessToken(
    'https://www.googleapis.com/auth/cloud-platform.read-only',
  );

  const classes = useStyles();
  const location = useLocation();
  const status = useAsync(
    () =>
      api.getProject(
        decodeURIComponent(location.search.split('projectId=')[1]),
        token,
      ),
    [location.search],
  );

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
        <Link to="/gcp-projects">
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
                <Typography noWrap>Name</Typography>
              </TableCell>
              <TableCell>{details?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Project Number</Typography>
              </TableCell>
              <TableCell>{details?.projectNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Project ID</Typography>
              </TableCell>
              <TableCell>{details?.projectId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>State</Typography>
              </TableCell>
              <TableCell>
                <TableCell>{details?.lifecycleState}</TableCell>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Creation Time</Typography>
              </TableCell>
              <TableCell>{details?.createTime}</TableCell>
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
                  {details?.name && (
                    <Button>
                      <a href={details.name}>GCP</a>
                    </Button>
                  )}
                  {details?.name && (
                    <Button>
                      <a href={details.name}>Logs</a>
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
