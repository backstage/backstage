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
import { Grid } from '@material-ui/core';
import { useLog } from '@backstage/core-plugin-api';

import { useDevToolsPlugins } from '../hooks/plugins';
import { PluginCard, comparePlugins } from '../components/plugin-card';

export function PluginsPage() {
  const { plugins } = useDevToolsPlugins();

  const log = useLog();
  log.error('foo', 42, 'bar');

  setInterval(() => {
    makeDoThings(log, plugins)();
  }, 5000);

  makeDoThings(log, { plugins: 'heh no plugins' })();

  const orderedPlugins = useMemo(
    () => [...plugins].sort(comparePlugins),
    [plugins],
  );
  log.error('Ordered plugins', orderedPlugins);

  return (
    <Grid container>
      {orderedPlugins.map(plugin => (
        <Grid key={plugin.id} item sm={12} md={6} lg={4} xl={3}>
          <PluginCard plugin={plugin} />
        </Grid>
      ))}
    </Grid>
  );
}

function makeDoThings(log: ReturnType<typeof useLog>, plugins: any) {
  return () => {
    function Foo() {}
    const c = new (class Cls {
      a = 'foo';
      b = 123;
    })();
    log.error(
      'more',
      42,
      ['f', { a: 'b' }],
      { PluginsPage, plugins },
      c,
      Foo,
      'stuff',
    );
  };
}
