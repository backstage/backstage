/*
 * Copyright 2020 The Backstage Authors
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
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { sidebarConfig } from '@backstage/core-components';

const useStyles = makeStyles<Theme, { size: number }>(theme => ({
  avatar: {
    width: ({ size }) => size,
    height: ({ size }) => size,
    fontSize: ({ size }) => size * 0.7,
    border: `1px solid ${theme.palette.textSubtle}`,
  },
}));

type Props = { size?: number; picture: string | undefined };

export const ProviderSettingsAvatar = ({ size, picture }: Props) => {
  const { iconSize } = sidebarConfig;
  const classes = useStyles(size ? { size } : { size: iconSize });

  return <Avatar src={picture} className={classes.avatar} />;
};
