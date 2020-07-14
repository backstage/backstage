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
import { makeStyles, Theme } from '@material-ui/core';
import ProgressIcon from '@material-ui/icons/Autorenew';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import FailureIcon from '@material-ui/icons/Error';
import UnknownIcon from '@material-ui/icons/Help';
import React from 'react';
import { BuildStatus } from '../../api/types';

type Props = {
  status?: BuildStatus;
};

type StatusStyle = {
  icon: IconComponent;
  color: string;
};

const styles: { [key in BuildStatus]: StatusStyle } = {
  [BuildStatus.Null]: {
    icon: UnknownIcon,
    color: '#f49b20',
  },
  [BuildStatus.Success]: {
    icon: SuccessIcon,
    color: '#1db855',
  },
  [BuildStatus.Failure]: {
    icon: FailureIcon,
    color: '#CA001B',
  },
  [BuildStatus.Pending]: {
    icon: UnknownIcon,
    color: '#5BC0DE',
  },
  [BuildStatus.Running]: {
    icon: ProgressIcon,
    color: '#BEBEBE',
  },
};

const useStyles = makeStyles<Theme, StatusStyle>({
  icon: style => ({
    color: style.color,
  }),
});

export const BuildStatusIndicator = ({ status }: Props) => {
  const style = (status && styles[status]) || styles[BuildStatus.Null];
  const classes = useStyles(style);
  const Icon = style.icon;

  return (
    <div className={classes.icon}>
      <Icon />
    </div>
  );
};
