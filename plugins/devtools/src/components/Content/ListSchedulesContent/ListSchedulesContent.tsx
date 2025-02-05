/*
 * Copyright 2022 The Backstage Authors
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

import { Progress, WarningPanel } from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import ReactJson from 'react-json-view';
import { useScheduler } from '../../../hooks';
import { ConfigError } from '@backstage/plugin-devtools-common';
import { usePlugins } from '../../../hooks/usePlugins';
import { SchedulerContent } from '../SchedulerContent';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    warningStyle: {
      paddingBottom: theme.spacing(2),
    },
    paperStyle: {
      padding: theme.spacing(2),
    },
  }),
);
/** @public */
export const ListSchedulesContent = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { plugins, loading, error } = usePlugins();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!plugins) {
    return <Alert severity="error">Unable to load config</Alert>;
  }

  return (
    <Box>
      {plugins.map(plugin => (
        <Paper className={classes.paperStyle} key={plugin}>
          <Typography variant="h6">{plugin}</Typography>
          <SchedulerContent pluginId={plugin} />
        </Paper>
      ))}
    </Box>
  );
};
