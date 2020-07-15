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
  LinearProgress,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useAsync } from 'react-use';
import { BuildStatusIndicator } from '../BuildStatusIndicator';
import { githubActionsApiRef } from '../../api';
import { Link, useApi, githubAuthApiRef } from '@backstage/core';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    // height: 400,
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

const BuildInfoCardContent = () => {
  const api = useApi(githubActionsApiRef);
  const githubApi = useApi(githubAuthApiRef);

  const status = useAsync(async () => {
    const token = await githubApi.getAccessToken('repo');
    return api.listBuilds({ owner: 'spotify', repo: 'backstage', token });
  });

  if (status.loading) {
    return <LinearProgress />;
  } else if (status.error) {
    return (
      <Typography variant="h2" color="error">
        Failed to load builds, {status.error.message}
      </Typography>
    );
  }

  const [build] =
    status.value?.filter(({ branch }) => branch === 'master') ?? [];

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography noWrap>Message</Typography>
          </TableCell>
          <TableCell>
            <Link to={`builds/${encodeURIComponent(build?.uri || '')}`}>
              <Typography color="primary">{build?.message}</Typography>
            </Link>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography noWrap>Commit ID</Typography>
          </TableCell>
          <TableCell>{build?.commitId}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography noWrap>Status</Typography>
          </TableCell>
          <TableCell>
            <BuildStatusIndicator status={build?.status} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export const BuildInfoCard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h2" className={classes.title}>
        Master Build
      </Typography>
      <BuildInfoCardContent />
    </div>
  );
};
