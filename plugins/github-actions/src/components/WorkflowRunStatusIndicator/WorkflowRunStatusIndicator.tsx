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

import { IconComponent } from '@backstage/core';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import ProgressIcon from '@material-ui/icons/Autorenew';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import UnknownIcon from '@material-ui/icons/Help';
import React from 'react';

type Props = {
  status?: string;
};

type StatusStyle = {
  icon: IconComponent;
  color: string;
};

const styles: { [key: string]: StatusStyle } = {
  unknown: {
    icon: UnknownIcon,
    color: '#f49b20',
  },
  completed: {
    icon: SuccessIcon,
    color: '#1db855',
  },
  queued: {
    icon: UnknownIcon,
    color: '#5BC0DE',
  },
  in_progress: {
    icon: ProgressIcon,
    color: '#BEBEBE',
  },
};

const getIconStyle = (status?: string): StatusStyle => {
  return styles[status ?? 'unknown'] ?? styles.unknown;
};

const useStyles = makeStyles<Theme, StatusStyle>({
  icon: style => ({
    color: style.color,
  }),
});

export const WorkflowRunStatusIndicator = ({ status }: Props) => {
  const style = getIconStyle(status);
  const classes = useStyles(style);
  const Icon = style.icon;

  return (
    <Typography
      className={classes.icon}
      style={{
        display: 'flex',
        alignItems: 'center',
        textTransform: 'capitalize',
      }}
    >
      <Icon /> &nbsp;{`${status}`}
    </Typography>
  );
};
