/*
 * Copyright 2023 The Backstage Authors
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
import { LinearProgress, makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  failed: {
    backgroundColor: theme.palette.error.main,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
}));

/**
 * The visual progress of the task event stream
 */
export const TaskBorder = (props: {
  isComplete: boolean;
  isError: boolean;
}) => {
  const styles = useStyles();

  if (!props.isComplete) {
    return <LinearProgress variant="indeterminate" />;
  }

  return (
    <LinearProgress
      variant="determinate"
      classes={{ bar: props.isError ? styles.failed : styles.success }}
      value={100}
    />
  );
};
