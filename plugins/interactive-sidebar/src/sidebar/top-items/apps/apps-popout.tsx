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

import React, { useMemo } from 'react';

import { useRouteObjects } from '@backstage/core-plugin-api';

import GenericIcon from '@material-ui/icons/CategoryOutlined';

import { makeStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import { Link } from '@backstage/core-components';
import { BackstageTheme } from '@backstage/plugin-interactive-drawers';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  modal: { padding: 8 },
  iconGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    margin: 0,
    gap: 16,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  appIcon: {
    position: 'relative',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.sidebarBorderColor,
    borderRadius: 8,
    width: 108,
    margin: '0 4px',
    display: 'inline-block',
    overflow: 'hidden',
    fontSize: '12px',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: theme.sidebarTextDimmedColor,
    '&:hover': {
      color: theme.sidebarTextDimmedColor,
      backgroundColor: 'rgba(0, 0, 0, 0.05)', // theme.sidebarSelectableBackgroundColor,
      boxShadow: '2px 2px 5px rgb(0 0 0 / 30%)',
      borderColor: '#cacaca',
    },
  },
  appIconSvg: {
    marginTop: 4,
    padding: 16,
    fontSize: 40,
    boxSizing: 'content-box',
  },
  appIconImage: {
    marginTop: 20,
    margin: 16,
    width: 32,
    height: 32,
    boxSizing: 'content-box',
  },
  appIconTitle: {
    margin: 8,
    marginTop: 0,
    fontSize: '1rem',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}));

function pathIsTopLevel(path: string) {
  return !path.includes('/');
}
function pathIsDynamic(path: string) {
  return path.includes('*') || path.includes(':');
}

type BackstageRouteObject = ReturnType<typeof useRouteObjects>[number];
function getRouteObjectTitleAndIcon(obj: BackstageRouteObject) {
  const routeRefs = [...obj.routeRefs];
  const title = routeRefs.find(routeRef => routeRef.title)?.title;
  const icon = routeRefs.find(routeRef => routeRef.icon)?.icon;
  return { title, icon };
}

function makeTitle(path: string) {
  return (
    path.at(0)?.toLocaleUpperCase('en-US') +
    path.slice(1).replace(/-(.)/g, m => ` ${m[1]}`.toLocaleUpperCase('en-US'))
  );
}

function useBackstageApps() {
  const routeObjects = useRouteObjects();

  return useMemo(
    () =>
      routeObjects
        .map(obj => {
          const { title, icon } = getRouteObjectTitleAndIcon(obj);
          return {
            path: obj.path,
            title,
            icon,
          };
        })
        .filter(
          route =>
            // Apps are either top-level...
            pathIsTopLevel(route.path) ||
            // or at least not dynamic, and have a title
            (!pathIsDynamic(route.path) && !!route.title),
        )
        .map(route => ({
          ...route,
          title: route.title ?? makeTitle(route.path),
        }))
        .sort((a, b) => {
          const titleCmp = a.title
            .toLocaleLowerCase('en-US')
            .localeCompare(b.title.toLocaleLowerCase('en-US'));
          if (titleCmp) {
            return titleCmp;
          }

          return a.path
            .toLocaleLowerCase('en-US')
            .localeCompare(b.path.toLocaleLowerCase('en-US'));
        }),
    [routeObjects],
  );
}

type AppInfo = ReturnType<typeof useBackstageApps>[number];

function AppIcon({ app }: { app: AppInfo }) {
  const { appIconSvg, appIconImage } = useStyles();

  const { icon: Icon } = app;

  if (!Icon) {
    return <GenericIcon className={appIconSvg} />;
  }

  if (typeof Icon === 'string') {
    return <img src={Icon} alt={app.title} className={appIconImage} />;
  }

  if (typeof Icon === 'function') {
    return <Icon className={appIconSvg} />;
  }

  return Icon;
}

export function Apps() {
  const apps = useBackstageApps();
  const { modal, iconGrid, appIcon, appIconTitle } = useStyles();

  return (
    <div className={modal}>
      <div className={iconGrid}>
        {apps.map(app => (
          <Tooltip key={app.path} title={app.title}>
            <Link to={app.path}>
              <div className={appIcon}>
                <AppIcon app={app} />
                <p className={appIconTitle}>{app.title}</p>
              </div>
            </Link>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
