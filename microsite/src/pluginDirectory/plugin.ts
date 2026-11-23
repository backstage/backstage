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
import { loadLatestBackstageVersion } from '../../../scripts/plugin-directory/latestBackstageVersion';
import { loadPluginManifests } from '../../../scripts/plugin-directory/load';
import type { PluginManifest } from '../../../scripts/plugin-directory/manifest';
import { calcIsNewPlugin } from '../util/calcIsNewPlugin';

export type PluginData = PluginManifest & { slug: string; isNew: boolean };

const detailPageComponent =
  '@site/src/components/pluginDirectory/PluginDetailPage.tsx';

export default function pluginDirectoryPlugin({
  siteDir,
}: LoadContext): Plugin<unknown> {
  const manifestDirectory = join(siteDir, 'data', 'plugins');
  const latestBackstageVersionPath = join(
    siteDir,
    'data',
    'latest-backstage-version.yaml',
  );

  return {
    name: 'plugin-directory',
    getPathsToWatch() {
      return [join(manifestDirectory, '*.yaml'), latestBackstageVersionPath];
    },
    async loadContent() {
      const manifests = await loadPluginManifests(manifestDirectory);
      return manifests.map(manifest =>
        calcIsNewPlugin({ ...manifest, isNew: false }),
      );
    },
    async contentLoaded({ content: loadedContent, actions }) {
      // Docusaurus types plugin content as `unknown` where plugins are
      // registered, so narrow it to what `loadContent` returns.
      const content = loadedContent as PluginData[];
      const latestBackstageVersion = await loadLatestBackstageVersion(
        latestBackstageVersionPath,
      );
      const latestBackstageVersionPathData = await actions.createData(
        'latest-backstage-version.json',
        // Docusaurus treats a falsy module as a missing default export, so
        // wrap the version in an object to keep it renderable when unknown.
        JSON.stringify({ version: latestBackstageVersion?.version ?? null }),
      );

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
          modules: {
            plugin: dataPath,
            latestBackstageVersion: latestBackstageVersionPathData,
          },
        });
      }
    },
  };
}
