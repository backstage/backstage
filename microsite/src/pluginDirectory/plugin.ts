/*
 * Copyright 2026 The Backstage Authors
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
import { join } from 'node:path';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { loadPluginManifests } from './load';
import type { PluginData } from './manifest';

const detailPageComponent =
  '@site/src/components/pluginDirectory/PluginDetailPage.tsx';

export default function pluginDirectoryPlugin({
  siteDir,
}: LoadContext): Plugin<PluginData[]> {
  const manifestDirectory = join(siteDir, 'data', 'plugins');

  return {
    name: 'plugin-directory',
    getPathsToWatch() {
      return [join(manifestDirectory, '*.yaml')];
    },
    loadContent() {
      return loadPluginManifests(manifestDirectory);
    },
    async contentLoaded({ content, actions }) {
      for (const plugin of [...content].sort((a, b) =>
        a.slug.localeCompare(b.slug),
      )) {
        const dataPath = await actions.createData(
          `${plugin.slug}.json`,
          JSON.stringify(plugin),
        );
        actions.addRoute({
          path: `/plugins/${plugin.slug}`,
          exact: true,
          component: detailPageComponent,
          modules: { plugin: dataPath },
        });
      }
    },
  };
}
