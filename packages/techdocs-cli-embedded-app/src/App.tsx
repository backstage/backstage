/*
 * Copyright 2020 The Backstage Authors
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

import techdocsPlugin from '@backstage/plugin-techdocs/alpha';

import { createApp } from '@backstage/frontend-defaults';
import { ConfigReader } from '@backstage/core-app-api';
import catalogPlugin from '@backstage/plugin-catalog/alpha';

import { appApis, techdocsPluginApis } from './apis';
import { configLoader } from './config';

import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SidebarContent } from './components/Sidebar';
import {
  techDocsThemeToggleAddonModule,
  techdocsLiveReloadAddonModule,
} from './addons';

const appPlugin = createFrontendModule({
  pluginId: 'app',
  extensions: [...appApis, SidebarContent],
});

const app = createApp({
  features: [
    appPlugin,
    techdocsPlugin.withOverrides({
      extensions: [...techdocsPluginApis],
    }),
    catalogPlugin,
    techDocsThemeToggleAddonModule,
    techdocsLiveReloadAddonModule,
  ],
  advanced: {
    async configLoader() {
      const appConfigs = await configLoader();
      return { config: ConfigReader.fromConfigs(appConfigs) };
    },
  },
});

export default app.createRoot();
