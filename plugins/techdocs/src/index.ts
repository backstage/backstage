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
 * The Backstage plugin that renders technical documentation for your components
 *
 * @packageDocumentation
 */

import {
  TechDocsEntityMetadata,
  TechDocsMetadata,
} from '@backstage/plugin-techdocs-react';

export * from './types';
export * from './api';
export * from './client';
export * from './reader';
export * from './search';
export * from './home';
export {
  EntityTechdocsContent,
  TechDocsCustomHome,
  TechDocsIndexPage,
  TechdocsPage,
  TechDocsReaderPage,
  TechDocsSearchResultListItem,
  techdocsPlugin as plugin,
  techdocsPlugin,
} from './plugin';
export {
  isTechDocsAvailable,
  LegacyEmbeddedDocsRouter as EmbeddedDocsRouter,
  Router,
} from './Router';

export type { TechDocsSearchResultListItemProps } from './search/components/TechDocsSearchResultListItem';

/**
 * @deprecated Import from `@backstage/plugin-techdocs-react` instead
 *
 * @public
 */
type DeprecatedTechDocsMetadata = TechDocsMetadata;

/**
 * @deprecated Import from `@backstage/plugin-techdocs-react` instead
 *
 * @public
 */
type DeprecatedTechDocsEntityMetadata = TechDocsEntityMetadata;

export type {
  DeprecatedTechDocsEntityMetadata as TechDocsEntityMetadata,
  DeprecatedTechDocsMetadata as TechDocsMetadata,
};

export * from './overridableComponents';
