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

import React, { CSSProperties, PropsWithChildren, useMemo } from 'react';

import { parseEntityRef, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import { Link } from '@backstage/core-components';

import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { DevToolPlugin } from '../types';
import { PluginLink } from './plugin-link';
import { useDevToolsRoutes } from '../hooks/routes';
import { useDevToolsApis } from '../hooks-internal/apis';
import { useBackstageApp } from '../hooks-internal/backstage-app';
import { AnyList } from './any-list';
import { ApiListItem } from './api-list-item';
import { RouteListItem } from './route-list-item';
import { Unknown } from './unknown';
import { PluginRole } from './role-icon';

const useStyles = makeStyles(theme => ({
  description: {
    marginTop: -theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export interface PluginCardProps {
  plugin: DevToolPlugin;
  asPage?: boolean;
}

export function comparePlugins(a: DevToolPlugin, b: DevToolPlugin) {
  const _a = (a.plugin.info.name ?? a.plugin.getId()).toLocaleLowerCase(
    'en-US',
  );
  const _b = (b.plugin.info.name ?? b.plugin.getId()).toLocaleLowerCase(
    'en-US',
  );
  return _a.localeCompare(_b);
}

export function PluginCard({ plugin, asPage }: PluginCardProps) {
  const classes = useStyles();

  const app = useBackstageApp();

  const { info } = plugin.plugin;
  const ownerEntity = useMemo(
    () =>
      !info.ownerEntityRef
        ? undefined
        : parseEntityRef(info.ownerEntityRef, { defaultKind: 'group' }),
    [info.ownerEntityRef],
  );
  const ownerTitle = useMemo(
    () =>
      !ownerEntity ||
      ownerEntity.kind !== 'group' ||
      ownerEntity.namespace !== DEFAULT_NAMESPACE
        ? undefined
        : ownerEntity.name,
    [ownerEntity],
  );

  const pluginId = plugin.plugin.getId();

  const routes = useDevToolsRoutes();
  const providedRoutes = routes.routes.filter(route =>
    route.refs.some(ref => ref.plugin?.getId() === pluginId),
  );

  const apis = useDevToolsApis(app);
  const providedApis = apis.filter(api =>
    plugin.providedApiIds.includes(api.id),
  );

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          title={info.name ? 'Name' : 'ID'}
        >
          <PluginLink pluginId={asPage ? undefined : pluginId}>
            {info.name ?? pluginId}
          </PluginLink>
        </Typography>
        {!info.description ? null : (
          <Typography
            variant="body2"
            component="p"
            className={classes.description}
          >
            {info.description}
          </Typography>
        )}
        <Grid container spacing={1}>
          <TableRow title="Name">{info.name}</TableRow>

          <TableRow title="ID">{pluginId}</TableRow>

          <TableRow title="Package">
            {(info.packageJson as any)?.name ? (
              (info.packageJson as any).name
            ) : (
              <Unknown />
            )}
          </TableRow>

          <TableRow title="Version">{info.version}</TableRow>

          <TableRow title="Role">
            <PluginRole info={info} />
          </TableRow>

          <TableRow title="Owner">
            {!ownerEntity ? (
              <Unknown />
            ) : (
              <EntityRefLink entityRef={ownerEntity} title={ownerTitle} />
            )}
          </TableRow>

          {!info.links.length ? null : (
            <TableRow title="Links">
              {info.links.map((link, i) => (
                <Typography key={`${i}-${link.url}`} component="p">
                  <Link to={link.url}>{link.title ?? link.url}</Link>
                </Typography>
              ))}
            </TableRow>
          )}

          {asPage || providedApis.length === 0 ? null : (
            <TableRow title="Provided APIs">
              {providedApis.map(api => (
                <Typography key={api.id} component="p">
                  {api.id}
                </Typography>
              ))}
            </TableRow>
          )}

          {asPage || providedRoutes.length === 0 ? null : (
            <TableRow title="Provided routes">
              {providedRoutes.map((route, i) => (
                <Typography key={`${i}-${route.path}`} component="p">
                  {route.path}
                </Typography>
              ))}
            </TableRow>
          )}
        </Grid>
        {!asPage || providedApis.length === 0 ? null : (
          <AnyList subtitle="Provided apis">
            {providedApis.map(api => (
              <ApiListItem key={api.id} api={api} inPlugin />
            ))}
          </AnyList>
        )}
        {!asPage || providedRoutes.length === 0 ? null : (
          <AnyList subtitle="Routes">
            {providedRoutes.map((route, i) => (
              <RouteListItem
                key={`${i}-${route.path}`}
                route={route}
                inPlugin
              />
            ))}
          </AnyList>
        )}
      </CardContent>
    </Card>
  );
}

const boldStyle: CSSProperties = { fontWeight: 'bold' };
function TableRow({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <>
      <Grid item sm={4}>
        <Typography style={boldStyle}>{title}</Typography>
      </Grid>
      <Grid item sm={8}>
        {typeof children === 'string' ? (
          <Typography variant="body2" component="p">
            {children}
          </Typography>
        ) : (
          children
        )}
      </Grid>
    </>
  );
}
