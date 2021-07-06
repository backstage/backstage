/*
 * Copyright 2021 The Backstage Authors
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
import { makeStyles } from '@material-ui/core';
import React from 'react';
import { BackstageTheme } from '@backstage/theme';
import { BuildStatus } from '../../api';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    marginTop: 8,
  },
  cell: (props: { status?: BuildStatus }) => {
    const statusBackgrounds: { [key in BuildStatus]: string } = {
      succeeded: theme.palette.success.main,
      failed: theme.palette.error.main,
      stopped: theme.palette.warning.main,
    };

    return {
      width: 12,
      height: 12,
      margin: '0 4px 4px 0',
      float: 'left',
      backgroundColor: statusBackgrounds[props.status!],
    };
  },
}));

const StatusCell = ({ status }: { status: BuildStatus }) => {
  const classes = useStyles({ status });
  return <div className={`${classes.cell} ${status}`} />;
};

export const StatusMatrixComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {[...Array(240).keys()].map(() => (
        <StatusCell status="succeeded" />
      ))}
    </div>
  );
};
