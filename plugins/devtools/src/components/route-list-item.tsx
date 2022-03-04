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

import React, { Fragment, useCallback, useMemo, CSSProperties } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import TranslateIcon from '@material-ui/icons/Translate';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { PluginIcon, DependentsIcon } from '../utils/icons';
import { RouteObjectInfo } from '../hooks/routes';
import { PluginLink } from './plugin-link';

export interface RouteItemProps {
  route: RouteObjectInfo;
  level?: number;
  inPlugin?: boolean;
}

export function RouteListItem({ route, level = 2, inPlugin }: RouteItemProps) {
  const { path, children, refs, caseSensitive } = route;

  const [open, setOpen] = React.useState(false);

  const handleOpen = useCallback(() => {
    setOpen(isOpen => !isOpen);
  }, [setOpen]);

  const indentStyle = useMemo(
    (): CSSProperties => ({ paddingLeft: level * 16 }),
    [level],
  );

  const singleEnd = getSingleEndedChild(route);
  const title = useMemo(
    () => (!singleEnd ? path : `${path} (${singleEnd})`),
    [path, singleEnd],
  );

  return (
    <Fragment>
      <ListItem style={indentStyle} button onClick={handleOpen}>
        <ListItemIcon>
          <SubdirectoryArrowRightIcon />
        </ListItemIcon>
        <ListItemText primary={title} />
        <ListItemAvatar>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemAvatar>
      </ListItem>
      <Collapse style={indentStyle} in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {refs.map((ref, i) => (
            <Fragment key={i}>
              <ListItem button>
                <ListItemIcon>
                  <PluginIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    inPlugin ? (
                      <>Provided as: "{ref.name}"</>
                    ) : (
                      <>
                        Provided by:{' '}
                        <PluginLink pluginId={ref.plugin?.getId()}>
                          {ref.plugin?.getId()}
                        </PluginLink>{' '}
                        as "{ref.name}"
                      </>
                    )
                  }
                />
              </ListItem>
              {ref.routeRef.params.length === 0 ? null : (
                <ListItem button>
                  <ListItemIcon>
                    <ViewColumnIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Params: ${ref.routeRef.params.join(', ')}`}
                  />
                </ListItem>
              )}
              {refs.length < 2 ? null : <Divider />}
            </Fragment>
          ))}

          <ListItem button>
            <ListItemIcon>
              <TranslateIcon />
            </ListItemIcon>
            <ListItemText
              primary={`Case ${caseSensitive ? '' : 'in'}sensitive`}
            />
          </ListItem>

          {children.length === 0 ? null : (
            <ChildRoutes routes={children} level={level} />
          )}
        </List>
      </Collapse>
    </Fragment>
  );
}

function getSingleEndedChild(route: RouteObjectInfo) {
  if (
    route.children.length === 1 &&
    route.children[0].refs.length === 0 &&
    (route.children[0].path === '/' || route.children[0].path === '/*')
  ) {
    return route.children[0].path;
  }
  return undefined;
}

interface ChildRoutesProps {
  routes: RouteObjectInfo[];
  level: number;
}

function ChildRoutes({ routes, level }: ChildRoutesProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = useCallback(() => {
    setOpen(isOpen => !isOpen);
  }, [setOpen]);

  if (
    routes.length === 1 &&
    routes[0].refs.length === 0 &&
    (routes[0].path === '/' || routes[0].path === '/*')
  ) {
    return null;
  }

  return (
    <>
      <ListItem button onClick={handleOpen}>
        <ListItemIcon>
          <DependentsIcon />
        </ListItemIcon>
        <ListItemText primary="Child routes" />
        <ListItemAvatar>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemAvatar>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {routes.map((subRoute, i) => (
          <RouteListItem
            key={`${i}-${subRoute.path}`}
            route={subRoute}
            level={level + 1}
          />
        ))}
      </Collapse>
    </>
  );
}
