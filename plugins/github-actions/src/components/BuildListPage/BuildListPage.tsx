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
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useAsync } from 'react-use';
import { BuildStatusIndicator } from '../BuildStatusIndicator';
import { githubActionsApiRef } from '../../api';
import { useApi } from '@backstage/core-api';

const LongText = ({ text, max }: { text: string; max: number }) => {
  if (text.length < max) {
    return <span>{text}</span>;
  }
  return (
    <Tooltip title={text}>
      <span>{text.slice(0, max)}...</span>
    </Tooltip>
  );
};

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1, 0, 2, 0),
  },
}));

const PageContents = () => {
  const api = useApi(githubActionsApiRef);
  const { loading, error, value } = useAsync(() =>
    api.listBuilds('entity:spotify:backstage'),
  );

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <Typography variant="h2" color="error">
        Failed to load builds, {error.message}{' '}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="CI/CD builds table">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Branch</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Commit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {value!.map(build => (
            <TableRow key={build.uri}>
              <TableCell>
                <BuildStatusIndicator status={build.status} />
              </TableCell>
              <TableCell>
                <Typography>
                  <LongText text={build.branch} max={30} />
                </Typography>
              </TableCell>
              <TableCell>
                <Link to={`builds/${encodeURIComponent(build.uri)}`}>
                  <Typography color="primary">
                    <LongText text={build.message} max={60} />
                  </Typography>
                </Link>
              </TableCell>
              <TableCell>
                <Tooltip title={build.commitId}>
                  <Typography noWrap>{build.commitId.slice(0, 10)}</Typography>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const BuildListPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h3" className={classes.title}>
        CI/CD Builds
      </Typography>
      <PageContents />
    </div>
  );
};
