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

import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { sidebarConfig } from './config';
import { Avatar, Typography } from '@material-ui/core';

const useStyles = makeStyles<Theme>(() => {
  const { drawerWidthOpen, userBadgeDiameter } = sidebarConfig;
  return {
    root: {
      width: drawerWidthOpen,
      display: 'flex',
      alignItems: 'center',
      color: '#b5b5b5',
      paddingLeft: 18,
      paddingTop: 14,
      paddingBottom: 14,
    },
    avatar: {
      width: userBadgeDiameter,
      height: userBadgeDiameter,
      marginRight: 8,
    },
  };
});

type Props = {
  imageUrl: string;
  name: string;
  hideName?: boolean;
};

export const LoggedUserBadge: FC<Props> = ({
  imageUrl,
  name,
  hideName = false,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar alt={name} src={imageUrl} className={classes.avatar} />
      {!hideName && <Typography variant="subtitle2">{name}</Typography>}
    </div>
  );
};
