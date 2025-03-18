/*
 * Copyright 2021 The Backstage Authors
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
import { Overrides } from '@material-ui/core/styles/overrides';
import { StyleRules } from '@material-ui/core/styles/withStyles';

import { EntityLinksEmptyStateClassKey } from './components/EntityLinksCard';
import { SystemDiagramCardClassKey } from './components/SystemDiagramCard';
import { EntityContextMenuClassKey } from './components/EntityContextMenu';
import { CatalogSearchResultListItemClassKey } from './components/CatalogSearchResultListItem';
import { CatalogTableToolbarClassKey } from './components/CatalogTable';
import { EntityLabelsEmptyStateClassKey } from './components/EntityLabelsCard';

/** @public */
export type PluginCatalogComponentsNameToClassKey = {
  PluginCatalogEntityLinksEmptyState: EntityLinksEmptyStateClassKey;
  PluginCatalogSystemDiagramCard: SystemDiagramCardClassKey;
  PluginCatalogEntityContextMenu: EntityContextMenuClassKey;
  PluginCatalogSearchResultListItem: CatalogSearchResultListItemClassKey;
  PluginCatalogTableToolbar: CatalogTableToolbarClassKey;
  PluginCatalogEntityLabelsEmptyState: EntityLabelsEmptyStateClassKey;
};

/** @public */
export type BackstageOverrides = Overrides & {
  [Name in keyof PluginCatalogComponentsNameToClassKey]?: Partial<
    StyleRules<PluginCatalogComponentsNameToClassKey[Name]>
  >;
};

declare module '@backstage/theme' {
  interface OverrideComponentNameToClassKeys
    extends PluginCatalogComponentsNameToClassKey {}
}
