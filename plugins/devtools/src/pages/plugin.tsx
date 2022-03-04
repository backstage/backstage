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

import { useDevToolsPlugins } from '../hooks/plugins';
import { PluginCard } from '../components/plugin-card';
import { useParams } from 'react-router';

export function PluginPage() {
  const { pluginId } = useParams();

  const { plugins } = useDevToolsPlugins();
  const plugin = plugins.find(p => p.id === pluginId);

  return !plugin ? (
    <div>No such plugin</div>
  ) : (
    <PluginCard plugin={plugin} asPage />
  );
}
