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

import React from 'react';

import { makeStyles, List, ListSubheader } from '@material-ui/core';

import { TechDocsNav } from '../types';

import { SidebarNavItem } from './SidebarNavItem';

const useStyles = makeStyles(theme => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  listSubheader: {
    lineHeight: '1.43',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

type SidebarNavProps = {
  items: TechDocsNav;
  title?: string;
  depth?: number;
  onShow?: () => void;
};

export const SidebarNav = ({
  title,
  items,
  depth = 0,
  onShow = () => {},
}: SidebarNavProps) => {
  const classes = useStyles();

  return (
    <List
      component="nav"
      className={classes.list}
      aria-labelledby={title ? 'techdocs-sidebar' : undefined}
      disablePadding={Boolean(depth)}
      subheader={
        title ? (
          <ListSubheader
            className={classes.listSubheader}
            color="inherit"
            component="div"
            id="techdocs-sidebar"
            disableSticky
          >
            {title}
          </ListSubheader>
        ) : undefined
      }
      dense
    >
      {items.map((item, index) => (
        <SidebarNavItem key={index} item={item} depth={depth} onShow={onShow} />
      ))}
    </List>
  );
};
