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

import React, { Fragment, PropsWithChildren, useCallback } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { ApiIcon } from './api-icon';
import { PluginLink } from './plugin-link';
import { DevToolApiWithPlugin } from '../types';
import { PluginIcon, DependenciesIcon, DependentsIcon } from '../utils/icons';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  nested2: {
    paddingLeft: theme.spacing(8),
  },
}));

export interface ListItemProps {
  api: DevToolApiWithPlugin;
  inPlugin?: boolean;
}

export function ApiListItem(props: PropsWithChildren<ListItemProps>) {
  const classes = useStyles();

  const { api, inPlugin, children } = props;

  const [open, setOpen] = React.useState(false);

  const handleOpen = useCallback(() => {
    setOpen(isOpen => !isOpen);
  }, [setOpen]);

  return (
    <Fragment>
      <ListItem button onClick={handleOpen}>
        <ListItemIcon>
          <ApiIcon id={api.id} />
        </ListItemIcon>
        <ListItemText primary={api.id} />
        <ListItemAvatar>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemAvatar>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
        <List component="div" disablePadding>
          {!api.plugin || inPlugin ? null : (
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <PluginIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    Provided by <PluginLink pluginId={api.plugin?.id} />
                  </>
                }
              />
            </ListItem>
          )}
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <DependenciesIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                api.dependencies.length === 0
                  ? 'No dependencies'
                  : 'Dependencies:'
              }
            />
          </ListItem>
          {api.dependencies.map(dep => (
            <ListItem button className={classes.nested2}>
              <ListItemIcon>
                <ApiIcon id={dep.id} />
              </ListItemIcon>
              <ListItemText primary={dep.id} />
            </ListItem>
          ))}
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <DependentsIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                api.dependents.length === 0 ? 'No dependents' : 'Dependents:'
              }
            />
          </ListItem>
          {api.dependents.map(dep => (
            <ListItem button className={classes.nested2}>
              <ListItemIcon>
                <ApiIcon id={dep.id} />
              </ListItemIcon>
              <ListItemText primary={dep.id} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Fragment>
  );
}
