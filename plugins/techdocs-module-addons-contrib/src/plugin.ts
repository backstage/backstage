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
import { ExpandableNavigationAddon } from './ExpandableNavigation';
import { ReportIssueAddon, ReportIssueProps } from './ReportIssue';
import { TextSizeAddon } from './TextSize';
import { LightBoxAddon } from './LightBox';

/**
 * The TechDocs addons contrib plugin
 *
 * @public
 */

export const techdocsModuleAddonsContribPlugin = createPlugin({
  id: 'techdocsModuleAddonsContrib',
});

/**
 * TechDocs addon that lets you expand/collapse the TechDocs main navigation
 * and keep the preferred state in local storage. The addon will render as
 * a button next to the site name if the documentation has nested navigation.
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
 * import { ExpandableNavigation } from '@backstage/plugin-techdocs-module-addons-contrib';
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
 *         <ExpandableNavigation />
 *       </TechDocsAddons>
 *     </Route>
 *   </FlatRoutes>;
 * };
 * ```
 *
 * @public
 */

export const ExpandableNavigation = techdocsModuleAddonsContribPlugin.provide(
  createTechDocsAddonExtension({
    name: 'ExpandableNavigation',
    location: TechDocsAddonLocations.PrimarySidebar,
    component: ExpandableNavigationAddon,
  }),
);

/**
 * TechDocs addon that lets you select text and open GitHub/Gitlab issues
 *
 * @remarks
 * Before using it, you should set up an `edit_uri` for your pages as explained {@link https://backstage.io/docs/features/techdocs/faqs#is-it-possible-for-users-to-suggest-changes-or-provide-feedback-on-a-techdocs-page | here} and remember, it only works for Github or Gitlab.
 *
 * @example
 * Here's a simple example:
 * ```
 * import {
 *   DefaultTechDocsHome,
 *   TechDocsIndexPage,
 *   TechDocsReaderPage,
 * } from '@backstage/plugin-techdocs';
 * import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
 * import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
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
 *         <ReportIssue />
 *       </TechDocsAddons>
 *     </Route>
 *   </FlatRoutes>;
 * };
 * ```
 *
 * @example
 * Here's an example with `debounceTime` and `templateBuilder` props:
 * ```
 * import {
 *   DefaultTechDocsHome,
 *   TechDocsIndexPage,
 *   TechDocsReaderPage,
 * } from '@backstage/plugin-techdocs';
 * import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
 * import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
 *
 * const templateBuilder = ({ selection }: ReportIssueTemplateBuilder) => (({
 *  title: 'Custom issue title',
 *  body: `Custom issue body: ${selection.toString()}`
 * }))
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
 *         <ReportIssue debounceTime={300} templateBuilder={templateBuilder} />
 *       </TechDocsAddons>
 *     </Route>
 *   </FlatRoutes>;
 * ```
 * @param props - Object that can optionally contain `debounceTime` and `templateBuilder` properties.
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
 * import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
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

/**
 * This TechDocs addon allows users to open images in a lightbox on documentation pages, they can navigate between images if there are several on one page.
 *
 * @remarks
 * The image size of the lightbox image is the same as the image size on the document page.
 *
 * @example
 * Here's a simple example:
 * ```
 * import {
 *   DefaultTechDocsHome,
 *   TechDocsIndexPage,
 *   TechDocsReaderPage,
 * } from '@backstage/plugin-techdocs';
 * import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
 * import { LightBox } from '@backstage/plugin-techdocs-module-addons-contrib';
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
 *         <LightBox />
 *       </TechDocsAddons>
 *     </Route>
 *   </FlatRoutes>;
 * };
 * ```
 *
 * @public
 */
export const LightBox = techdocsModuleAddonsContribPlugin.provide(
  createTechDocsAddonExtension({
    name: 'LightBox',
    location: TechDocsAddonLocations.Content,
    component: LightBoxAddon,
  }),
);
