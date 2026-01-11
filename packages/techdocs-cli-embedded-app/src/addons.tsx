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
import { AddonBlueprint } from '@backstage/plugin-techdocs-react/alpha';
import { TechDocsAddonLocations } from '@backstage/plugin-techdocs-react';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { TechDocsThemeToggle } from './components/TechDocsPage';
import { TechDocsLiveReload } from './components/LiveReload/LiveReloadAddon';

const techDocsThemeToggleAddonExtension = AddonBlueprint.make({
  name: 'techdocs-theme-toggle-addon',
  params: {
    name: 'ThemeToggleAddon',
    component: TechDocsThemeToggle,
    location: TechDocsAddonLocations.Header,
  },
});

export const techDocsThemeToggleAddonModule = createFrontendModule({
  pluginId: 'techdocs',
  extensions: [techDocsThemeToggleAddonExtension],
});

const techdocsLiveReloadAddonExtension = AddonBlueprint.make({
  name: 'techdocs-live-reload-addon',
  params: {
    name: 'LiveReloadAddon',
    component: TechDocsLiveReload,
    location: TechDocsAddonLocations.Content,
  },
});

export const techdocsLiveReloadAddonModule = createFrontendModule({
  pluginId: 'techdocs',
  extensions: [techdocsLiveReloadAddonExtension],
});
