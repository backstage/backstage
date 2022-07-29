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

export * from './types';
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
  techdocsPlugin as plugin,
  techdocsPlugin,
} from './plugin';
export * from './Router';

import {
  SyncResult,
  TechDocsApi,
  TechDocsMetadata,
  TechDocsStorageApi,
  TechDocsEntityMetadata,
  TechDocsReaderPageContentProvider,
  TechDocsReaderPageContentProviderProps,
  TechDocsReaderPageContentProviderRenderFunction,
  TechDocsReaderPageContentState,
  TechDocsReaderPageContentStateTypes,
  techdocsApiRef,
  techdocsStorageApiRef,
} from '@backstage/plugin-techdocs-react';

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#techdocsApiRef}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#techdocsApiRef} instead.
 * @public
 */
const deprecatedTechdocsApiRef = techdocsApiRef;

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#techdocsStorageApiRef}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#techdocsStorageApiRef} instead.
 * @public
 */
const deprecatedTechdocsStorageApiRef = techdocsStorageApiRef;
/**
 * {@inheritDoc @backstage/plugin-techdocs-react#TechDocsReaderPageContentProvider}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#TechDocsReaderPageContentProvider} instead.
 * @public
 */
const DeprecatedTechDocsReaderPageContentProvider =
  TechDocsReaderPageContentProvider;

export {
  deprecatedTechdocsApiRef as techdocsApiRef,
  deprecatedTechdocsStorageApiRef as techdocsStorageApiRef,
  DeprecatedTechDocsReaderPageContentProvider as TechDocsReaderPageContentProvider,
};

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#TechDocsMetadata}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#TechDocsMetadata} instead.
 * @public
 */
type DeprecatedTechDocsMetadata = TechDocsMetadata;

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#TechDocsEntityMetadata}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#TechDocsEntityMetadata} instead.
 * @public
 */
type DeprecatedTechDocsEntityMetadata = TechDocsEntityMetadata;

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#TechDocsReaderPageContentState}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#TechDocsReaderPageContentState} instead.
 * @public
 */
type DeprecatedReaderState = TechDocsReaderPageContentState;

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#TechDocsReaderPageContentStateTypes}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#TechDocsReaderPageContentStateTypes} instead.
 * @public
 */
type DeprecatedContentStateTypes = TechDocsReaderPageContentStateTypes;

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#SyncResult}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#SyncResult} instead.
 * @public
 */
type DeprecatedSyncResult = SyncResult;

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#TechDocsApi}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#TechDocsApi} instead.
 * @public
 */
type DeprecatedTechDocsApi = TechDocsApi;

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#TechDocsStorageApi}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#TechDocsStorageApi} instead.
 * @public
 */
type DeprecatedTechDocsStorageApi = TechDocsStorageApi;

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#TechDocsReaderPageContentProviderProps}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#TechDocsReaderPageContentProviderProps} instead.
 * @public
 */
type DeprecatedTechDocsReaderProviderProps =
  TechDocsReaderPageContentProviderProps;

/**
 * {@inheritDoc @backstage/plugin-techdocs-react#TechDocsReaderPageContentProviderRenderFunction}
 * @deprecated Use {@link @backstage/plugin-techdocs-react#TechDocsReaderPageContentProviderRenderFunction} instead.
 * @public
 */
type DeprecatedTechDocsReaderProviderRenderFunction =
  TechDocsReaderPageContentProviderRenderFunction;

export type {
  DeprecatedTechDocsEntityMetadata as TechDocsEntityMetadata,
  DeprecatedTechDocsMetadata as TechDocsMetadata,
  DeprecatedSyncResult as SyncResult,
  DeprecatedReaderState as ReaderState,
  DeprecatedContentStateTypes as ContentStateTypes,
  DeprecatedTechDocsApi as TechDocsApi,
  DeprecatedTechDocsStorageApi as TechDocsStorageApi,
  DeprecatedTechDocsReaderProviderProps as TechDocsReaderProviderProps,
  DeprecatedTechDocsReaderProviderRenderFunction as TechDocsReaderProviderRenderFunction,
};
