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
import { useApi } from '@backstage/core-api';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    // height: 400,
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

export const BuildInfoCard = () => {
  const classes = useStyles();
  const api = useApi(githubActionsApiRef);
  const status = useAsync(() => api.listBuilds('entity:spotify:backstage'));

  let content: JSX.Element;

  if (status.loading) {
    content = <LinearProgress />;
  } else if (status.error) {
    content = (
      <Typography variant="h2" color="error">
        Failed to load builds, {status.error.message}
      </Typography>
    );
  } else {
    const [build] =
      status.value?.filter(({ branch }) => branch === 'master') ?? [];

    content = (
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
  }

  return (
    <div className={classes.root}>
      <Typography variant="h2" className={classes.title}>
        Master Build
      </Typography>
      {content}
    </div>
  );
};
