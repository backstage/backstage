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

import React from 'react';
import { Typography, Link, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';
import MicDrop from './MicDrop';

interface IErrorPageProps {
  status: string;
  statusMessage: string;
  history: {
    goBack: () => void;
  };
}

const useStyles = makeStyles<BackstageTheme>(theme => ({
  container: {
    padding: theme.spacing(8),
  },
  title: {
    paddingBottom: theme.spacing(5),
  },
  subtitle: {
    color: theme.palette.textSubtle,
  },
}));

const ErrorPage = ({ status, statusMessage, history }: IErrorPageProps) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <MicDrop />
      <Grid item xs={12} sm={4}>
        <Typography variant="body1" className={classes.subtitle}>
          ERROR {status}: {statusMessage}
        </Typography>
        <Typography variant="h2" className={classes.title}>
          Looks like someone dropped the mic!
        </Typography>
        <Typography variant="h6">
          <Link data-testid="go-back-link" onClick={history.goBack}>
            Go back
          </Link>
          ... or if you think this is a bug, please file an{' '}
          <Link href="https://github.com/spotify/backstage/issues">issue.</Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ErrorPage;
