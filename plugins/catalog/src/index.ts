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

export * from './apis';

export type {
  AboutCardProps,
  AboutContentProps,
  AboutFieldProps,
} from './components/AboutCard';
export { AboutContent, AboutField } from './components/AboutCard';
export * from './components/CatalogKindHeader';
export * from './components/CatalogSearchResultListItem';
export * from './components/CatalogTable';
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

export type { DependencyOfComponentsCardProps } from './components/DependencyOfComponentsCard';
export type { DependsOnComponentsCardProps } from './components/DependsOnComponentsCard';
export type { DependsOnResourcesCardProps } from './components/DependsOnResourcesCard';
export type {
  EntityLinksEmptyStateClassKey,
  EntityLinksCardProps,
} from './components/EntityLinksCard';
export type { SystemDiagramCardClassKey } from './components/SystemDiagramCard';
export type { DefaultCatalogPageProps } from './components/CatalogPage';
export type { EntityContextMenuClassKey } from './components/EntityContextMenu';
export type { HasComponentsCardProps } from './components/HasComponentsCard';
export type { HasResourcesCardProps } from './components/HasResourcesCard';
export type { HasSubcomponentsCardProps } from './components/HasSubcomponentsCard';
export type { HasSystemsCardProps } from './components/HasSystemsCard';
export type { RelatedEntitiesCardProps } from './components/RelatedEntitiesCard';
