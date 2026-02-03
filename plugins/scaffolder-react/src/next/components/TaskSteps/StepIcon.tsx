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

import CircularProgress from '@material-ui/core/CircularProgress';
import { StepIconProps } from '@material-ui/core/StepIcon';
import { makeStyles } from '@material-ui/core/styles';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
import classNames from 'classnames';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ErrorOutline from '@material-ui/icons/ErrorOutline';

const useStepIconStyles = makeStyles(theme => ({
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
      return <ErrorOutline />;
    }

    if (skipped) {
      return <RemoveCircleOutline />;
    }

    return <PanoramaFishEyeIcon />;
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
