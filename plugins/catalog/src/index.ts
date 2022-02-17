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

/**
 * The Backstage plugin for browsing the Backstage catalog
 *
 * @packageDocumentation
 */

export * from './components/AboutCard';
export * from './components/CatalogKindHeader';
export * from './components/CatalogResultListItem';
export { CatalogTable } from './components/CatalogTable';
export type { EntityRow as CatalogTableRow } from './components/CatalogTable';
export * from './components/CatalogTable/columns';
export * from './components/EntityLayout';
export * from './components/EntityOrphanWarning';
export * from './components/EntityProcessingErrorsPanel';
export * from './components/EntitySwitch';
export * from './components/FilteredEntityLayout';
export * from './overridableComponents';
export {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
  catalogPlugin as plugin,
  EntityAboutCard,
  EntityDependencyOfComponentsCard,
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityHasSubcomponentsCard,
  EntityHasSystemsCard,
  EntityLinksCard,
  RelatedEntitiesCard,
} from './plugin';

export type { EntityLinksEmptyStateClassKey } from './components/EntityLinksCard';
export type { SystemDiagramCardClassKey } from './components/SystemDiagramCard';
export type { DefaultCatalogPageProps } from './components/CatalogPage';
