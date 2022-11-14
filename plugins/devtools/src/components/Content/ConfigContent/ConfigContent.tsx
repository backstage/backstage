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
import {
  Box,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  useTheme,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import ReactJson from 'react-json-view';
import { useConfig } from '../../../hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperStyle: {
      padding: theme.spacing(2),
    },
  }),
);

/** @public */
export const ConfigContent = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { config, loading, error } = useConfig();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return (
    <Box>
      <Paper className={classes.paperStyle}>
        <ReactJson
          src={config as object}
          name="config"
          enableClipboard={false}
          theme={theme.palette.type === 'dark' ? 'monokai' : 'rjv-default'}
        />
      </Paper>
    </Box>
  );
};
