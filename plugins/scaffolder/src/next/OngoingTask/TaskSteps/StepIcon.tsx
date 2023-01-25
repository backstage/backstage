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

import { BackstageTheme } from '@backstage/theme';
import { CircularProgress, makeStyles, StepIconProps } from '@material-ui/core';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import classNames from 'classnames';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

const useStepIconStyles = makeStyles((theme: BackstageTheme) => ({
  root: {
    color: theme.palette.text.disabled,
  },
  completed: {
    color: theme.palette.status.ok,
  },
  error: {
    color: theme.palette.status.error,
  },
}));

export const StepIcon = (props: StepIconProps & { skipped: boolean }) => {
  const classes = useStepIconStyles();
  const { active, completed, error, skipped } = props;

  const getMiddle = () => {
    if (active) {
      return <CircularProgress size="20px" />;
    }
    if (completed) {
      return <CheckCircleOutline />;
    }

    if (error) {
      return <DeleteOutline />;
    }

    if (skipped) {
      return <RemoveCircleOutline />;
    }

    return <FiberManualRecordIcon />;
  };

  return (
    <div
      className={classNames(classes.root, {
        [classes.completed]: completed,
        [classes.error]: error,
      })}
    >
      {getMiddle()}
    </div>
  );
};
