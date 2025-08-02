/*
 * Copyright 2025 The Backstage Authors
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
import { Button, Box } from '@material-ui/core';
import { makeStyles, type Theme } from '@material-ui/core/styles';
import { ErrorPanel } from '@backstage/core-components';

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      margin: theme.spacing(2, 0),
    },
    actions: {
      marginTop: theme.spacing(2),
    },
  }),
  { name: 'TasksErrorDisplay' },
);

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <ErrorPanel error={error} />
      {onRetry && (
        <Box className={classes.actions}>
          <Button variant="outlined" color="primary" onClick={onRetry}>
            Refresh
          </Button>
        </Box>
      )}
    </Box>
  );
};
