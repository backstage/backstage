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

import React, { Fragment, useCallback, useMemo } from 'react';
import {
  ApiFacetContext,
  ApiRef,
  BackstagePlugin,
  PluginContext,
  StoredLogEntry,
} from '@backstage/core-plugin-api';
import {
  ApiIcon,
  DevToolPlugin,
  PluginLink,
  useDevToolsPlugins,
} from '@backstage/plugin-devtools';
import {
  Collapse,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  makeStyles,
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';
import PluginIcon from '@material-ui/icons/SettingsInputHdmi';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
  },
  subheader: {
    zIndex: 0,
  },
  indent: {
    marginLeft: theme.spacing(4),
  },
  rotate: {
    transform: 'rotate(90deg)',
  },
}));

export interface LogEntryContextStackProps {
  entry: StoredLogEntry;
}

export function LogEntryContextStack({ entry }: LogEntryContextStackProps) {
  const classes = useStyles();

  const contextStack = useMemo(
    () => <ContextStack stack={entry.contextStack} />,
    [entry],
  );

  return (
    <List
      subheader={
        <ListSubheader className={classes.subheader}>
          API/Plugin context stack
        </ListSubheader>
      }
      className={classes.list}
    >
      {contextStack}
    </List>
  );
}

function ContextStack(props: { stack: ApiFacetContext[] }) {
  const { apiMap } = useDevToolsPlugins();
  const stack = useMemo(() => [...props.stack].reverse(), [props]);

  return (
    <>
      {stack.map((item, i) => (
        <StackItem key={i} apiMap={apiMap} item={item} />
      ))}
    </>
  );
}

interface StackItemProps {
  apiMap: Map<string, DevToolPlugin>;
  item: ApiFacetContext;
}
function StackItem({ apiMap, item }: StackItemProps) {
  const reversedPluginStack = useMemo(
    () => [...(item.pluginStack ?? [])].reverse(),
    [item],
  );

  if (!item.dependent && !item.pluginStack) {
    return <StackItemUnknown />;
  }

  if (item.dependent) {
    return <StackItemApi apiMap={apiMap} api={item.dependent} />;
  }

  if (!reversedPluginStack.length) {
    return <StackItemUnknown />;
  }

  return <StackItemPluginStack stack={reversedPluginStack} />;
}

function StackItemUnknown() {
  return (
    <ListItem>
      <ListItemIcon>
        <NotListedLocationIcon />
      </ListItemIcon>
      <ListItemText primary="Unknown" />
    </ListItem>
  );
}

interface StackItemApiProps {
  apiMap: Map<string, DevToolPlugin>;
  api: ApiRef<unknown>;
}
function StackItemApi({ apiMap, api }: StackItemApiProps) {
  const plugin = apiMap.get(api.id)?.plugin;

  const [open, setOpen] = React.useState(false);
  const handleClick = useCallback(() => {
    setOpen(value => !value);
  }, []);

  return (
    <>
      <ListItem onClick={handleClick}>
        <ListItemIcon>
          <ApiIcon id={api.id} />
        </ListItemIcon>
        <ListItemText primary={`API ${api.id}`} />
        <ListItemSecondaryAction>
          <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        </ListItemSecondaryAction>
      </ListItem>
      {!plugin ? null : (
        <Collapse in={open} mountOnEnter timeout="auto">
          <StackItemPlugin plugin={plugin} />
        </Collapse>
      )}
    </>
  );
}

function componentTitle(pluginContext: PluginContext) {
  const firstPluginName =
    pluginContext.plugin.info.name ?? pluginContext.plugin.getId();
  return `${pluginContext.componentName} (from plugin ${firstPluginName})`;
}

interface StackItemPluginStackProps {
  stack: PluginContext[];
}
function StackItemPluginStack({ stack }: StackItemPluginStackProps) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const handleClick = useCallback(() => {
    setOpen(value => !value);
  }, []);

  const collapsedTitle = `React component ${componentTitle(stack[0])}`;

  return (
    <>
      <ListItem onClick={handleClick}>
        <ListItemIcon>
          <UnfoldMoreIcon className={classes.rotate} />
        </ListItemIcon>
        <ListItemText primary={collapsedTitle} />
        <ListItemSecondaryAction>
          <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={open} mountOnEnter timeout="auto">
        <List
          subheader={
            <ListSubheader className={classes.subheader}>
              React component hierarchy
            </ListSubheader>
          }
          className={`${classes.list} ${classes.indent}`}
        >
          {stack.map((plugin, i) => (
            <Fragment key={`${i}-${plugin.plugin.getId()}`}>
              <StackItemComponent pluginContext={plugin} />
              <Divider />
            </Fragment>
          ))}
        </List>
      </Collapse>
    </>
  );
}

interface StackItemComponentProps {
  pluginContext: PluginContext;
}
function StackItemComponent({ pluginContext }: StackItemComponentProps) {
  const [open, setOpen] = React.useState(false);
  const handleClick = useCallback(() => {
    setOpen(value => !value);
  }, []);

  return (
    <>
      <ListItem onClick={handleClick}>
        <ListItemIcon>
          <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
        </ListItemIcon>
        <ListItemText primary={componentTitle(pluginContext)} />
      </ListItem>
      <Collapse in={open} mountOnEnter timeout="auto">
        <StackItemPlugin
          plugin={pluginContext.plugin}
          routeRef={pluginContext.routeRef}
        />
      </Collapse>
    </>
  );
}

interface StackItemPluginProps {
  plugin: BackstagePlugin;
  routeRef?: string;
}
function StackItemPlugin({ plugin, routeRef }: StackItemPluginProps) {
  return (
    <ListItem>
      <ListItemIcon>
        <PluginIcon />
      </ListItemIcon>
      <ListItemText
        primary={
          <>
            Provided by: <PluginLink pluginId={plugin.getId()} />
            {routeRef ? ` on route-ref "${routeRef}"` : null}
          </>
        }
      />
    </ListItem>
  );
}
