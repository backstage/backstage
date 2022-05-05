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

import { createPlugin } from '@backstage/core-plugin-api';
import {
  createTechDocsAddonExtension,
  TechDocsAddonLocations,
} from '@backstage/plugin-techdocs-react';
import { ReportIssueAddon, ReportIssueProps } from './ReportIssue';
import { TextSizeAddon } from './TextSize';

/**
 * The TechDocs addons contrib plugin
 *
 * @public
 */

export const techdocsModuleAddonsContribPlugin = createPlugin({
  id: 'techdocsModuleAddonsContrib',
});

/**
 * TechDocs addon that lets you select text and open GitHub/Gitlab issues
 *
 * @public
 */

export const ReportIssue = techdocsModuleAddonsContribPlugin.provide(
  createTechDocsAddonExtension<ReportIssueProps>({
    name: 'ReportIssue',
    location: TechDocsAddonLocations.Content,
    component: ReportIssueAddon,
  }),
);

/**
 * This TechDocs addon allows users to customize text size on documentation pages, they can select how much they want to increase or decrease the font size via slider or buttons.
 *
 * @remarks
 * The default value for the font size is 100% of the HTML font size, if the theme does not have a `htmlFontSize` in its typography object, the addon will assume 16px as 100%, and remember, this setting is kept in the browser local storage.
 *
 * @example
 * Here's a simple example:
 * ```
 * import {
 *   DefaultTechDocsHome,
 *   TechDocsIndexPage,
 *   TechDocsReaderPage,
 * } from '@backstage/plugin-techdocs';
 * import { TechDocsAddons } from '@backstage/plugin-techdocs-react/alpha';
 * import { TextSize } from '@backstage/plugin-techdocs-module-addons-contrib';
 *
 *
 * const AppRoutes = () => {
 *   <FlatRoutes>
 *     // other plugin routes
 *     <Route path="/docs" element={<TechDocsIndexPage />}>
 *       <DefaultTechDocsHome />
 *     </Route>
 *     <Route
 *       path="/docs/:namespace/:kind/:name/*"
 *       element={<TechDocsReaderPage />}
 *     >
 *       <TechDocsAddons>
 *         <TextSize />
 *       </TechDocsAddons>
 *     </Route>
 *   </FlatRoutes>;
 * };
 * ```
 *
 * @public
 */
export const TextSize = techdocsModuleAddonsContribPlugin.provide(
  createTechDocsAddonExtension({
    name: 'TextSize',
    location: TechDocsAddonLocations.Settings,
    component: TextSizeAddon,
  }),
);
