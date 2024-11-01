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
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Alert from '@mui/material/Alert';
import React from 'react';
import ReactJson from 'react-json-view';
import { useConfig } from '../../../hooks';
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
export const ConfigContent = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { configInfo, loading, error } = useConfig();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!configInfo) {
    return <Alert severity="error">Unable to load config data</Alert>;
  }

  return (
    <Box>
      {configInfo && configInfo.error && (
        <Box className={classes.warningStyle}>
          <WarningPanel title="Config validation failed">
            <WarningContent error={configInfo.error} />
          </WarningPanel>
        </Box>
      )}
      <Paper className={classes.paperStyle}>
        <ReactJson
          src={configInfo.config as object}
          name="config"
          enableClipboard={false}
          theme={theme.palette.mode === 'dark' ? 'chalk' : 'rjv-default'}
        />
      </Paper>
    </Box>
  );
};
