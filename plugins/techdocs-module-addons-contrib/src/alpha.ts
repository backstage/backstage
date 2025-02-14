/*
 * Copyright 2025 The Backstage Authors
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
import { TechDocsAddonLocations } from '@backstage/plugin-techdocs-react';
import { TechDocsAddonBlueprint } from '@backstage/plugin-techdocs-react/alpha';
import { TextSizeAddon } from './TextSize';
import { ReportIssueAddon } from './ReportIssue';
import { ExpandableNavigationAddon } from './ExpandableNavigation';
import { LightBoxAddon } from './LightBox';

/** @alpha */
export const expandableNavigationAddonExtension = TechDocsAddonBlueprint.make({
  name: 'ExpandableNavigation',
  params: {
    name: 'ExpandableNavigation',
    location: TechDocsAddonLocations.PrimarySidebar,
    component: ExpandableNavigationAddon,
  },
});

/** @alpha */
export const reportIssueAddonExtension = TechDocsAddonBlueprint.make({
  name: 'ReportIssue',
  params: {
    name: 'ReportIssue',
    location: TechDocsAddonLocations.Content,
    component: ReportIssueAddon,
  },
});

/** @alpha */
export const textSizeAddonExtension = TechDocsAddonBlueprint.make({
  name: 'TextSize',
  params: {
    name: 'TextSize',
    location: TechDocsAddonLocations.Settings,
    component: TextSizeAddon,
  },
});

/** @alpha */
export const lightBoxAddonExtension = TechDocsAddonBlueprint.make({
  name: 'LightBox',
  params: {
    name: 'LightBox',
    location: TechDocsAddonLocations.Content,
    component: LightBoxAddon,
  },
});
