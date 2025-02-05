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

import { Progress } from '@backstage/core-components';
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

export const WarningContent = ({ error }: { error: ConfigError }) => {
  if (!error.messages) {
    return <Typography>{error.message}</Typography>;
  }

  const messages = error.messages as string[];

  return (
    <Box>
      {messages.map(message => (
        <Typography>{message}</Typography>
      ))}
    </Box>
  );
};

/** @public */
export const SchedulerContent = ({ pluginId }: { pluginId: string }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { schedules, loading, error } = useScheduler(pluginId);

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return null;
  }

  if (!schedules) {
    return <Alert severity="error">Unable to load schedules</Alert>;
  }

  return (
    <Box>
      <Paper className={classes.paperStyle}>
        <Typography variant="h6">{pluginId}</Typography>
        <Paper className={classes.paperStyle}>
          {schedules.map(e => (
            <>
              <p>
                {e.id} | {e.scope}
              </p>
              <ReactJson
                src={e.settings as object}
                name="schedule"
                enableClipboard={false}
                theme={theme.palette.type === 'dark' ? 'chalk' : 'rjv-default'}
              />
            </>
          ))}
        </Paper>
      </Paper>
    </Box>
  );
};
